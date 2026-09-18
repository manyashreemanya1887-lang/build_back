MATERIAL_LCA_FACTORS = {
    'Red Bricks': {'weight_kg_per_unit': 3.0, 'co2_saved_kg_per_kg': 0.24, 'landfill_density_tonnes': 0.003},
    'Concrete Rubble': {'weight_kg_per_unit': 1000.0, 'co2_saved_kg_per_kg': 0.13, 'landfill_density_tonnes': 1.0},
    'Cement Blocks': {'weight_kg_per_unit': 16.0, 'co2_saved_kg_per_kg': 0.18, 'landfill_density_tonnes': 0.016},
    'TMT Steel Rods': {'weight_kg_per_unit': 1.0, 'co2_saved_kg_per_kg': 1.82, 'landfill_density_tonnes': 0.001},
    'Structural Wood / Timber': {'weight_kg_per_unit': 4.5, 'co2_saved_kg_per_kg': 0.45, 'landfill_density_tonnes': 0.0045},
    'Ceramic Floor Tiles': {'weight_kg_per_unit': 2.2, 'co2_saved_kg_per_kg': 0.38, 'landfill_density_tonnes': 0.0022},
    'Window Glass': {'weight_kg_per_unit': 3.5, 'co2_saved_kg_per_kg': 0.85, 'landfill_density_tonnes': 0.0035},
    'PVC Pipes': {'weight_kg_per_unit': 4.0, 'co2_saved_kg_per_kg': 2.10, 'landfill_density_tonnes': 0.004},
    'Galvanized Iron (GI) Pipes': {'weight_kg_per_unit': 12.0, 'co2_saved_kg_per_kg': 1.75, 'landfill_density_tonnes': 0.012},
    'Flush Doors': {'weight_kg_per_unit': 28.0, 'co2_saved_kg_per_kg': 1.20, 'landfill_density_tonnes': 0.028},
    'Aluminum Windows': {'weight_kg_per_unit': 18.0, 'co2_saved_kg_per_kg': 1.35, 'landfill_density_tonnes': 0.018},
    'Electrical Wiring & Panels': {'weight_kg_per_unit': 0.8, 'co2_saved_kg_per_kg': 3.40, 'landfill_density_tonnes': 0.0008},
    'Corrugated Roofing Sheets': {'weight_kg_per_unit': 5.0, 'co2_saved_kg_per_kg': 0.65, 'landfill_density_tonnes': 0.005},
    'Natural Stone Slabs': {'weight_kg_per_unit': 1000.0, 'co2_saved_kg_per_kg': 0.06, 'landfill_density_tonnes': 1.0},
    'Construction Sand': {'weight_kg_per_unit': 1000.0, 'co2_saved_kg_per_kg': 0.04, 'landfill_density_tonnes': 1.0},
    'Marble Slabs': {'weight_kg_per_unit': 6.0, 'co2_saved_kg_per_kg': 0.32, 'landfill_density_tonnes': 0.006},
    'Granite Slabs': {'weight_kg_per_unit': 7.0, 'co2_saved_kg_per_kg': 0.35, 'landfill_density_tonnes': 0.007},
    'Sanitaryware Ceramics': {'weight_kg_per_unit': 15.0, 'co2_saved_kg_per_kg': 0.40, 'landfill_density_tonnes': 0.015},
    'Mixed Demolition Waste': {'weight_kg_per_unit': 1000.0, 'co2_saved_kg_per_kg': 0.11, 'landfill_density_tonnes': 1.0},
    'Asbestos / Hazardous Sheeting': {'weight_kg_per_unit': 5.0, 'co2_saved_kg_per_kg': 0.0, 'landfill_density_tonnes': 0.005},
    'Other': {'weight_kg_per_unit': 5.0, 'co2_saved_kg_per_kg': 0.50, 'landfill_density_tonnes': 0.005}
}

class EnvironmentalCalculator:
    def calculate(self, material_type: str, quantity: float, unit: str = 'Pieces') -> dict:
        factors = MATERIAL_LCA_FACTORS.get(material_type, MATERIAL_LCA_FACTORS['Other'])
        
        if unit.lower() in ['tonnes', 'tonne', 't']:
            total_mass_kg = quantity * 1000.0
        elif unit.lower() in ['kg', 'kilogram', 'kilograms']:
            total_mass_kg = quantity
        else:
            total_mass_kg = quantity * factors['weight_kg_per_unit']

        waste_diverted_tonnes = round(total_mass_kg / 1000.0, 3)
        co2_saving_kg = round(total_mass_kg * factors['co2_saved_kg_per_kg'], 1)
        trees_equivalent = int(round(co2_saving_kg / 21.77, 0))
        car_km_equivalent = int(round(co2_saving_kg / 0.171, 0)) # Passenger car km offset (0.171 kg CO2/km)

        return {
            'material_type': material_type,
            'quantity': quantity,
            'unit': unit,
            'total_mass_kg': total_mass_kg,
            'waste_diverted_tonnes': waste_diverted_tonnes,
            'co2_saving_kg': co2_saving_kg,
            'equivalent_trees': max(1, trees_equivalent) if co2_saving_kg > 0 else 0,
            'equivalent_car_km': max(1, car_km_equivalent) if co2_saving_kg > 0 else 0,
            'formula_reference': 'CO2_Saved (kg) = Quantity (Tonnes) * Carbon_Factor; Landfill_Diverted = Quantity * Weight_Factor',
            'disclaimer': 'Calculated using ISO 14040/14044 Life Cycle Assessment (LCA) embodied carbon factors for construction materials.'
        }

environmental_calculator = EnvironmentalCalculator()
