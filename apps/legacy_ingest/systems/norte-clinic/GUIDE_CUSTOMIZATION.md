# Guia de Customização e Fine-Tuning

Dicas para ajustar o sistema para clientes específicos.

## 1. Branding e Temas
- **Cores**: Edite `frontend/app/globals.css`. As variáveis CSS (`--primary`, `--secondary`, etc.) controlam a paleta de cores inteira.
    - Exemplo: Para mudar de Verde para Azul, altere os valores HSL de `--primary`.
- **Logo**: Substitua o ícone `Activity` em `Sidebar.tsx` por uma imagem `<Image src="/logo.png" ... />`.

## 2. Configurando o Sistema de Cobrança (Billing)
- Atualmente o sistema usa um "Mock Gateway" em `backend/app/services/payment.py` (ou direto no endpoint).
- Para integrar **Stripe** ou **Pagar.me**:
    1. Instale a lib do SDK (`pip install stripe`).
    2. Em `billing.py`, substitua a criação fake de assinatura pela chamada à API do gateway.
    3. Use Webhooks (`backend/app/api/v1/endpoints/webhook.py`) para receber confirmação de pagamento e atualizar o status via `user.subscription.status`.

## 3. Adicionando Novos Relatórios
1. Crie um endpoint no Backend que execute a query SQL desejada (use `func.count`, `func.sum` do SQLAlchemy).
2. No Frontend, crie um novo componente em `components/reports/`.
3. Adicione este componente na página desejada (ex: `AdminDashboard` ou `FinancialPage`).

## 4. Backup
- A função de backup pode ser conectada ao `pg_dump` do sistema.
- Edite `backend/app/api/v1/endpoints/backup.py` para chamar o subprocesso `pg_dump` e fazer upload para S3/Google Drive.
