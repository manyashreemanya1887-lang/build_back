import io
import pytest
from PIL import Image
from fastapi.testclient import TestClient
from backend.app.main import app
from backend.app.database.connection import SessionLocal
from backend.app.models.models import User

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json()["status"] == "healthy"

import uuid

def test_auth_flow():
    # Register a new test contractor
    email = f"contractor_{uuid.uuid4().hex[:6]}@buildeco.in"
    reg_res = client.post("/api/auth/register", json={
        "name": "Eco Builder Test",
        "email": email,
        "phone": "+91 98888 77777",
        "password": "Password@123",
        "user_type": "seller",
        "city": "Mysuru",
        "state": "Karnataka",
        "pincode": "570001"
    })
    assert reg_res.status_code == 200
    token = reg_res.json()["access_token"]
    assert token is not None

    # Login
    login_res = client.post("/api/auth/login", json={
        "email": email,
        "password": "Password@123"
    })
    assert login_res.status_code == 200
    assert "access_token" in login_res.json()

    # Get Me
    headers = {"Authorization": f"Bearer {token}"}
    me_res = client.get("/api/auth/me", headers=headers)
    assert me_res.status_code == 200
    assert me_res.json()["email"] == email

def test_material_classifier():
    # Generate a sample red brick image in memory
    img = Image.new("RGB", (200, 200), color=(185, 55, 35))
    buf = io.BytesIO()
    img.save(buf, format="JPEG")
    buf.seek(0)

    res = client.post(
        "/api/ml/predict-material",
        files={"file": ("brick_test.jpg", buf, "image/jpeg")}
    )
    assert res.status_code == 200
    data = res.json()
    assert "material" in data
    assert data["confidence"] > 0.60
    assert len(data["alternatives"]) > 0
    assert "default_unit" in data

def test_quality_assessor():
    res = client.post("/api/ml/assess-quality", json={
        "material": "Bricks",
        "age_years": 3.0,
        "damage_percentage": 10.0,
        "original_usage": "Residential"
    })
    assert res.status_code == 200
    data = res.json()
    assert data["quality_grade"] in ["Grade A", "Grade B", "Grade C"]
    assert data["quality_score"] > 60
    assert len(data["recommended_uses"]) > 0
    assert "Directly Reusable" in data["recyclability"] or "Reusable" in data["recyclability"]

def test_price_predictor():
    res = client.post("/api/ml/predict-price", json={
        "material_type": "Bricks",
        "quality_grade": "Grade B",
        "quantity": 2000,
        "unit": "Pieces",
        "age_years": 4.0,
        "damage_percentage": 12.0,
        "location": "Mysuru",
        "original_usage": "Residential",
        "transport_distance": 15.0
    })
    assert res.status_code == 200
    data = res.json()
    assert data["estimated_price"] > 0
    assert data["price_min"] < data["price_max"]
    assert data["price_per_unit"] > 0
    assert "explanation" in data

def test_listings_search_and_filter():
    res = client.get("/api/listings?q=bricks")
    assert res.status_code == 200
    items = res.json()
    assert len(items) > 0
    assert "Bricks" in items[0]["material_name"] or "Bricks" in items[0]["title"]
    assert items[0]["price"] > 0

def test_environmental_summary():
    res = client.get("/api/environmental/summary")
    assert res.status_code == 200
    data = res.json()
    assert data["total_waste_diverted_tonnes"] >= 0
    assert data["total_co2_savings_kg"] >= 0
    assert len(data["top_diverted_materials"]) > 0

def test_admin_monitoring():
    # Login as admin
    login_res = client.post("/api/auth/login", json={
        "email": "admin@rebuildai.com",
        "password": "Admin@1234"
    })
    assert login_res.status_code == 200
    token = login_res.json()["access_token"]
    headers = {"Authorization": f"Bearer {token}"}

    # Admin stats
    stats_res = client.get("/api/admin/statistics", headers=headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total_users"] >= 3
    assert stats["total_listings"] >= 5

    # AI monitoring
    ai_res = client.get("/api/admin/ai-monitoring", headers=headers)
    assert ai_res.status_code == 200
    ai_data = ai_res.json()
    assert ai_data["total_predictions"] > 0
    assert ai_data["average_confidence"] > 0.50
