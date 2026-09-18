import urllib.request
import json

BASE_URL = "http://127.0.0.1:8000"

def post_json(endpoint, data, token=None, method="POST"):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        data=json.dumps(data).encode("utf-8"),
        headers={
            "Content-Type": "application/json",
            **({"Authorization": f"Bearer {token}"} if token else {})
        },
        method=method
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))

def get_json(endpoint, token=None):
    req = urllib.request.Request(
        f"{BASE_URL}{endpoint}",
        headers=({"Authorization": f"Bearer {token}"} if token else {})
    )
    with urllib.request.urlopen(req) as response:
        return json.loads(response.read().decode("utf-8"))

print("=== 1. VERIFYING LANDING PAGE & HEALTH ===")
health = get_json("/api/health")
print("Health:", health["status"], "| Service:", health["service"])
assert health["status"] == "healthy"

env_summary = get_json("/api/environmental/summary")
print("Live Ticker:", env_summary["total_waste_diverted_tonnes"], "tonnes diverted |", env_summary["total_co2_savings_kg"], "kg CO2 saved")

print("\n=== 2. VERIFYING SELLER AUTH & LISTING WORKFLOW ===")
seller_login = post_json("/api/auth/login", {"email": "seller@demolitioncorp.com", "password": "Seller@1234"})
seller_token = seller_login["access_token"]
print("Seller Logged In:", seller_login["user"]["name"], "| Role:", seller_login["user"]["user_type"])

# AI Quality Assessment
qa = post_json("/api/ml/assess-quality", {
    "material": "Bricks",
    "age_years": 3.5,
    "damage_percentage": 12.0,
    "original_usage": "Residential"
})
print("AI Quality Assessed:", qa["quality_grade"], "| Score:", qa["quality_score"], "| Condition:", qa["condition"])

# AI Price Prediction
price_pred = post_json("/api/ml/predict-price", {
    "material_type": "Bricks",
    "quality_grade": qa["quality_grade"],
    "quantity": 2500,
    "unit": "Pieces",
    "age_years": 3.5,
    "damage_percentage": 12.0,
    "location": "Mysuru",
    "transport_distance": 10.0
})
print("AI Price Estimated: INR", price_pred["estimated_price"], "| Unit Rate: INR", price_pred["price_per_unit"], "| Confidence:", price_pred["confidence"])

# Create Listing
new_listing = post_json("/api/listings", {
    "title": "Salvaged Jayalakshmipuram Heritage Bricks",
    "material_name": "Bricks",
    "category": "Masonry",
    "description": "High strength red bricks carefully salvaged from bungalow renovation.",
    "image_url": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800",
    "predicted_material": "Bricks",
    "ai_confidence": 0.95,
    "quality_grade": qa["quality_grade"],
    "quality_score": qa["quality_score"],
    "quantity": 2500,
    "unit": "Pieces",
    "age": 3.5,
    "damage_percentage": 12.0,
    "price": price_pred["estimated_price"],
    "ai_estimated_price": price_pred["estimated_price"],
    "city": "Mysuru",
    "state": "Karnataka",
    "availability": "Immediate"
}, token=seller_token)
print("New Listing Created! ID:", new_listing["id"], "| Title:", new_listing["title"])

print("\n=== 3. VERIFYING BUYER DISCOVERY & PURCHASE REQUEST ===")
buyer_login = post_json("/api/auth/login", {"email": "buyer@greenbuild.in", "password": "Buyer@1234"})
buyer_token = buyer_login["access_token"]
print("Buyer Logged In:", buyer_login["user"]["name"])

# Buyer searches for red bricks in Mysuru
search_results = get_json("/api/listings?q=bricks&city=Mysuru", token=buyer_token)
print("Search Results for bricks in Mysuru:", len(search_results), "lots found")

# Buyer submits purchase request for new listing
purchase_req = post_json("/api/purchases/request", {
    "listing_id": new_listing["id"],
    "quantity": 2500,
    "proposed_price": price_pred["estimated_price"] - 1000,
    "message": "Can pick up this Saturday with our commercial truck.",
    "preferred_pickup_date": "2026-09-15"
}, token=buyer_token)
req_id = purchase_req["id"]
print("Purchase Request Created! ID:", req_id, "| Proposed Price: INR", purchase_req["proposed_price"], "| Status:", purchase_req["status"])

print("\n=== 4. VERIFYING SELLER ACCEPTANCE & TRANSACTION FINALIZATION ===")
# Seller accepts the purchase request
req_update = post_json(f"/api/purchases/request/{req_id}", {"status": "accepted"}, token=seller_token, method="PUT")
print("Request Status Updated By Seller:", req_update["status"])

# Check updated environmental ticker
new_env = get_json("/api/environmental/summary")
print("Updated Diverted Waste:", new_env["total_waste_diverted_tonnes"], "tonnes | Updated CO2 Savings:", new_env["total_co2_savings_kg"], "kg")

print("\n=== 5. VERIFYING ADMIN TELEMETRY & AI DRIFT MONITORING ===")
admin_login = post_json("/api/auth/login", {"email": "admin@rebuildai.com", "password": "Admin@1234"})
admin_token = admin_login["access_token"]
admin_stats = get_json("/api/admin/statistics", token=admin_token)
ai_telemetry = get_json("/api/admin/ai-monitoring", token=admin_token)
print("Admin Metrics -> Users:", admin_stats["total_users"], "| Listings:", admin_stats["total_listings"], "| Completed Deals:", admin_stats["total_transactions"])
print("AI Monitoring -> Mean Confidence:", ai_telemetry["average_confidence"], "| Drift Status:", ai_telemetry["drift_status"])

print("\n>>> ALL MAIN USER FLOWS VERIFIED SUCCESSFULLY! <<<")
