# REBUILD AI – Dataset Description & ML Pipeline

## 1. Material Image Classes
1. Bricks
2. Concrete
3. Cement blocks
4. Steel
5. Wood
6. Tiles
7. Glass
8. PVC pipes
9. Metal pipes
10. Doors
11. Windows
12. Electrical components
13. Roofing materials
14. Stones
15. Sand
16. Marble
17. Granite
18. Ceramic materials
19. Mixed construction waste
20. Other

## 2. Second-Market Valuation Dataset (`ml/datasets/construction_price_dataset.csv`)
- **Sample Count**: 2,500 structured observations.
- **Features**:
  - `material_type` (Categorical, 20 classes)
  - `quality_grade` (Categorical, Grades A-E)
  - `quantity` (Numerical, continuous)
  - `unit` (Categorical: Pieces, Tonnes, kg, sq.ft, cubic meter)
  - `age_years` (Numerical, continuous)
  - `damage_percentage` (Numerical, 0 to 100%)
  - `original_price` (Numerical, INR baseline)
  - `current_market_price` (Numerical, virgin benchmark)
  - `location` (Categorical: Bangalore, Mysuru, Mumbai, Delhi, Hyderabad, Chennai, Pune)
  - `transport_distance` (Numerical, km)
  - `demand_score` (Numerical, city weight index)
  - `reuse_score` (Numerical, 0-100 circular score)
  - `selling_price` (Target variable, INR)

## 3. Evaluated Regressors
| Model | MAE (INR) | RMSE (INR) | R² Score |
| :--- | :--- | :--- | :--- |
| Linear Regression | ₹4,11,394 | ₹7,99,553 | 0.3839 |
| Random Forest Regressor | ₹58,897 | ₹3,50,458 | 0.8816 |
| **Gradient Boosting Regressor (Selected)** | **₹73,320** | **₹2,59,887** | **0.9349** |
