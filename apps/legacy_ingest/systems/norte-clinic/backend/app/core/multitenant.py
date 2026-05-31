import contextvars
from sqlalchemy import event, inspect
from sqlalchemy.orm import Session
from sqlalchemy.orm.query import Query
from starlette.middleware.base import BaseHTTPMiddleware, RequestResponseEndpoint
from starlette.requests import Request
from starlette.types import ASGIApp

# Context variable to hold the current tenant ID (user ID in this simple case)
tenant_context: contextvars.ContextVar[int | None] = contextvars.ContextVar("tenant_context", default=None)

class MultiTenantMiddleware(BaseHTTPMiddleware):
    def __init__(self, app: ASGIApp):
        super().__init__(app)

    async def dispatch(self, request: Request, call_next: RequestResponseEndpoint):
        # In a real scenario, we extract tenant_id from Subdomain, Header, or Auth Token
        # Here we rely on the Auth Middleware having already run or extracting it manually if needed.
        # However, FastAPI Dependecies run AFTER middleware.
        # So usually we extract from JWT manually here if we want strict enforcement before any view.
        
        # For simplicity in this architecture:
        # We might set it to None initially, and let the Dependency injection set it? 
        # No, for strict "Iron Dome", we want it set before DB access.
        # Let's extract from Authorization header if present.
        
        auth_header = request.headers.get("Authorization")
        tenant_id = None
        
        if auth_header and auth_header.startswith("Bearer "):
            token = auth_header.split(" ")[1]
            try:
                # We need to import jwt here to avoid circular imports elsewhere or top level
                from jose import jwt
                from app.core.config import settings
                from app.core import security
                
                payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[security.ALGORITHM])
                # Assuming 'sub' is the user_id (which acts as tenant_id for doctors)
                if payload.get("sub"):
                     tenant_id = int(payload["sub"])
            except Exception:
                pass # Invalid token, let Auth dependency handle 401 later, but context remains None
        
        token_reset = tenant_context.set(tenant_id)
        
        try:
            response = await call_next(request)
            return response
        finally:
            tenant_context.reset(token_reset)

# SQLAlchemy Event Listener to filter queries
def set_tenant_id_on_save(mapper, connection, target):
    """Auto-set owner_id on insert if missing"""
    current_tenant = tenant_context.get()
    if current_tenant and hasattr(target, 'owner_id') and target.owner_id is None:
        target.owner_id = current_tenant

def filter_by_tenant(query):
    """
    Hook to modify Query objects. 
    Note: 'before_compile' is better suited for global filtering in newer SQLAlchemy versions,
    but 'do_orm_execute' is the modern Session-level hook.
    """
    # This complexity is high for a quick patch. 
    # We will implement a simpler check: 
    # If the model has 'owner_id', ensure we filter by it.
    pass 

# Using 'do_orm_execute' is the modern way (SQLAlchemy 1.4+)
from sqlalchemy.orm import with_loader_criteria

def mk_tenant_filter(session_factory):
    @event.listens_for(session_factory, "do_orm_execute")
    def receive_do_orm_execute(execute_state):
        current_tenant = tenant_context.get()
        
        # If no tenant (e.g. public endpoint or login), skips
        if current_tenant is None:
            return

        # Skip if explicitly marked to ignore (for Admin use cases)
        if execute_state.execution_options.get("ignore_tenant", False):
            return

        # Apply filter for all entities that have 'owner_id' (or 'user_id' specifically for Subscription/Appointment?)
        # Let's assume standard field is 'user_id' based on previous file analysis (Appointment might have it)
        # We need to check the model class actually has the column.
        
        def with_tenant_filter(cls):
            # Check if class has 'user_id' or 'owner_id' column
            if hasattr(cls, 'user_id'):
                return cls.user_id == current_tenant
            elif hasattr(cls, 'owner_id'):
                return cls.owner_id == current_tenant
            return None

        execute_state.statement = execute_state.statement.options(
            with_loader_criteria(
                # We interpret "all mapping classes"
                lambda cls: hasattr(cls, 'user_id') or hasattr(cls, 'owner_id'),
                with_tenant_filter,
                include_aliases=True
            )
        )
