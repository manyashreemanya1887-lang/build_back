from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from ..database.connection import get_db
from ..models.models import PurchaseRequest, Listing, Transaction, EnvironmentalImpact, User
from ..schemas.schemas import (
    PurchaseRequestCreate, PurchaseRequestStatusUpdate, PurchaseRequestResponse
)
from ..utils.security import get_current_user
from ..ml import environmental_calculator

router = APIRouter(prefix="/api/purchases", tags=["Purchase Requests & Transactions"])

@router.post("/request", response_model=PurchaseRequestResponse)
def create_purchase_request(
    req: PurchaseRequestCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    listing = db.query(Listing).filter(Listing.id == req.listing_id).first()
    if not listing:
        raise HTTPException(status_code=404, detail="Listing not found.")
    if listing.seller_id == current_user.id:
        raise HTTPException(status_code=400, detail="You cannot purchase your own listing.")
    if listing.status != "active":
        raise HTTPException(status_code=400, detail="This material is no longer available.")

    purchase_req = PurchaseRequest(
        listing_id=req.listing_id,
        buyer_id=current_user.id,
        quantity=req.quantity,
        proposed_price=req.proposed_price,
        message=req.message,
        preferred_pickup_date=req.preferred_pickup_date,
        status="pending"
    )
    db.add(purchase_req)
    db.commit()
    db.refresh(purchase_req)

    return PurchaseRequestResponse(
        id=purchase_req.id,
        listing_id=purchase_req.listing_id,
        listing_title=listing.title,
        listing_image=listing.image_url,
        listing_unit=listing.unit,
        buyer_id=purchase_req.buyer_id,
        buyer_name=current_user.name,
        buyer_email=current_user.email,
        buyer_phone=current_user.phone,
        seller_id=listing.seller_id,
        quantity=purchase_req.quantity,
        proposed_price=purchase_req.proposed_price,
        message=purchase_req.message,
        preferred_pickup_date=purchase_req.preferred_pickup_date,
        status=purchase_req.status,
        created_at=purchase_req.created_at
    )

@router.get("/my-requests", response_model=List[PurchaseRequestResponse])
def get_my_buyer_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    requests = db.query(PurchaseRequest).filter(PurchaseRequest.buyer_id == current_user.id).order_by(PurchaseRequest.created_at.desc()).all()
    results = []
    for r in requests:
        results.append(PurchaseRequestResponse(
            id=r.id,
            listing_id=r.listing_id,
            listing_title=r.listing.title if r.listing else "Material Listing",
            listing_image=r.listing.image_url if r.listing else None,
            listing_unit=r.listing.unit if r.listing else "Units",
            buyer_id=r.buyer_id,
            buyer_name=current_user.name,
            buyer_email=current_user.email,
            buyer_phone=current_user.phone,
            seller_id=r.listing.seller_id if r.listing else None,
            quantity=r.quantity,
            proposed_price=r.proposed_price,
            message=r.message,
            preferred_pickup_date=r.preferred_pickup_date,
            status=r.status,
            created_at=r.created_at
        ))
    return results

@router.get("/incoming-requests", response_model=List[PurchaseRequestResponse])
def get_seller_incoming_requests(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    requests = (
        db.query(PurchaseRequest)
        .join(Listing, PurchaseRequest.listing_id == Listing.id)
        .filter(Listing.seller_id == current_user.id)
        .order_by(PurchaseRequest.created_at.desc())
        .all()
    )
    results = []
    for r in requests:
        results.append(PurchaseRequestResponse(
            id=r.id,
            listing_id=r.listing_id,
            listing_title=r.listing.title if r.listing else "Listing",
            listing_image=r.listing.image_url if r.listing else None,
            listing_unit=r.listing.unit if r.listing else "Units",
            buyer_id=r.buyer_id,
            buyer_name=r.buyer.name if r.buyer else "Buyer",
            buyer_email=r.buyer.email if r.buyer else None,
            buyer_phone=r.buyer.phone if r.buyer else None,
            seller_id=current_user.id,
            quantity=r.quantity,
            proposed_price=r.proposed_price,
            message=r.message,
            preferred_pickup_date=r.preferred_pickup_date,
            status=r.status,
            created_at=r.created_at
        ))
    return results

@router.put("/request/{id}", response_model=PurchaseRequestResponse)
def update_purchase_request_status(
    id: int,
    status_update: PurchaseRequestStatusUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    purchase_req = db.query(PurchaseRequest).filter(PurchaseRequest.id == id).first()
    if not purchase_req:
        raise HTTPException(status_code=404, detail="Purchase request not found.")

    listing = purchase_req.listing
    if listing.seller_id != current_user.id and current_user.user_type != "admin":
        raise HTTPException(status_code=403, detail="Not authorized to manage this request.")

    new_status = status_update.status.lower()
    if new_status not in ["accepted", "rejected"]:
        raise HTTPException(status_code=400, detail="Status must be 'accepted' or 'rejected'.")

    purchase_req.status = new_status

    if new_status == "accepted":
        # Mark listing as sold
        listing.status = "sold"
        
        # Create completed transaction record
        tx = Transaction(
            listing_id=listing.id,
            buyer_id=purchase_req.buyer_id,
            seller_id=listing.seller_id,
            quantity=purchase_req.quantity,
            price=purchase_req.proposed_price,
            status="completed"
        )
        db.add(tx)
        db.flush()

        # Calculate and record verified environmental impact
        env = environmental_calculator.calculate(listing.material_name, purchase_req.quantity, listing.unit)
        impact = EnvironmentalImpact(
            transaction_id=tx.id,
            material_type=listing.material_name,
            quantity=purchase_req.quantity,
            unit=listing.unit,
            estimated_weight=env["waste_diverted_tonnes"],
            estimated_co2_saving=env["co2_saving_kg"]
        )
        db.add(impact)

    db.commit()
    db.refresh(purchase_req)

    return PurchaseRequestResponse(
        id=purchase_req.id,
        listing_id=purchase_req.listing_id,
        listing_title=listing.title,
        listing_image=listing.image_url,
        listing_unit=listing.unit,
        buyer_id=purchase_req.buyer_id,
        buyer_name=purchase_req.buyer.name if purchase_req.buyer else "Buyer",
        buyer_email=purchase_req.buyer.email if purchase_req.buyer else None,
        buyer_phone=purchase_req.buyer.phone if purchase_req.buyer else None,
        seller_id=listing.seller_id,
        quantity=purchase_req.quantity,
        proposed_price=purchase_req.proposed_price,
        message=purchase_req.message,
        preferred_pickup_date=purchase_req.preferred_pickup_date,
        status=purchase_req.status,
        created_at=purchase_req.created_at
    )
