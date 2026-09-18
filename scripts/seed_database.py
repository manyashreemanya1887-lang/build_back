import os
import sys
import json

sys.path.append(os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "backend"))

from app.database.connection import engine, SessionLocal, Base
from app.models.models import (
    User, Material, Listing, PurchaseRequest, Favorite,
    Transaction, EnvironmentalImpact, ModelFeedback
)
from app.utils.security import hash_password
from app.ml.material_classifier import MATERIAL_CATEGORIES, MATERIAL_DEFAULTS
from app.ml.environmental_calculator import environmental_calculator

def seed():
    print("Dropping and recreating database tables...")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    print("Creating standard demo accounts...")
    admin = User(
        name="Admin Rebuild",
        email="admin@rebuildai.com",
        phone="+91 98450 11223",
        password_hash=hash_password("Admin@1234"),
        user_type="admin",
        city="Bangalore",
        state="Karnataka",
        pincode="560001"
    )
    seller1 = User(
        name="Karnataka Demolition & Salvage Ltd",
        email="seller@demolitioncorp.com",
        phone="+91 98860 44556",
        password_hash=hash_password("Seller@1234"),
        user_type="seller",
        city="Mysuru",
        state="Karnataka",
        pincode="570001"
    )
    seller2 = User(
        name="Apex Metro Infra Developers",
        email="apex@metroinfra.in",
        phone="+91 98440 99887",
        password_hash=hash_password("Apex@1234"),
        user_type="seller",
        city="Bangalore",
        state="Karnataka",
        pincode="560048"
    )
    buyer1 = User(
        name="Eco-Structures Construction",
        email="buyer@greenbuild.in",
        phone="+91 97410 77889",
        password_hash=hash_password("Buyer@1234"),
        user_type="buyer",
        city="Bangalore",
        state="Karnataka",
        pincode="560034"
    )
    buyer2 = User(
        name="Studio Earth Architects",
        email="studio@eartharchitects.com",
        phone="+91 99001 22334",
        password_hash=hash_password("Studio@1234"),
        user_type="buyer",
        city="Mysuru",
        state="Karnataka",
        pincode="570020"
    )
    db.add_all([admin, seller1, seller2, buyer1, buyer2])
    db.commit()

    print("Creating master materials catalog (20 categories)...")
    for cat_name in MATERIAL_CATEGORIES:
        info = MATERIAL_DEFAULTS.get(cat_name, {"unit": "Pieces", "category": "General"})
        m = Material(
            name=cat_name,
            category=info["category"],
            description=f"Standard recovered {cat_name} for circular reuse and downcycling.",
            reusability="High" if cat_name in ["Red Bricks", "Structural Wood / Timber", "Flush Doors", "Ceramic Floor Tiles", "Granite Slabs"] else "Medium",
            recyclability="Directly Reusable" if cat_name in ["Red Bricks", "Flush Doors", "Structural Wood / Timber"] else ("Hazardous Disposal" if "Asbestos" in cat_name else "Recyclable"),
            carbon_factor=0.35,
            waste_factor=1.0
        )
        db.add(m)
    db.commit()

    print("Seeding rich marketplace listings...")
    sample_listings = [
        {
            "seller_id": seller1.id,
            "title": "Reclaimed Heritage Red Bricks",
            "material_name": "Red Bricks",
            "category": "Masonry",
            "description": "Cleaned red clay bricks salvaged from a 1940s estate demolition in Mysuru heritage district. Excellent structural integrity.",
            "image_url": "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=800&q=80",
            "predicted_material": "Red Bricks",
            "ai_confidence": 0.94,
            "quality_grade": "Grade A",
            "quality_score": 92.5,
            "quantity": 3500.0,
            "unit": "Pieces",
            "age": 2.5,
            "damage_percentage": 5.0,
            "original_usage": "Residential Estate Wall",
            "price": 9.5,
            "ai_estimated_price": 9.8,
            "city": "Mysuru",
            "state": "Karnataka",
            "pincode": "570001",
            "status": "active"
        },
        {
            "seller_id": seller2.id,
            "title": "Heavy-Duty TMT Steel Reinforcement Rods",
            "material_name": "TMT Steel Rods",
            "category": "Metals",
            "description": "Fe-500 grade TMT steel bars salvaged from excess metro construction inventory. Unused condition with light surface oxidation.",
            "image_url": "https://images.unsplash.com/photo-1535813547-99c456a41d4a?w=800&q=80",
            "predicted_material": "TMT Steel Rods",
            "ai_confidence": 0.91,
            "quality_grade": "Grade A",
            "quality_score": 89.0,
            "quantity": 1200.0,
            "unit": "kg",
            "age": 0.8,
            "damage_percentage": 4.0,
            "original_usage": "Infrastructure Metro Project",
            "price": 44.0,
            "ai_estimated_price": 46.5,
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560048",
            "status": "active"
        },
        {
            "seller_id": seller1.id,
            "title": "Salvaged Teak Wood Beams & Timber",
            "material_name": "Structural Wood / Timber",
            "category": "Timber",
            "description": "A-Grade solid seasoned teakwood joists and rafters from roof dismantling. Termite-free and planed on 2 sides.",
            "image_url": "https://images.unsplash.com/photo-1513694203232-719a280e022f?w=800&q=80",
            "predicted_material": "Structural Wood / Timber",
            "ai_confidence": 0.88,
            "quality_grade": "Grade B",
            "quality_score": 82.0,
            "quantity": 450.0,
            "unit": "sq.ft",
            "age": 4.0,
            "damage_percentage": 12.0,
            "original_usage": "Roofing Rafters",
            "price": 95.0,
            "ai_estimated_price": 98.0,
            "city": "Mysuru",
            "state": "Karnataka",
            "pincode": "570010",
            "status": "active"
        },
        {
            "seller_id": seller2.id,
            "title": "Crushed Concrete Rubble Aggregate",
            "material_name": "Concrete Rubble",
            "category": "Masonry",
            "description": "Graded 40mm crushed concrete aggregate ideal for road sub-base, heavy foundation beds, and site filling.",
            "image_url": "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
            "predicted_material": "Concrete Rubble",
            "ai_confidence": 0.92,
            "quality_grade": "Grade C",
            "quality_score": 64.0,
            "quantity": 25.0,
            "unit": "Tonnes",
            "age": 3.0,
            "damage_percentage": 35.0,
            "original_usage": "Commercial Foundation Dismantling",
            "price": 550.0,
            "ai_estimated_price": 580.0,
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560068",
            "status": "active"
        },
        {
            "seller_id": seller1.id,
            "title": "Polished Black Granite Slabs",
            "material_name": "Granite Slabs",
            "category": "Stone",
            "description": "Reclaimed 18mm premium black granite counter slabs. Minor edge chipping, great for kitchen counters or outdoor benches.",
            "image_url": "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=800&q=80",
            "predicted_material": "Granite Slabs",
            "ai_confidence": 0.90,
            "quality_grade": "Grade B",
            "quality_score": 78.5,
            "quantity": 180.0,
            "unit": "sq.ft",
            "age": 1.5,
            "damage_percentage": 15.0,
            "original_usage": "Office Reception Counters",
            "price": 125.0,
            "ai_estimated_price": 130.0,
            "city": "Bangalore",
            "state": "Karnataka",
            "pincode": "560001",
            "status": "active"
        },
        {
            "seller_id": seller1.id,
            "title": "Damaged Asbestos Roof Sheets - Flagged for Disposal",
            "material_name": "Asbestos / Hazardous Sheeting",
            "category": "Hazardous Waste",
            "description": "Old degraded corrugated asbestos cement sheets. Carcinogenic material - public sale blocked. Mandatory hazardous handling required.",
            "image_url": "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&q=80",
            "predicted_material": "Asbestos / Hazardous Sheeting",
            "ai_confidence": 0.96,
            "quality_grade": "Grade E",
            "quality_score": 12.0,
            "quantity": 150.0,
            "unit": "sq.ft",
            "age": 15.0,
            "damage_percentage": 85.0,
            "original_usage": "Industrial Warehouse Roof",
            "price": 0.0,
            "ai_estimated_price": 0.0,
            "city": "Mysuru",
            "state": "Karnataka",
            "pincode": "570001",
            "status": "flagged",
            "flag_reason": "Red Flag Grade E: Hazardous Asbestos material detected. Public sale blocked; disposal mandated."
        }
    ]

    seeded_objs = []
    for data in sample_listings:
        l = Listing(**data)
        db.add(l)
        seeded_objs.append(l)
    db.commit()

    print("Creating sample purchase requests & completed transaction...")
    first_listing = seeded_objs[0] # Red Bricks
    pr = PurchaseRequest(
        listing_id=first_listing.id,
        buyer_id=buyer1.id,
        quantity=1000.0,
        proposed_price=9000.0,
        message="Interested in 1000 bricks for a landscaping project in HSR Layout.",
        preferred_pickup_date="2026-10-01",
        status="accepted"
    )
    db.add(pr)
    db.commit()

    # Transaction + Environmental Impact logging
    tx = Transaction(
        listing_id=first_listing.id,
        buyer_id=buyer1.id,
        seller_id=seller1.id,
        quantity=1000.0,
        price=9000.0,
        status="completed"
    )
    db.add(tx)
    db.commit()

    env_data = environmental_calculator.calculate(first_listing.material_name, 1000.0, first_listing.unit)
    env_record = EnvironmentalImpact(
        transaction_id=tx.id,
        material_type=first_listing.material_name,
        quantity=1000.0,
        unit=first_listing.unit,
        estimated_weight=env_data["waste_diverted_tonnes"],
        estimated_co2_saving=env_data["co2_saving_kg"]
    )
    db.add(env_record)

    # Active learning feedback sample
    fb = ModelFeedback(
        user_id=buyer1.id,
        listing_id=first_listing.id,
        image_url=first_listing.image_url,
        predicted_material="Red Bricks",
        corrected_material="Red Bricks",
        predicted_quality="Grade A",
        corrected_quality="Grade A",
        predicted_price=9.8,
        final_price=9.5,
        confidence=0.94,
        is_confirmed=True
    )
    db.add(fb)
    db.commit()
    db.close()

    print("Database seeding completed successfully!")

if __name__ == "__main__":
    seed()
