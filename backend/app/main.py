import os
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles

from .database.connection import engine, Base, SessionLocal
from .models.models import User, Material, Listing
from .routes import (
    auth_router, ml_router, listing_router, purchase_router,
    environmental_router, admin_router
)
from .utils.security import hash_password

UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)

FRONTEND_DIST = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))), "frontend", "dist")

def init_db_seeds():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        # Check if users exist, otherwise create default demo users
        admin_user = db.query(User).filter(User.email == "admin@rebuildai.com").first()
        if not admin_user:
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
            seller = User(
                name="Karnataka Demolition & Salvage",
                email="seller@demolitioncorp.com",
                phone="+91 98860 44556",
                password_hash=hash_password("Seller@1234"),
                user_type="seller",
                city="Mysuru",
                state="Karnataka",
                pincode="570001"
            )
            buyer = User(
                name="Eco-Structures Construction",
                email="buyer@greenbuild.in",
                phone="+91 97410 77889",
                password_hash=hash_password("Buyer@1234"),
                user_type="buyer",
                city="Bangalore",
                state="Karnataka",
                pincode="560034"
            )
            db.add_all([admin, seller, buyer])
            db.commit()
            print("Default demo users initialized.")
    except Exception as e:
        print(f"Error seeding demo users: {e}")
    finally:
        db.close()

@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db_seeds()
    yield

app = FastAPI(
    title="REBUILD AI – AI-Powered Construction Waste Reuse & Second-Market Platform",
    description="Intelligent platform connecting construction waste sellers and recyclers using Computer Vision, Price Regression, and Circular Economy analytics.",
    version="2.0.0",
    lifespan=lifespan
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount media upload storage
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

# Include Routers
app.include_router(auth_router)
app.include_router(ml_router)
app.include_router(listing_router)
app.include_router(purchase_router)
app.include_router(environmental_router)
app.include_router(admin_router)

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "REBUILD AI Platform API",
        "version": "2.0.0",
        "ml_models": {
            "computer_vision": "MobileNetV2 (Active)",
            "quality_assessor": "Multimodal Visual Edge (Active)",
            "price_predictor": "Gradient Boosting Regressor (Active)",
            "similarity_engine": "Cosine Embedding Matcher (Active)"
        }
    }

# Mount static frontend if dist exists
if os.path.exists(FRONTEND_DIST):
    app.mount("/", StaticFiles(directory=FRONTEND_DIST, html=True), name="static")
