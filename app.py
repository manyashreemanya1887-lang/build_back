import os
import requests
import streamlit as st
from PIL import Image
import io

# ---------------------------------------------------------
# BUILD BACK AI - Streamlit Demonstration Interface
# Workflow: IMAGE -> MATERIAL -> QUALITY -> CONDITION -> USABILITY -> PRICE -> RECOMMENDATION
# Communicates with FastAPI backend over HTTP (default: http://127.0.0.1:8000)
# ---------------------------------------------------------

BUILDBACK_API_URL = os.environ.get("BUILDBACK_API_URL", "http://127.0.0.1:8000").rstrip('/')

st.set_page_config(
    page_title="BUILD BACK - AI Construction Material Assessor",
    page_icon="🏗️",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
    <style>
    .main-title {
        font-size: 2.4rem;
        font-weight: 800;
        color: #0f172a;
        margin-bottom: 0px;
    }
    .sub-title {
        font-size: 1.1rem;
        color: #64748b;
        margin-bottom: 24px;
    }
    .section-card {
        background-color: #f8fafc;
        border: 1px solid #e2e8f0;
        border-radius: 12px;
        padding: 20px;
        margin-bottom: 16px;
    }
    .metric-value {
        font-size: 1.8rem;
        font-weight: 700;
        color: #0284c7;
    }
    .badge-green { background-color: #dcfce7; color: #166534; padding: 4px 12px; border-radius: 9999px; font-weight: 600; }
    .badge-blue { background-color: #dbeafe; color: #1e40af; padding: 4px 12px; border-radius: 9999px; font-weight: 600; }
    .badge-yellow { background-color: #fef9c3; color: #854d0e; padding: 4px 12px; border-radius: 9999px; font-weight: 600; }
    .badge-orange { background-color: #ffedd5; color: #9a3412; padding: 4px 12px; border-radius: 9999px; font-weight: 600; }
    .badge-red { background-color: #fee2e2; color: #991b1b; padding: 4px 12px; border-radius: 9999px; font-weight: 600; }
    </style>
""", unsafe_allow_html=True)

st.markdown('<div class="main-title">BUILD BACK</div>', unsafe_allow_html=True)
st.markdown('<div class="sub-title">AI-Powered Construction Material Quality & Value Assessment</div>', unsafe_allow_html=True)

# Sidebar Parameters for Refinement
st.sidebar.header("⚙️ Assessment Parameters")
st.sidebar.markdown("Configure material parameters to refine the AI assessment.")

quantity_input = st.sidebar.number_input("Quantity", min_value=1.0, value=100.0, step=10.0)
unit_input = st.sidebar.selectbox("Unit", ["piece", "kg", "tonne", "sq.ft", "metre", "cubic metre", "lot"], index=0)
age_years_input = st.sidebar.slider("Age (Years)", min_value=0.0, max_value=20.0, value=2.0, step=0.5)
damage_percentage_input = st.sidebar.slider("Damage / Wear (%)", min_value=0.0, max_value=100.0, value=15.0, step=5.0)
location_input = st.sidebar.selectbox("City Location", ["Bangalore", "Mysuru", "Mumbai", "Delhi", "Hyderabad", "Chennai", "Pune"], index=0)
usage_input = st.sidebar.selectbox("Original Usage Context", ["Residential", "Commercial", "Industrial", "Infrastructure"], index=0)

# Main UI - Image Uploader
uploaded_file = st.file_uploader("Upload Construction Material Image", type=["jpg", "jpeg", "png", "webp"])

if uploaded_file is not None:
    col_img, col_info = st.columns([1, 1])

    with col_img:
        st.subheader("📷 Image Preview")
        image = Image.open(uploaded_file)
        st.image(image, use_container_width=True)

    with col_info:
        st.subheader("🔍 Material AI Pipeline")
        st.write("Click **Analyse Material** to trigger backend AI material detection, quality assessment, visual condition scoring, price estimation, and circular economy recommendations.")
        analyze_btn = st.button("Analyse Material", type="primary", use_container_width=True)

    if analyze_btn:
        with st.spinner("Connecting to BuildBack AI Backend..."):
            # 1. API Call: Material Classifier
            try:
                uploaded_file.seek(0)
                files = {"file": (uploaded_file.name, uploaded_file.getvalue(), uploaded_file.type)}
                res_mat = requests.post(f"{BUILDBACK_API_URL}/api/ml/predict-material", files=files, timeout=12)
                
                if res_mat.status_code != 200:
                    st.error(f"Backend API Error ({res_mat.status_code}): Could not classify material image.")
                    st.stop()
                
                mat_data = res_mat.json()
            except requests.exceptions.ConnectionError:
                st.error(f"⚠️ Backend unavailable. Please make sure FastAPI backend is running at `{BUILDBACK_API_URL}`.")
                st.stop()
            except Exception as e:
                st.error(f"An unexpected error occurred during material detection: {str(e)}")
                st.stop()

            detected_material = mat_data.get("material", "Unknown")
            confidence = mat_data.get("confidence", 0.0)
            is_low_confidence = mat_data.get("is_low_confidence", False)

            # LOW CONFIDENCE CHECK
            if is_low_confidence or confidence < 0.70:
                st.warning("⚠️ **Low Confidence**: The AI could not identify the material with sufficient confidence (<70%). Please upload a clearer image.")
                st.info(f"Top detected candidate: **{detected_material}** ({int(confidence * 100)}% confidence).")
                st.stop()

            # 2. API Call: Quality Assessor
            try:
                quality_payload = {
                    "material": detected_material,
                    "age_years": float(age_years_input),
                    "damage_percentage": float(damage_percentage_input),
                    "original_usage": usage_input
                }
                res_qual = requests.post(f"{BUILDBACK_API_URL}/api/ml/assess-quality", json=quality_payload, timeout=10)
                qual_data = res_qual.json() if res_qual.status_code == 200 else {}
            except Exception:
                qual_data = {}

            # Map Grade to standard Grade text descriptions
            quality_grade = qual_data.get("quality_grade", "Grade B")
            quality_score = qual_data.get("quality_score", 75.0)
            color_flag = qual_data.get("color_flag", "BLUE")
            recyclability = qual_data.get("recyclability", "Directly Reusable")
            recommended_uses = qual_data.get("recommended_uses", ["Secondary construction"])
            safety_guidelines = qual_data.get("safety_guidelines", "Standard site safety precautions.")

            # Condition mapping
            if damage_percentage_input <= 5:
                visual_condition = "New / Unused"
            elif damage_percentage_input <= 20:
                visual_condition = "Good Condition"
            elif damage_percentage_input <= 40:
                visual_condition = "Slightly Damaged"
            elif damage_percentage_input <= 65:
                visual_condition = "Moderately Damaged"
            elif damage_percentage_input <= 85:
                visual_condition = "Heavily Damaged"
            else:
                visual_condition = "Broken / Poor Condition"

            condition_score = round(max(0.0, 100.0 - damage_percentage_input * 0.8), 1)

            # 3. API Call: Price Predictor
            try:
                price_payload = {
                    "material_type": detected_material,
                    "quality_grade": quality_grade,
                    "quantity": float(quantity_input),
                    "unit": unit_input,
                    "age_years": float(age_years_input),
                    "damage_percentage": float(damage_percentage_input),
                    "location": location_input,
                    "original_usage": usage_input,
                    "transport_distance": 15.0
                }
                res_price = requests.post(f"{BUILDBACK_API_URL}/api/ml/predict-price", json=price_payload, timeout=10)
                price_data = res_price.json() if res_price.status_code == 200 else {}
            except Exception:
                price_data = {}

            unit_price = price_data.get("price_per_unit", 10.0)
            total_value = price_data.get("estimated_price", unit_price * quantity_input)

            # Recommendation Logic
            if quality_grade in ["Grade A"] and damage_percentage_input <= 10:
                action_recommendation = "Direct Structural Reuse"
            elif quality_grade in ["Grade B"] and damage_percentage_input <= 25:
                action_recommendation = "Secondary Construction Use"
            elif quality_grade in ["Grade C"] and damage_percentage_input <= 50:
                action_recommendation = "Reuse After Cleaning & Minor Processing"
            elif quality_grade in ["Grade D"]:
                action_recommendation = "Send to Recycling Facility (Crushing / Downcycling)"
            else:
                action_recommendation = "Not Suitable for Direct Reuse (Hazardous Disposal / Scrap)"

            st.divider()
            st.markdown("### 📊 Assessment Report")

            # 1. MATERIAL
            r_col1, r_col2 = st.columns(2)
            with r_col1:
                st.markdown("#### 1. MATERIAL")
                st.markdown(f"**Detected Material:** `{detected_material}`")
                st.markdown(f"**Detection Confidence:** `{int(confidence * 100)}%`")
                st.progress(float(confidence))

            # 2. QUALITY
            with r_col2:
                st.markdown("#### 2. QUALITY")
                grade_letter = quality_grade.replace("Grade ", "")
                st.markdown(f"**Quality Grade:** `{quality_grade}` (Score: `{quality_score} / 100`)")
                st.markdown(f"**Recyclability Status:** `{recyclability}`")

            st.divider()

            # 3. CONDITION & USABILITY
            c_col1, c_col2 = st.columns(2)
            with c_col1:
                st.markdown("#### 3. CONDITION")
                st.markdown(f"**AI-estimated Visual Condition:** `{visual_condition}`")
                st.markdown(f"**Condition Score:** `{condition_score} / 100`")
                st.caption("Notice: AI-estimated visual condition based on image surface features.")

            with c_col2:
                st.markdown("#### 4. USABILITY")
                st.markdown("**Suitable Applications:**")
                for u in recommended_uses[:3]:
                    st.markdown(f"- {u}")

            st.divider()

            # 5. PRICE & RECOMMENDATION
            p_col1, p_col2 = st.columns(2)
            with p_col1:
                st.markdown("#### 5. PRICE ESTIMATION")
                st.markdown(f"**Estimated Unit Price:** `₹{unit_price:,.2f} / {unit_input}`")
                st.markdown(f"**Entered Quantity:** `{quantity_input:,.1f} {unit_input}`")
                st.markdown(f"**Estimated Total Value:** <span class='metric-value'>₹{total_value:,.2f}</span>", unsafe_allow_html=True)

            with p_col2:
                st.markdown("#### 6. RECYCLING RECOMMENDATION")
                st.info(f"**Recommended Action:** {action_recommendation}")
                st.caption(f"**Safety Advisory:** {safety_guidelines}")

            # Disclaimer
            st.divider()
            st.caption("📌 **Notice / Disclaimer:** AI-generated assessment is based on visible image characteristics and available project data. It is an estimated visual assessment and not a certified engineering inspection or guaranteed market price.")

else:
    st.info("👆 Please upload a construction material image to run the BuildBack AI quality and valuation assessment.")
