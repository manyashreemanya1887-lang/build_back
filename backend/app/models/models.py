from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, Text, ForeignKey, DateTime, Boolean
from sqlalchemy.orm import relationship
from ..database.connection import Base

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(120), nullable=False)
    email = Column(String(150), unique=True, index=True, nullable=False)
    phone = Column(String(30), nullable=True)
    password_hash = Column(String(255), nullable=False)
    user_type = Column(String(30), nullable=False, default='buyer') # seller, buyer, both, admin
    city = Column(String(100), nullable=False, default='Bangalore')
    state = Column(String(100), nullable=False, default='Karnataka')
    pincode = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    listings = relationship('Listing', back_populates='seller', cascade='all, delete-orphan')
    purchase_requests = relationship('PurchaseRequest', back_populates='buyer')
    favorites = relationship('Favorite', back_populates='user', cascade='all, delete-orphan')
    feedback_entries = relationship('ModelFeedback', back_populates='user')

class Material(Base):
    __tablename__ = 'materials'

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False) # e.g. 'Bricks', 'Steel', 'Wood'
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    reusability = Column(String(100), nullable=True) # High, Medium, Low
    recyclability = Column(String(100), nullable=True) # Directly Reusable, Reusable After Processing, Recyclable
    carbon_factor = Column(Float, default=0.25) # kg CO2e saved per unit or kg
    waste_factor = Column(Float, default=1.0) # tonnes of waste diverted per unit factor

    listings = relationship('Listing', back_populates='material_ref')

class Listing(Base):
    __tablename__ = 'listings'

    id = Column(Integer, primary_key=True, index=True)
    seller_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    material_id = Column(Integer, ForeignKey('materials.id'), nullable=True)
    
    title = Column(String(200), nullable=False)
    material_name = Column(String(100), nullable=False) # e.g. Red Brick, Reclaimed Wood
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    image_url = Column(String(500), nullable=True)
    image_embedding = Column(Text, nullable=True) # JSON serialized embedding vector
    
    # AI prediction metrics
    predicted_material = Column(String(100), nullable=True)
    ai_confidence = Column(Float, default=0.0)
    quality_grade = Column(String(10), default='Grade B') # Grade A, B, C, D, E
    quality_score = Column(Float, default=75.0) # 0 to 100
    
    # Physical attributes
    quantity = Column(Float, nullable=False, default=1.0)
    unit = Column(String(50), nullable=False, default='Pieces')
    age = Column(Float, default=2.0) # in years
    damage_percentage = Column(Float, default=10.0)
    original_usage = Column(String(100), default='Residential')
    condition_notes = Column(Text, nullable=True)
    
    # Commercial attributes
    price = Column(Float, nullable=False) # Seller price in INR
    ai_estimated_price = Column(Float, nullable=True)
    price_min = Column(Float, nullable=True)
    price_max = Column(Float, nullable=True)
    
    # Location
    city = Column(String(100), nullable=False)
    state = Column(String(100), nullable=False)
    pincode = Column(String(20), nullable=True)
    availability = Column(String(50), default='Immediate')
    
    # Moderation & Lifecycle
    status = Column(String(30), default='active') # active, pending_review, sold, flagged
    flag_reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    seller = relationship('User', back_populates='listings')
    material_ref = relationship('Material', back_populates='listings')
    purchase_requests = relationship('PurchaseRequest', back_populates='listing', cascade='all, delete-orphan')
    favorites = relationship('Favorite', back_populates='listing', cascade='all, delete-orphan')
    transactions = relationship('Transaction', back_populates='listing')

class PurchaseRequest(Base):
    __tablename__ = 'purchase_requests'

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey('listings.id'), nullable=False)
    buyer_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    quantity = Column(Float, nullable=False)
    proposed_price = Column(Float, nullable=False)
    message = Column(Text, nullable=True)
    preferred_pickup_date = Column(String(50), nullable=True)
    status = Column(String(30), default='pending') # pending, accepted, rejected, completed
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship('Listing', back_populates='purchase_requests')
    buyer = relationship('User', back_populates='purchase_requests')

class Favorite(Base):
    __tablename__ = 'favorites'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    listing_id = Column(Integer, ForeignKey('listings.id'), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='favorites')
    listing = relationship('Listing', back_populates='favorites')

class Transaction(Base):
    __tablename__ = 'transactions'

    id = Column(Integer, primary_key=True, index=True)
    listing_id = Column(Integer, ForeignKey('listings.id'), nullable=False)
    buyer_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    seller_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    quantity = Column(Float, nullable=False)
    price = Column(Float, nullable=False)
    status = Column(String(30), default='completed')
    created_at = Column(DateTime, default=datetime.utcnow)

    listing = relationship('Listing', back_populates='transactions')
    environmental_impact = relationship('EnvironmentalImpact', back_populates='transaction', uselist=False)

class EnvironmentalImpact(Base):
    __tablename__ = 'environmental_impact'

    id = Column(Integer, primary_key=True, index=True)
    transaction_id = Column(Integer, ForeignKey('transactions.id'), nullable=True)
    material_type = Column(String(100), nullable=False)
    quantity = Column(Float, nullable=False)
    unit = Column(String(50), default='Pieces')
    estimated_weight = Column(Float, nullable=False) # tonnes diverted
    estimated_co2_saving = Column(Float, nullable=False) # kg CO2e saved
    created_at = Column(DateTime, default=datetime.utcnow)

    transaction = relationship('Transaction', back_populates='environmental_impact')

class Search(Base):
    __tablename__ = 'searches'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    query = Column(String(255), nullable=False)
    filters = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Recommendation(Base):
    __tablename__ = 'recommendations'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    listing_id = Column(Integer, ForeignKey('listings.id'), nullable=False)
    score = Column(Float, default=0.0)
    reason = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

class Report(Base):
    __tablename__ = 'reports'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    listing_id = Column(Integer, ForeignKey('listings.id'), nullable=False)
    reason = Column(String(255), nullable=False)
    status = Column(String(30), default='pending') # pending, reviewed, resolved
    created_at = Column(DateTime, default=datetime.utcnow)

class ModelFeedback(Base):
    __tablename__ = 'model_feedback'

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=True)
    listing_id = Column(Integer, ForeignKey('listings.id'), nullable=True)
    image_url = Column(String(500), nullable=True)
    predicted_material = Column(String(100), nullable=False)
    corrected_material = Column(String(100), nullable=False)
    predicted_quality = Column(String(20), nullable=True)
    corrected_quality = Column(String(20), nullable=True)
    predicted_price = Column(Float, nullable=True)
    final_price = Column(Float, nullable=True)
    confidence = Column(Float, default=0.0)
    is_confirmed = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)

    user = relationship('User', back_populates='feedback_entries')
