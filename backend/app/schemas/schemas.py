from datetime import datetime
from typing import Optional, List, Any
from pydantic import BaseModel, EmailStr, Field

# ----------------- User & Auth Schemas -----------------
class UserRegister(BaseModel):
    name: str
    email: EmailStr
    phone: Optional[str] = None
    password: str = Field(..., min_length=6)
    user_type: str = 'both' # 'seller', 'buyer', 'both'
    city: str = 'Bangalore'
    state: str = 'Karnataka'
    pincode: Optional[str] = '560001'

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = 'bearer'
    user: 'UserResponse'

class TokenData(BaseModel):
    user_id: Optional[int] = None
    email: Optional[str] = None
    user_type: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    name: str
    email: EmailStr
    phone: Optional[str]
    user_type: str
    city: str
    state: str
    pincode: Optional[str]
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- AI / ML Schemas -----------------
class MaterialAlternative(BaseModel):
    material: str
    confidence: float

class MaterialPredictionResponse(BaseModel):
    material: str
    confidence: float
    is_low_confidence: bool = False
    message: str = ''
    alternatives: List[MaterialAlternative] = []
    default_unit: str = 'Pieces'
    detected_features: Optional[dict] = None

class QualityAssessmentRequest(BaseModel):
    material: str
    age_years: float = 1.0
    damage_percentage: float = 10.0
    original_usage: str = 'Residential'
    condition_notes: Optional[str] = None

class QualityAssessmentResponse(BaseModel):
    material: str
    quality_grade: str # Grade A, B, C, D, E
    quality_score: float # 0 to 100
    condition: str # Excellent, Good, Fair, Poor, Unusable
    recommended_uses: List[str]
    recyclability: str # Directly Reusable, Reusable After Processing, Recyclable, Not Recommended
    recyclability_notes: str
    structural_advisory_disclaimer: str

class PricePredictionRequest(BaseModel):
    material_type: str
    quality_grade: str = 'Grade B'
    quantity: float = 100.0
    unit: str = 'Pieces'
    age_years: float = 2.0
    damage_percentage: float = 15.0
    location: str = 'Bangalore'
    original_usage: str = 'Residential'
    transport_distance: float = 15.0

class PricePredictionResponse(BaseModel):
    estimated_price: float
    price_min: float
    price_max: float
    price_per_unit: float
    confidence: float
    model_used: str
    explanation: str

class ModelFeedbackCreate(BaseModel):
    listing_id: Optional[int] = None
    image_url: Optional[str] = None
    predicted_material: str
    corrected_material: str
    predicted_quality: Optional[str] = None
    corrected_quality: Optional[str] = None
    predicted_price: Optional[float] = None
    final_price: Optional[float] = None
    confidence: float = 0.0
    is_confirmed: bool = True

# ----------------- Listing Schemas -----------------
class ListingCreate(BaseModel):
    title: str
    material_name: str
    category: str
    description: Optional[str] = None
    image_url: Optional[str] = None
    predicted_material: Optional[str] = None
    ai_confidence: float = 0.0
    quality_grade: str = 'Grade B'
    quality_score: float = 75.0
    quantity: float
    unit: str = 'Pieces'
    age: float = 1.0
    damage_percentage: float = 10.0
    price: float
    ai_estimated_price: Optional[float] = None
    city: str
    state: str = 'Karnataka'
    pincode: Optional[str] = None
    original_usage: str = 'Residential'
    availability: str = 'Immediate'

class ListingUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    quantity: Optional[float] = None
    price: Optional[float] = None
    city: Optional[str] = None
    status: Optional[str] = None
    availability: Optional[str] = None

class ListingResponse(BaseModel):
    id: int
    seller_id: int
    seller_name: Optional[str] = None
    seller_phone: Optional[str] = None
    seller_city: Optional[str] = None
    title: str
    material_name: str
    category: str
    description: Optional[str]
    image_url: Optional[str]
    ai_confidence: float
    quality_grade: str
    quality_score: float
    quantity: float
    unit: str
    age: float
    damage_percentage: float
    price: float
    ai_estimated_price: Optional[float]
    price_min: Optional[float]
    price_max: Optional[float]
    city: str
    state: str
    pincode: Optional[str]
    original_usage: str
    availability: str
    status: str
    is_favorited: bool = False
    recommended_uses: List[str] = []
    recyclability: Optional[str] = None
    safety_guidelines: Optional[str] = None
    hazard_alert: Optional[str] = None
    estimated_co2_saving: Optional[float] = None
    estimated_waste_diverted: Optional[float] = None
    similarity_score: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Purchase & Transaction Schemas -----------------
class PurchaseRequestCreate(BaseModel):
    listing_id: int
    quantity: float
    proposed_price: float
    message: Optional[str] = None
    preferred_pickup_date: Optional[str] = None

class PurchaseRequestStatusUpdate(BaseModel):
    status: str # 'accepted', 'rejected'

class PurchaseRequestResponse(BaseModel):
    id: int
    listing_id: int
    listing_title: Optional[str] = None
    listing_image: Optional[str] = None
    listing_unit: Optional[str] = None
    buyer_id: int
    buyer_name: Optional[str] = None
    buyer_email: Optional[str] = None
    buyer_phone: Optional[str] = None
    seller_id: Optional[int] = None
    quantity: float
    proposed_price: float
    message: Optional[str]
    preferred_pickup_date: Optional[str]
    status: str
    created_at: datetime

    class Config:
        from_attributes = True

# ----------------- Environmental & Stats Schemas -----------------
class EnvironmentalImpactSummary(BaseModel):
    total_materials_reused_count: int
    total_waste_diverted_tonnes: float
    total_co2_savings_kg: float
    equivalent_trees_planted: int
    total_transactions: int
    top_diverted_materials: List[dict]

class SellerDashboardStats(BaseModel):
    total_listings: int
    active_listings: int
    sold_materials: int
    pending_requests: int
    estimated_revenue: float
    waste_reused_tonnes: float

class BuyerDashboardStats(BaseModel):
    saved_materials_count: int
    active_requests_count: int
    completed_purchases_count: int
    total_spent: float
    carbon_offset_kg: float

class AdminDashboardStats(BaseModel):
    total_users: int
    total_listings: int
    active_listings: int
    flagged_listings: int
    total_transactions: int
    total_waste_diverted_tonnes: float
    total_co2_savings_kg: float
    most_popular_material: str
    most_active_city: str
    material_distribution: List[dict]
    city_distribution: List[dict]
    monthly_transactions: List[dict]
