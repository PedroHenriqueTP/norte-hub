from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "service": "Medical CRM Backend"}

# Note: Further tests require DB mocking. 
# For this sprint, we verify the health endpoint as a smoke test.
