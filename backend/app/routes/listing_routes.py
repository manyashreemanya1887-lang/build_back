import json
from typing import Optional, List
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import or_, desc
from ..database.connection import get_db
from ..models.models import Listing, User, Favorite, Material
from ..schemas.schemas import ListingCreate, ListingUpdate, ListingResponse
from ..utils.security import get_current_user, require_seller, get_optional_current_user
from ..ml import environmental_calculator, reuse_engine

router = APIRouter(prefix="/api/listings", tags=["Listings"])

def enrich_listing_response(listing: Listing, current_user: Optional[User] = None) -> dict:
    data = {
        "id": listing.id,
        "seller_id": listing.seller_id,
        "seller_name": listing.seller.name if listing.seller else "Verified Seller",
        "seller_phone": listing.seller.phone if listing.seller else None,
        "seller_city": listing.seller.city if listing.seller else listing.city,
        "title": listing.title,
        "material_name": listing.material_name,
        "category": listing.category,
        "description": listing.description,
        "image_url": listing.image_url,
        "ai_confidence": listing.ai_confidence,
        "quality_grade": listing.quality_grade,
        "quality_score": listing.quality_score,
        "quantity": listing.quantity,
        "unit": listing.unit,
        "age": listing.age,
        "damage_percentage": listing.damage_percentage,
        "price": listing.price,
        "ai_estimated_price": listing.ai_estimated_price,
        "price_min": listing.price_min,
        "price_max": listing.price_max,
        "city": listing.city,
        "state": listing.state,
        "pincode": listing.pincode,
        "original_usage": listing.original_usage,
        "availability": listing.availability,
        "status": listing.status,
        "created_at": listing.created_at,
        "is_favorited": False
    }

    if current_user:
        fav = any(f.user_id == current_user.id for f in listing.favorites)
        data["is_favorited"] = fav

    # Circular LCA & reuse enrichment
    env = environmental_calculator.calculate(listing.material_name, listing.quantity, listing.unit)
    data["estimated_co2_saving"] = env["co2_saving_kg"]
    data["estimated_waste_diverted"] = env["waste_diverted_tonnes"]
    reuse_info = reuse_engine.get_uses_for_material(listing.material_name, listing.quality_grade)
    data["recommended_uses"] = reuse_info.get("uses", [])
    data["safety_guidelines"] = reuse_info.get("safety_guidelines")
    data["hazard_alert"] = reuse_info.get("hazard_alert")
    return data

@router.get("", response_model=List[ListingResponse])
def get_listings(
    q: Optional[str] = Query(None, description="Search keyword"),
    category: Optional[str] = Query(None),
    quality_grade: Optional[str] = Query(None),
    min_price: Optional[float] = Query(None),
    max_price: Optional[float] = Query(None),
    city: Optional[str] = Query(None),
    status: Optional[str] = Query("active"),
    sort_by: Optional[str] = Query("latest"),
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_optional_current_user)
):
    query = db.query(Listing)
    if status and status != "all":
        query = query.filter(Listing.status == status)

    if q:
        kw = f"%{q.lower().strip()}%"
        query = query.filter(
            or_(
                Listing.title.ilike(kw),
                Listing.material_name.ilike(kw),
                Listing.category.ilike(kw),
                Listing.description.ilike(kw),
                Listing.city.ilike(kw)
            )
        )

    if category and category != "All":
        query = query.filter(Listing.category.ilike(f"%{category}%"))

    if quality_grade and quality_grade != "All":
        query = query.filter(Listing.quality_grade == quality_grade)

    if min_price is not None:
        query = query.filter(Listing.price >= min_price)

    if max_price is not None:
        query = query.filter(Listing.price <= max_price)

    if city and city != "All":
        query = query.filter(Listing.city.ilike(f"%{city}%"))

    if sort_by == "price_asc":
        query = query.order_by(Listing.price.asc())
    elif sort_by == "price_desc":
        query = query.order_by(Listing.price.desc())
    elif sort_by == "quality":
        query = query.order_by(Listing.quality_score.desc())
    else:
        query = query.order_by(desc(Listing.created_at))

    items = query.all()
    return [enrich_listing_response(item, current_user) for item in items]

@router.post("", response_model=ListingResponse)
def create_listing(
    data: ListingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(require_seller)
):
    listing = Listing(
        seller_id=current_user.id,
        title=data.title.strip(),
        material_name=data.material_name.strip(),
        category=data.category.strip(),
        description=data.description,
        image_url=data.image_url or "https://images.unsplash.com/photo-1590069261209-f8e9b8642343?w=800&auto=format&fit=crop&q=60",
        predicted_material=data.predicted_material or data.material_name,
        ai_confidence=data.ai_confidence,
        quality_grade=data.quality_grade,
        quality_score=data.quality_score,
        quantity=data.quantity,
        unit=data.unit,
        age=data.age,
        damage_percentage=data.damage_percentage,
        price=data.price,
        ai_estimated_price=data.ai_estimated_price or data.price,
        city=data.city.strip(),
        state=data.state.strip(),
        pincode=data.pincode,
        original_usage=data.original_usage,
        availability=data.availability,
        status="active"
    )
    db.add(listing)
    db.commit()
    db.refresh(listing)
    return enrich_listing_response(listing, current_user)

@router.get("/{id}", response_model=ListingResponse)
def get_listing_detail(id: int, db: Session = Depends(get_db), current_user: Optional[User] = Depends(get_optional_current_user)):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found.")
    return enrich_listing_response(listing, current_user)

@router.put("/{id}", response_model=ListingResponse)
def update_listing(
    id: int,
    data: ListingUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found.")
    if listing.seller_id != current_user.id and current_user.user_type != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to edit this listing.")

    if data.title is not None:
        listing.title = data.title
    if data.description is not None:
        listing.description = data.description
    if data.quantity is not None:
        listing.quantity = data.quantity
    if data.price is not None:
        listing.price = data.price
    if data.city is not None:
        listing.city = data.city
    if data.status is not None:
        listing.status = data.status
    if data.availability is not None:
        listing.availability = data.availability

    db.commit()
    db.refresh(listing)
    return enrich_listing_response(listing, current_user)

@router.delete("/{id}")
def delete_listing(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(Listing.id == id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found.")
    if listing.seller_id != current_user.id and current_user.user_type != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to delete this listing.")

    db.delete(listing)
    db.commit()
    return {"message": "Listing deleted successfully."}

@router.post("/{id}/favorite")
def toggle_favorite(
    id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    fav = db.query(Favorite).filter(Favorite.user_id == current_user.id, Favorite.listing_id == id).first()
    if fav:
        db.delete(fav)
        db.commit()
        return {"is_favorited": False, "message": "Removed from favorites."}
    else:
        new_fav = Favorite(user_id=current_user.id, listing_id=id)
        db.add(new_fav)
        db.commit()
        return {"is_favorited": True, "message": "Added to favorites."}
