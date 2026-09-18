# REBUILD AI – System Architecture Documentation

## 1. High-Level Architecture
REBUILD AI is built as a micro-modular full-stack circular economy application for construction and demolition (C&D) waste.

```
+-------------------------------------------------------------------------------+
|                             CLIENT INTERFACE LAYER                            |
|    React 18 + Vite SPA (Landing, Marketplace, 9-Step Wizard, Dashboards)      |
+-------------------------------------------------------------------------------+
                                      |  REST JSON / Multipart (Port 8000)
                                      v
+-------------------------------------------------------------------------------+
|                            FASTAPI APPLICATION LAYER                          |
|  - Auth & Security (JWT, bcrypt)        - Listing & Transaction Engine        |
|  - Circular LCA Environmental Engine    - Admin Governance & Moderation       |
+-------------------------------------------------------------------------------+
           |                                              |
           v                                              v
+-----------------------+                    +----------------------------------+
|   MACHINE LEARNING    |                    |         PERSISTENCE LAYER        |
|  - MobileNetV2 (CV)   |                    |  - SQLite / PostgreSQL (ORM)     |
|  - Quality Assessor   |                    |  - Static Uploads Media Store    |
|  - Gradient Boosting  |                    |  - Joblib Serialized Regressors  |
|  - Cosine Similarity  |                    |  - Continuous Feedback Repository|
+-----------------------+                    +----------------------------------+
```

## 2. Machine Learning Modules
1. **Material Classifier (`material_classifier.py`)**:
   - 20-category C&D classification with spectral heuristics, texture gradients, and MobileNetV2 transfer learning embeddings.
   - Low confidence detection (<0.70 threshold) triggering human safety validation.
2. **Quality Scoring (`quality_classifier.py`)**:
   - Assigns Grades A through E with an empirical 0-100 score.
   - Combines surface damage percentages, material durability constants, and environmental wear factors.
3. **Valuation Regressor (`price_predictor.py`)**:
   - Gradient Boosting Regressor achieving R² = 0.9349.
   - Benchmarks against virgin material price indices and city demand multipliers.
4. **Image Similarity Engine (`image_similarity.py`)**:
   - Computes cosine distance over normalized visual embedding vectors.
5. **Circularity & Carbon LCA (`environmental_calculator.py`)**:
   - Calculates avoided embodied carbon emissions ($kg\ CO_2e$) and diverted landfill mass ($tonnes$).
