import requests
import concurrent.futures
import random
import json
import argparse
import time
from faker import Faker

fake = Faker('pt_BR')

# Itens de cardápio fake
MENU_ITEMS = [
    {"id": 1, "name": "X-Bacon", "price": 25.00},
    {"id": 2, "name": "Coca-Cola 2L", "price": 12.00},
    {"id": 3, "name": "Pizza Calabresa", "price": 45.00},
    {"id": 4, "name": "Açaí 500ml", "price": 18.00},
    {"id": 5, "name": "Batata Frita", "price": 15.00}
]

def generate_fake_order():
    # Gera um pedido aleatório
    items = random.sample(MENU_ITEMS, k=random.randint(1, 3))
    total = sum(item['price'] for item in items)
    
    payload = {
        "customerName": fake.name(),
        "customerAddress": fake.address(),
        "paymentMethod": random.choice(["CREDIT_CARD", "PIX", "CASH"]),
        "items": items,
        "total": total,
        "status": "PENDING",
        "createdAt": time.strftime("%Y-%m-%dT%H:%M:%SZ")
    }
    return payload

def send_order(url):
    payload = generate_fake_order()
    try:
        # Ajuste o header conforme sua autenticação (Bearer Token, etc) se necessário
        headers = {'Content-Type': 'application/json'}
        # Assuming the API expects specific structure. 
        # Ideally we should match the CreateOrderDto structure more closely if needed.
        # But this matches the requested prompt.
        response = requests.post(url, data=json.dumps(payload), headers=headers, timeout=5)
        
        if response.status_code in [200, 201]:
            print(f"✅ Pedido criado: R$ {payload['total']} - Cliente: {payload['customerName']}")
            return True
        else:
            print(f"❌ Erro {response.status_code}: {response.text}")
            return False
    except Exception as e:
        print(f"💀 Falha na conexão: {str(e)}")
        return False

def start_attack(amount, concurrency, url):
    print(f"🔥 INICIANDO SIMULAÇÃO: {amount} pedidos com {concurrency} threads...")
    print(f"🎯 Alvo: {url}")
    
    successful = 0
    start_time = time.time()

    with concurrent.futures.ThreadPoolExecutor(max_workers=concurrency) as executor:
        futures = [executor.submit(send_order, url) for _ in range(amount)]
        for future in concurrent.futures.as_completed(futures):
            if future.result():
                successful += 1

    duration = time.time() - start_time
    print(f"\n🏁 FIM DO TESTE.")
    print(f"⏱ Tempo total: {duration:.2f} segundos")
    print(f"📈 Taxa: {successful/duration:.2f} pedidos/segundo")
    print(f"✅ Sucessos: {successful}/{amount}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description='Gerador de Pedidos Fake')
    parser.add_argument('--amount', type=int, default=10, help='Total de pedidos')
    parser.add_argument('--concurrency', type=int, default=2, help='Threads simultâneas')
    parser.add_argument('--url', type=str, default='http://localhost:3000/orders', help='Endpoint da API')
    
    args = parser.parse_args()
    start_attack(args.amount, args.concurrency, args.url)
