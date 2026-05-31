from starlette.middleware.base import BaseHTTPMiddleware
from fastapi import Request, Response
from fastapi.responses import JSONResponse

class TenantMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Skip tenant check for public endpoints (docs, health, auth, admin dashboard general)
        public_paths = [
            "/docs", 
            "/openapi.json", 
            "/api/v1/health", 
            "/api/v1/auth/login",
            "/api/v1/admin" # Allow admin to enter without specific tenant header initially
        ]
        
        if any(request.url.path.startswith(path) for path in public_paths):
            return await call_next(request)

        # Extract Tenant ID from Header (X-Tenant-ID)
        # In a real subdomain scenario: tenant_id = request.url.hostname.split('.')[0]
        tenant_id = request.headers.get("X-Tenant-ID")

        if not tenant_id:
            # Check if user is a Super Admin trying to impersonate or just missing header
            # For strict multi-tenancy, we block. For mixed mode, we might allow if user is admin.
            # Here we enforce header presence for operational safety.
            return JSONResponse(
                status_code=400, 
                content={
                    "detail": "Missing X-Tenant-ID Header. SaaS Isolation enforced.",
                    "code": "TENANT_HEADER_MISSING"
                }
            )

        # Inject tenant_id into request state for easy access in endpoints
        request.state.tenant_id = tenant_id
        
        # Future: Validate if tenant_id exists in Cache/DB and is Active
        
        response = await call_next(request)
        return response
