# Skill: Stress Test & Live Simulation

## Descrição
Esta skill é usada para validar a robustez do backend e a reatividade do frontend (Socket.io). Ela gera pedidos falsos em massa e os envia para a API.

## ⚠️ ZONA DE PERIGO
- **NUNCA execute em PRODUÇÃO.** Use apenas em localhost ou ambiente de Staging.
- Isso vai poluir o banco de dados com dados de teste (Faker).

## Parâmetros de Teste
O script `make_it_rain.py` aceita argumentos:
- `--amount`: Quantidade total de pedidos (Ex: 100).
- `--concurrency`: Quantos usuários simultâneos (Ex: 10).
- `--url`: A URL do endpoint de criação de pedidos (Padrão: http://localhost:3000/orders).

## Como usar
Quando o usuário pedir "Simule 50 pedidos" ou "Teste de carga":
1. Pergunte qual a URL da API local (se não souber).
2. Execute o script `scripts/make_it_rain.py`.
3. O Frontend deve atualizar em tempo real se o WebSocket estiver configurado corretamente.
