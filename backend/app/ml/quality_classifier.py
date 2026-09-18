from typing import List
from .reuse_recommender import reuse_engine

GRADE_DEFINITIONS = {
    'Grade A': {
        'grade': 'Grade A',
        'color_flag': 'GREEN',
        'flag_emoji': '🟢',
        'condition': 'Prime Condition',
        'desc': 'Almost new, minimal damage. Safe for direct structural or primary construction reuse.',
        'score_range': (85, 100),
        'recyclability': 'Directly Reusable',
        'recyclability_notes': 'Can be reused directly in primary structural or architectural construction.'
    },
    'Grade B': {
        'grade': 'Grade B',
        'color_flag': 'BLUE',
        'flag_emoji': '🔵',
        'condition': 'Good Condition',
        'desc': 'Minor wear or cosmetic marks. Suitable for secondary structural or decorative applications.',
        'score_range': (70, 84),
        'recyclability': 'Directly Reusable',
        'recyclability_notes': 'Suitable for secondary structures, non-loadbearing partitions, and landscaping.'
    },
    'Grade C': {
        'grade': 'Grade C',
        'color_flag': 'YELLOW',
        'flag_emoji': '🟡',
        'condition': 'Fair Condition',
        'desc': 'Visible weathering or superficial damage. Suitable for non-structural, temporary, or fill usage.',
        'score_range': (50, 69),
        'recyclability': 'Processing Required',
        'recyclability_notes': 'Requires cleaning, sorting, mortar removal, or minor mechanical rework.'
    },
    'Grade D': {
        'grade': 'Grade D',
        'color_flag': 'ORANGE',
        'flag_emoji': '🟠',
        'condition': 'Poor Condition',
        'desc': 'Significant breakage or heavy corrosion. Recommended for industrial recycling or heavy processing only.',
        'score_range': (30, 49),
        'recyclability': 'Recyclable',
        'recyclability_notes': 'Best sent to mechanical recycling facilities for aggregate crushing or re-smelting.'
    },
    'Grade E': {
        'grade': 'Grade E',
        'color_flag': 'RED',
        'flag_emoji': '🔴',
        'condition': 'Hazardous / Severe Degradation',
        'desc': 'Severe structural failure or hazardous material (e.g. Asbestos). Disposal mandated; listing blocked from public sale.',
        'score_range': (0, 29),
        'recyclability': 'Hazardous Disposal Mandated',
        'recyclability_notes': 'Dispose immediately via authorized hazardous / C&D waste management protocols.'
    }
}

class QualityClassifier:
    def assess(self, material: str, age_years: float, damage_percentage: float, original_usage: str) -> dict:
        base_score = 100.0

        # Special handling for Asbestos / Hazardous materials
        if 'asbestos' in material.lower() or 'hazardous' in material.lower():
            score = 0.0
            grade_key = 'Grade E'
            info = GRADE_DEFINITIONS[grade_key]
            uses_data = reuse_engine.get_uses_for_material(material, grade_key)
            return {
                'material': material,
                'quality_grade': info['grade'],
                'color_flag': info['color_flag'],
                'flag_emoji': info['flag_emoji'],
                'quality_score': score,
                'condition': info['condition'],
                'recommended_uses': uses_data['uses'],
                'recyclability': info['recyclability'],
                'recyclability_notes': info['recyclability_notes'],
                'safety_guidelines': uses_data['safety_guidelines'],
                'hazard_alert': uses_data['hazard_alert'],
                'listing_blocked': True,
                'damage_percentage': damage_percentage,
                'structural_advisory_disclaimer': 'CRITICAL WARNING: Asbestos / Hazardous material detected. Listing creation blocked. Mandatory safe disposal mandated by environmental law.'
            }

        # Direct damage penalty
        damage_penalty = damage_percentage * 0.75
        base_score -= damage_penalty

        # Age penalty depending on material durability
        durable_materials = [
            'Granite Slabs', 'Marble Slabs', 'Natural Stone Slabs', 'TMT Steel Rods',
            'Concrete Rubble', 'Sanitaryware Ceramics'
        ]
        perishable_materials = [
            'Structural Wood / Timber', 'PVC Pipes', 'Electrical Wiring & Panels',
            'Corrugated Roofing Sheets', 'Flush Doors'
        ]

        if material in durable_materials:
            age_penalty = min(15.0, age_years * 0.8)
        elif material in perishable_materials:
            age_penalty = min(25.0, age_years * 2.2)
        else:
            age_penalty = min(20.0, age_years * 1.4)
        base_score -= age_penalty

        # Usage environment penalty
        if original_usage.lower() in ['industrial', 'demolition']:
            base_score -= 8.0
        elif original_usage.lower() == 'infrastructure':
            base_score -= 5.0

        score = max(5.0, min(98.0, base_score))
        score = round(score, 1)

        # Grade assignment
        if score >= 85:
            grade_key = 'Grade A'
        elif score >= 70:
            grade_key = 'Grade B'
        elif score >= 50:
            grade_key = 'Grade C'
        elif score >= 30:
            grade_key = 'Grade D'
        else:
            grade_key = 'Grade E'

        info = GRADE_DEFINITIONS[grade_key]
        uses_data = reuse_engine.get_uses_for_material(material, grade_key)
        is_blocked = (grade_key == 'Grade E')

        return {
            'material': material,
            'quality_grade': info['grade'],
            'color_flag': info['color_flag'],
            'flag_emoji': info['flag_emoji'],
            'quality_score': score,
            'condition': info['condition'],
            'recommended_uses': uses_data['uses'],
            'recyclability': info['recyclability'],
            'recyclability_notes': info['recyclability_notes'],
            'safety_guidelines': uses_data['safety_guidelines'],
            'hazard_alert': uses_data['hazard_alert'],
            'listing_blocked': is_blocked,
            'damage_percentage': damage_percentage,
            'structural_advisory_disclaimer': 'Notice: Reuse recommendations are AI-assisted circular economy suggestions and must not be taken as certified structural engineering advice.'
        }

quality_assessor = QualityClassifier()
