from typing import List, Dict, Any

REUSE_KNOWLEDGE_BASE: Dict[str, Dict[str, List[str]]] = {
    'Red Bricks': {
        'Grade A': ['Primary partition walls', 'Decorative exposed brickwork', 'Interior masonry', 'Patios'],
        'Grade B': ['Garden boundary walls', 'Landscaping features', 'Paving walkways', 'Secondary outbuildings'],
        'Grade C': ['Retaining wall backing', 'Drainage trenches', 'Decorative garden edging', 'Sunken fire pits'],
        'Grade D': ['Aggregate crushing for concrete', 'Road sub-base filling', 'Soil stabilization'],
        'Grade E': ['Non-structural clean backfill']
    },
    'Concrete Rubble': {
        'Grade A': ['Modular landscape blocks', 'Retaining wall barriers', 'Foundation pads'],
        'Grade B': ['Sub-base for pavements', 'Curbing backing', 'Heavy equipment bedding'],
        'Grade C': ['Road base gravel alternative', 'Trench backfilling', 'Erosion control rip-rap'],
        'Grade D': ['Crushed coarse aggregate', 'Drainage gravel layer'],
        'Grade E': ['Deep land reclamation filling']
    },
    'Cement Blocks': {
        'Grade A': ['Loadbearing utility structures', 'Compound walls', 'Storage sheds'],
        'Grade B': ['Non-loadbearing interior dividers', 'Garden planters', 'Site perimeter fencing'],
        'Grade C': ['Temporary site hoardings', 'Sub-base filler blocks', 'Drainage channel walls'],
        'Grade D': ['Crushed masonry aggregate for sub-base'],
        'Grade E': ['Bulk landfill sub-grade']
    },
    'TMT Steel Rods': {
        'Grade A': ['Secondary structural rebar', 'Security grills & railings', 'Gate frameworks', 'Storage racks'],
        'Grade B': ['Ground slab reinforcement mesh', 'Utility brackets', 'Formwork bracing', 'Shed frameworks'],
        'Grade C': ['Secondary tying support', 'Garden pergolas', 'Scrap welding art'],
        'Grade D': ['Smelting & electric arc furnace recycling feed'],
        'Grade E': ['Industrial metal recycling process']
    },
    'Structural Wood / Timber': {
        'Grade A': ['Interior door frames', 'Furniture fabrication', 'Exposed ceiling rafters', 'Flooring joists'],
        'Grade B': ['Concrete formwork shuttering', 'Pergolas & decking', 'Garden planters', 'Workbenches'],
        'Grade C': ['Packaging pallets', 'Temporary site fencing', 'Timber framing infill'],
        'Grade D': ['Engineered wood particle boards', 'Mulch for landscaping'],
        'Grade E': ['Biomass fuel pelleting']
    },
    'Ceramic Floor Tiles': {
        'Grade A': ['Full floor and wall re-tiling', 'Kitchen splashbacks', 'Bathroom accents'],
        'Grade B': ['Balcony and utility area tiling', 'Garden pathway mosaics', 'Decorative tabletops'],
        'Grade C': ['Mosaic art murals', 'Broken tile outdoor pavers (Trencadis)'],
        'Grade D': ['Aggregate for terrazzo flooring', 'Drainage gravel'],
        'Grade E': ['Sub-grade crushed ceramic fill']
    },
    'Window Glass': {
        'Grade A': ['Direct window replacements', 'Greenhouse panels', 'Sunroom glazing'],
        'Grade B': ['Shed daylight panels', 'Interior glass partition dividers', 'Garden cold frames'],
        'Grade C': ['Decorative glass crafts', 'Garden cloches'],
        'Grade D': ['Glass cullet recycling & bottle manufacturing feed'],
        'Grade E': ['Abrasive blast media manufacturing']
    },
    'PVC Pipes': {
        'Grade A': ['Plumbing secondary drainage', 'Conduit cable protection', 'Rainwater downspouts'],
        'Grade B': ['Hydroponic garden systems', 'Underground electrical conduits', 'Agricultural drip lines'],
        'Grade C': ['Site drainage lines', 'Perforated soakaway pipes', 'Vertical planter tubes'],
        'Grade D': ['PVC regrind & extrusion recycling'],
        'Grade E': ['Polymer recycling facility processing']
    },
    'Galvanized Iron (GI) Pipes': {
        'Grade A': ['Structural scaffolding', 'Handrails & guardrails', 'Plumbing distribution lines'],
        'Grade B': ['Fencing posts', 'Irrigation pipework', 'Equipment frames'],
        'Grade C': ['Secondary support posts', 'Agricultural pen enclosures'],
        'Grade D': ['Scrap steel re-smelting'],
        'Grade E': ['Ferrous scrap recycling']
    },
    'Flush Doors': {
        'Grade A': ['Direct residential installation', 'Office cabin partitions', 'Acoustic door upgrades'],
        'Grade B': ['Interior utility doors', 'Shed & garage entrances', 'Repainted vintage features'],
        'Grade C': ['Reclaimed wood dining tables', 'Garden privacy screens', 'Sliding barn doors'],
        'Grade D': ['Salvage hardware & timber core reclamation'],
        'Grade E': ['Wood panel recycling processing']
    },
    'Aluminum Windows': {
        'Grade A': ['Direct architectural reuse', 'Commercial window retrofits', 'Enclosed balconies'],
        'Grade B': ['Workshop windows', 'Storage shed daylight openings'],
        'Grade C': ['Disassembled frame reuse', 'Glass panel extraction'],
        'Grade D': ['Aluminum remelting & extrusion recycling'],
        'Grade E': ['Metal scrap processing']
    },
    'Electrical Wiring & Panels': {
        'Grade A': ['Temporary construction power distribution', 'Low-voltage garden lighting', 'Sub-panels'],
        'Grade B': ['Non-critical conduit wiring', 'Equipment power leads'],
        'Grade C': ['Junction box reuse', 'Salvage enclosure boxes'],
        'Grade D': ['Copper recovery & insulation stripping recycling'],
        'Grade E': ['E-waste certified metal extraction']
    },
    'Corrugated Roofing Sheets': {
        'Grade A': ['Secondary roofing for sheds & garages', 'Rain covers', 'Site boundary hoardings'],
        'Grade B': ['Agricultural shelter roofs', 'Compost bin side walls'],
        'Grade C': ['Temporary site walkways', 'Material storage covers'],
        'Grade D': ['Metal/polycarbonate recycling stream'],
        'Grade E': ['Scrap shredding']
    },
    'Natural Stone Slabs': {
        'Grade A': ['Facade masonry cladding', 'Natural stone fireplaces', 'Retaining walls'],
        'Grade B': ['Dry stone boundary walls', 'Rock garden rockeries', 'Water feature borders'],
        'Grade C': ['Gabion wall cage filling', 'French drains', 'Driveway sub-base'],
        'Grade D': ['Coarse aggregate road ballast'],
        'Grade E': ['General bulk grading fill']
    },
    'Construction Sand': {
        'Grade A': ['Brickwork mortar mixing', 'Plastering work', 'Paving bed sand'],
        'Grade B': ['Sub-base levelling course', 'Pipe bedding sand', 'Concrete fill mix'],
        'Grade C': ['Landscaping fill', 'Backfill around foundations'],
        'Grade D': ['Bulk land reclamation filler'],
        'Grade E': ['Non-structural soil amendment']
    },
    'Marble Slabs': {
        'Grade A': ['Flooring restoration', 'Feature wall panels', 'Custom tabletops'],
        'Grade B': ['Bathroom vanity shelves', 'Window sills', 'Decorative borders'],
        'Grade C': ['Mosaic flooring pieces', 'Garden bench seating'],
        'Grade D': ['Crushed marble powder for plaster / stucco'],
        'Grade E': ['Industrial calcium carbonate source']
    },
    'Granite Slabs': {
        'Grade A': ['Kitchen countertops', 'Vanity tops', 'Threshold stones', 'Stair treads'],
        'Grade B': ['Outdoor barbecue counters', 'Garden paving slabs', 'Signboard pedestals'],
        'Grade C': ['Crazy paving garden walkways', 'Mosaic step borders'],
        'Grade D': ['Crushed granite ballast', 'Terrazzo chips'],
        'Grade E': ['Sub-base aggregate']
    },
    'Sanitaryware Ceramics': {
        'Grade A': ['Secondary restroom installation', 'Site office facilities'],
        'Grade B': ['Garden planters & decorative water basins'],
        'Grade C': ['Mosaic ceramic art fragments'],
        'Grade D': ['Crushed ceramic aggregate for road bases'],
        'Grade E': ['Inert mineral landfill fill']
    },
    'Mixed Demolition Waste': {
        'Grade A': ['Heavy retaining gabion fill', 'Structural embankment sub-base'],
        'Grade B': ['Road construction sub-base', 'Hardstanding parking area base'],
        'Grade C': ['Trench backfill', 'Site levelling fill'],
        'Grade D': ['Aggregate crushing plant processing feed'],
        'Grade E': ['Designated C&D inert waste disposal']
    },
    'Asbestos / Hazardous Sheeting': {
        'Grade A': ['PROHIBITED - Hazardous material'],
        'Grade B': ['PROHIBITED - Hazardous material'],
        'Grade C': ['PROHIBITED - Hazardous material'],
        'Grade D': ['PROHIBITED - Hazardous material'],
        'Grade E': ['MANDATORY HAZARDOUS DISPOSAL AT CERTIFIED FACILITY']
    }
}

DEFAULT_USES = [
    'Secondary non-structural construction',
    'Garden walls and landscaping accents',
    'Erosion control and trench backfill',
    'Material recycling and aggregate crushing'
]

SAFETY_RULES: Dict[str, str] = {
    'Asbestos / Hazardous Sheeting': 'CRITICAL SAFETY HAZARD: Contains carcinogenic asbestos fibers. DO NOT CUT, DRILL, OR DISTURB. Wear N95/P3 respirator and double-wrap in heavy polythene before hazardous transport.',
    'Electrical Wiring & Panels': 'ELECTRICAL SAFETY WARNING: Inspect for exposed copper core or insulation breakdown. Ensure complete de-energization before handling.',
    'Glass': 'CUT HAZARD: Sharp broken edges present. Handle with cut-resistant Level 5 kevlar gloves and safety eyewear.',
    'TMT Steel Rods': 'PINCH & HEAVY LOAD HAZARD: Use protective toe boots and heavy leather gloves during loading.',
    'Concrete Rubble': 'DUST & CRUSH HAZARD: Silicosis dust hazard. Wear dust mask and steel-toe boots.'
}

HAZARD_ALERTS: Dict[str, str] = {
    'Asbestos / Hazardous Sheeting': 'RED ALERT: Hazardous Class 9 pollutant. Listing blocked from commercial sale.',
    'Electrical Wiring & Panels': 'CAUTION: Ensure compliance with e-waste recovery guidelines.',
    'Red Bricks': 'SAFE: Low toxicity non-hazardous mineral waste.',
    'Concrete Rubble': 'NOTICE: Contains silica dust; suppress dust with water spray during processing.'
}

class ReuseRecommender:
    def get_uses_for_material(self, material: str, grade: str) -> Dict[str, Any]:
        cat_uses = REUSE_KNOWLEDGE_BASE.get(material, {})
        uses = cat_uses.get(grade, DEFAULT_USES)
        
        safety = SAFETY_RULES.get(material, 'STANDARD SAFETY: Wear work gloves, safety boots, and eye protection during transport and installation.')
        hazard = HAZARD_ALERTS.get(material, 'NON-HAZARDOUS: Safe for standard circular construction reuse.')

        return {
            'uses': uses,
            'safety_guidelines': safety,
            'hazard_alert': hazard
        }

reuse_engine = ReuseRecommender()
