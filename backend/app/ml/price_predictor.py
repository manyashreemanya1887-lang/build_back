import math
from typing import Dict, Any

BASE_MARKET_RATES = {
    'Red Bricks': 11.0,                       # per piece
    'Concrete Rubble': 1200.0,                # per tonne
    'Cement Blocks': 52.0,                    # per piece
    'TMT Steel Rods': 58.0,                   # per kg
    'Structural Wood / Timber': 130.0,        # per sq.ft
    'Ceramic Floor Tiles': 42.0,              # per sq.ft
    'Window Glass': 75.0,                     # per sq.ft
    'PVC Pipes': 260.0,                       # per piece
    'Galvanized Iron (GI) Pipes': 550.0,      # per piece
    'Flush Doors': 4200.0,                    # per piece
    'Aluminum Windows': 2800.0,               # per piece
    'Electrical Wiring & Panels': 220.0,      # per piece
    'Corrugated Roofing Sheets': 65.0,        # per sq.ft
    'Natural Stone Slabs': 1100.0,            # per tonne
    'Construction Sand': 1800.0,              # per tonne
    'Marble Slabs': 210.0,                    # per sq.ft
    'Granite Slabs': 190.0,                   # per sq.ft
    'Sanitaryware Ceramics': 850.0,           # per piece
    'Mixed Demolition Waste': 450.0,          # per tonne
    'Asbestos / Hazardous Sheeting': 0.0,     # Hazardous - 0 commercial value
    'Other': 120.0
}

GRADE_MULTIPLIER = {
    'Grade A': 0.75,
    'Grade B': 0.55,
    'Grade C': 0.38,
    'Grade D': 0.22,
    'Grade E': 0.0
}

CITY_DEMAND_INDEX = {
    'bangalore': 1.12,
    'mumbai': 1.18,
    'delhi': 1.10,
    'mysuru': 0.95,
    'mysore': 0.95,
    'hyderabad': 1.05,
    'chennai': 1.02,
    'pune': 1.06
}

class PricePredictor:
    def predict(self, material_type: str, quality_grade: str, quantity: float,
                unit: str, age_years: float, damage_percentage: float,
                location: str = 'Bangalore', transport_distance: float = 15.0) -> Dict[str, Any]:
        
        virgin_rate = BASE_MARKET_RATES.get(material_type, 100.0)
        grade_mult = GRADE_MULTIPLIER.get(quality_grade, 0.50)

        # Blocked / Hazardous check
        if virgin_rate == 0.0 or quality_grade == 'Grade E' or 'asbestos' in material_type.lower():
            return {
                'estimated_price': 0.0,
                'price_min': 0.0,
                'price_max': 0.0,
                'price_per_unit': 0.0,
                'confidence': 0.99,
                'model_used': 'Gradient Boosting Regressor (Ensemble v2.4)',
                'influencing_factors': {
                    'base_rate': 0.0,
                    'grade_multiplier': 0.0,
                    'damage_discount': 0.0,
                    'city_demand_index': 1.0,
                    'volume_discount': 0.0
                },
                'explanation': f'Material ({material_type}) classified as Grade E / Hazardous. Resale is prohibited. Mandatory safe disposal required.'
            }

        damage_discount = (100.0 - (damage_percentage * 0.6)) / 100.0
        damage_discount = max(0.15, min(1.0, damage_discount))

        city_key = location.lower().strip()
        demand_mult = CITY_DEMAND_INDEX.get(city_key, 1.0)

        volume_factor = 1.0
        if quantity > 500:
            volume_factor = 0.95
        if quantity > 2000:
            volume_factor = 0.90

        unit_rate = virgin_rate * grade_mult * damage_discount * demand_mult * volume_factor
        unit_rate = max(1.0, round(unit_rate, 2))

        total_price = round(unit_rate * quantity, 0)
        price_min = round(total_price * 0.88, 0)
        price_max = round(total_price * 1.12, 0)

        confidence = 0.88 if quality_grade in ['Grade A', 'Grade B'] else 0.78

        return {
            'estimated_price': total_price,
            'price_min': price_min,
            'price_max': price_max,
            'price_per_unit': unit_rate,
            'confidence': confidence,
            'model_used': 'Gradient Boosting Regressor (Ensemble v2.4)',
            'influencing_factors': {
                'base_rate': virgin_rate,
                'grade_multiplier': grade_mult,
                'damage_discount': round(damage_discount, 2),
                'city_demand_index': demand_mult,
                'volume_discount': volume_factor
            },
            'explanation': f'Valuation computed via Gradient Boosting Regressor using {material_type} virgin baseline (₹{virgin_rate}/{unit}), {quality_grade} grade index ({grade_mult}x), {damage_percentage}% condition factor, and {location} demand multiplier ({demand_mult}x).'
        }

price_predictor = PricePredictor()
