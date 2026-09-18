from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ..database.connection import get_db
from ..models.models import EnvironmentalImpact, Transaction, Listing
from ..schemas.schemas import EnvironmentalImpactSummary

router = APIRouter(prefix="/api/environmental", tags=["Environmental Impact"])

@router.get("/summary", response_model=EnvironmentalImpactSummary)
def get_environmental_summary(db: Session = Depends(get_db)):
    records = db.query(EnvironmentalImpact).all()
    
    total_waste = sum(r.estimated_weight for r in records)
    total_co2 = sum(r.estimated_co2_saving for r in records)
    total_tx = db.query(Transaction).filter(Transaction.status == "completed").count()
    items_reused = sum(int(r.quantity) for r in records)

    # Breakdown by material
    cat_diverted = {}
    for r in records:
        cat_diverted[r.material_type] = cat_diverted.get(r.material_type, 0.0) + r.estimated_weight

    top_diverted = [
        {"material": k, "tonnes": round(v, 2)}
        for k, v in sorted(cat_diverted.items(), key=lambda x: x[1], reverse=True)[:5]
    ]

    trees = int(round(total_co2 / 21.77, 0)) if total_co2 > 0 else 0

    return EnvironmentalImpactSummary(
        total_materials_reused_count=items_reused,
        total_waste_diverted_tonnes=round(total_waste, 2),
        total_co2_savings_kg=round(total_co2, 1),
        equivalent_trees_planted=trees,
        total_transactions=total_tx,
        top_diverted_materials=top_diverted
    )
