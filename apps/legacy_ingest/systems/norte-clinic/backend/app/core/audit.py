import functools
from fastapi import Request
from app.models.audit_log import AuditLog

def audit_action(action_name: str, resource_type: str = None):
    def decorator(func):
        @functools.wraps(func)
        async def wrapper(*args, **kwargs):
            # Executa a função original (a rota da API)
            response = await func(*args, **kwargs)
            
            # Tenta capturar a Request nos argumentos da rota
            request: Request = kwargs.get("request")
            # Procura por 'db' ou 'session'
            db = kwargs.get("db") or kwargs.get("session")
            current_user = kwargs.get("current_user")

            if request and db and current_user:
                # Logica para seguranca caso o tenant_id nao esteja no user (ex: superuser)
                target_tenant = getattr(current_user, "tenant_id", None)

                new_log = AuditLog(
                    user_id=current_user.id,
                    action=action_name,
                    target_tenant_id=target_tenant,
                    ip_address=request.client.host,
                    resource_type=resource_type,
                    resource_id=str(kwargs.get("id")) if "id" in kwargs else None,
                    metadata_json={"status": "success"}
                )
                db.add(new_log)
                # O commit deve ser feito com cuidado para não conflitar com a rota, 
                # mas aqui assumimos que a rota ja commitou suas mudancas ou que este eh um log separado.
                # Em async session as vezes eh melhor usar flush ou garantir que a session nao fechou.
                # Para simplificar conforme o snippet do user:
                await db.commit()
            
            return response
        return wrapper
    return decorator
