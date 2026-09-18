# REBUILD AI – API Reference Documentation

Base URL: `http://localhost:8000`

### Authentication Endpoints
- `POST /api/auth/register`: Create contractor/buyer/both account
- `POST /api/auth/login`: Authenticate and receive JWT Bearer token
- `GET /api/auth/me`: Retrieve current logged-in user profile

### Machine Learning Endpoints
- `POST /api/ml/predict-material`: Accepts image file upload, returns predicted material, confidence, and alternatives.
- `POST /api/ml/assess-quality`: Inputs material, age, damage %, returns Grade A-E and 0-100 score.
- `POST /api/ml/predict-price`: Inputs material, quality, quantity, location, returns estimated price & range.
- `POST /api/ml/image-search`: Uploads reference image, returns visually similar marketplace listings.
- `POST /api/ml/feedback`: Stores user validation or corrections into continuous retraining queue.
- `GET /api/ml/model-metrics`: Returns live model accuracy, precision, recall, confusion matrix, and R² scores.

### Listing Endpoints
- `GET /api/listings`: Search & filter listings by keyword, category, quality, city, price.
- `POST /api/listings`: Create new circular material listing.
- `GET /api/listings/{id}`: Full listing details with seller details, AI analysis, and LCA carbon savings.
- `PUT /api/listings/{id}`: Update listing.
- `DELETE /api/listings/{id}`: Delete listing.
- `POST /api/listings/{id}/favorite`: Toggle user favorite status.

### Purchase & Transaction Endpoints
- `POST /api/purchases/request`: Submit purchase/pickup request.
- `GET /api/purchases/my-requests`: Buyer requests history.
- `GET /api/purchases/incoming-requests`: Seller incoming buyer requests.
- `PUT /api/purchases/request/{id}`: Accept/decline request (accepting records completed transaction and environmental savings).

### Environmental & Admin Endpoints
- `GET /api/environmental/summary`: Platform-wide waste diverted (tonnes) and CO2 saved (kg).
- `GET /api/admin/statistics`: Overview KPIs, user growth, material distribution.
- `GET /api/admin/ai-monitoring`: Inferences count, average confidence, low-confidence review queue.
- `POST /api/admin/moderate-listing/{id}`: Approve, flag, or reject listing.
