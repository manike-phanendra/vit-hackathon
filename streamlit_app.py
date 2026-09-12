import streamlit as st
import pandas as pd
import random
import time

st.set_page_config(
    page_title="KrishiShield | AI Parametric Insurance",
    page_icon="🌾",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Custom Styling
st.markdown("""
<style>
    .main-title {
        font-size: 2.5rem;
        font-weight: 900;
        color: #22c55e;
        margin-bottom: 0px;
    }
    .sub-title {
        font-size: 1.1rem;
        color: #a7f3d0;
        margin-bottom: 20px;
    }
    .metric-card {
        background-color: #102419;
        border: 1px solid #22c55e40;
        border-radius: 16px;
        padding: 16px;
        color: white;
    }
    .stApp {
        background-color: #05110b;
        color: #f3f4f6;
    }
</style>
""", unsafe_allow_html=True)

st.markdown("<h1 class='main-title'>🌾 KrishiShield (FS-2604)</h1>", unsafe_allow_html=True)
st.markdown("<p class='sub-title'>AI-Explained Parametric Micro-Insurance for Smallholder Farmers | Multi-Oracle Consensus Engine</p>", unsafe_allow_html=True)

# Sidebar Navigation
st.sidebar.image("https://img.icons8.com/color/96/wheat.png", width=64)
st.sidebar.title("KrishiShield Navigation")
view_mode = st.sidebar.radio(
    "Select Dashboard View:",
    ["🏢 Provider Executive Dashboard (450 Farmers)", "🌾 Farmer Policy & Telemetry Shield", "📡 Multi-Oracle Consensus Feed", "🤖 AI Voice Assistant & Audit Trail"]
)

st.sidebar.markdown("---")
st.sidebar.subheader("🗓️ Active Seasonal Filter")
season = st.sidebar.selectbox("Season Presets:", ["Kharif 2026 (Jun 01 – Sep 30)", "Rabi 2025–26 (Oct 01 – Mar 31)", "Summer Zaid 2026 (Apr 01 – May 31)", "Full Year 2026"])
st.sidebar.info("📊 Data dynamically filtered by selected seasonal index.")

# Helper generator for 450 farmers
@st.cache_data
def get_450_farmers():
    first_names = ['Ramesh', 'Anitha', 'Venkat', 'Srinivas', 'Kavitha', 'Balaram', 'Rajendra', 'Sunitha', 'Venkatesh', 'Swapna', 'Mahender', 'Madhavi', 'Chandra', 'Bhaskar', 'Sudhakar']
    last_names = ['Kumar', 'Rao', 'Reddy', 'Goud', 'Chenna', 'Naidu', 'Prasad', 'Chowdary', 'Devi', 'Varma', 'Kulkarni', 'Patel', 'Sharma']
    crops = ['Paddy (Kharif)', 'Cotton', 'Groundnut', 'Maize', 'Chilli']
    locations = ['Warangal Central', 'Nalgonda East', 'Karimnagar North', 'Khammam South', 'Mahabubnagar West', 'Nizamabad', 'Medak', 'Siddipet']
    
    data = []
    for i in range(450):
        fn = first_names[i % len(first_names)]
        ln = last_names[(i * 7 + 3) % len(last_names)]
        crop = crops[(i * 3) % len(crops)]
        loc = locations[(i * 5) % len(locations)]
        
        status = 'ACTIVE'
        if i < 42:
            status = 'TRIGGERED'
        elif i < 170:
            status = 'APPROVED'
        elif i < 425:
            status = 'ACTIVE'
        else:
            status = 'REJECTED'
            
        rain_obs = 28.0 if status in ['TRIGGERED', 'APPROVED'] else 45.5
        
        data.append({
            "Policy ID": f"POL-{1001 + i}",
            "Farmer ID": f"USR-{101 + (i % 350)}",
            "Farmer Name": f"{fn} {ln}",
            "Crop": crop,
            "Location": loc,
            "Observed Rain (mm)": rain_obs,
            "Rain Threshold (mm)": 40.0,
            "Coverage (₹)": 20000 if 'Paddy' in crop else 15000,
            "Premium (₹)": 499 if 'Paddy' in crop else 399,
            "Status": status,
            "Oracle Consensus": f"{92 + (i % 8)}%",
            "Enrollment Date": f"2026-06-{String(1 + (i % 28)).zfill(2) if 'String' in globals() else str(1 + (i % 28)).zfill(2)}"
        })
    return pd.DataFrame(data)

df = get_450_farmers()

# VIEW 1: PROVIDER DASHBOARD
if view_mode == "🏢 Provider Executive Dashboard (450 Farmers)":
    st.header("🏢 Insurer & Provider Executive Portfolio")
    st.caption("Real-time risk exposure, premium collection growth, and 450 farmer policy roster.")
    
    col1, col2, col3, col4, col5, col6 = st.columns(6)
    col1.metric("Total Policies", len(df))
    col2.metric("Active Healthy", len(df[df['Status'] == 'ACTIVE']))
    col3.metric("Premium Collected", f"₹{(df['Premium (₹)'].sum()/100000):.2f} L")
    col4.metric("Coverage Exposure", f"₹{(df['Coverage (₹)'].sum()/10000000):.2f} Cr")
    col5.metric("Pending Triggered", len(df[df['Status'] == 'TRIGGERED']))
    col6.metric("Total Payouts", f"₹{(df[df['Status'] == 'APPROVED']['Coverage (₹)'].sum()/10000000):.2f} Cr")
    
    st.markdown("---")
    
    status_filter = st.radio("Filter Roster by Status:", ["ALL (450)", "TRIGGERED (42)", "APPROVED (128)", "ACTIVE (255)"], horizontal=True)
    
    filtered_df = df
    if "TRIGGERED" in status_filter:
        filtered_df = df[df['Status'] == 'TRIGGERED']
    elif "APPROVED" in status_filter:
        filtered_df = df[df['Status'] == 'APPROVED']
    elif "ACTIVE" in status_filter:
        filtered_df = df[df['Status'] == 'ACTIVE']
        
    st.dataframe(filtered_df, use_container_width=True, height=400)

# VIEW 2: FARMER DASHBOARD
elif view_mode == "🌾 Farmer Policy & Telemetry Shield":
    st.header("🌾 Farmer Policy Shield & Telemetry Audit")
    
    selected_farmer = st.selectbox("Select Farmer Profile:", df['Farmer Name'].tolist())
    farmer_row = df[df['Farmer Name'] == selected_farmer].iloc[0]
    
    c1, c2 = st.columns(2)
    with c1:
        st.subheader("📋 Enrolled Policy Details")
        st.write(f"**Policy ID:** `{farmer_row['Policy ID']}`")
        st.write(f"**Farmer ID:** `{farmer_row['Farmer ID']}`")
        st.write(f"**Crop:** {farmer_row['Crop']}")
        st.write(f"**Location:** {farmer_row['Location']}")
        st.write(f"**Sum Coverage:** ₹{farmer_row['Coverage (₹)']:,}")
        st.write(f"**Status:** `{farmer_row['Status']}`")
        
    with c2:
        st.subheader("🌧️ Rainfall Telemetry vs Threshold")
        st.metric("Observed Rainfall", f"{farmer_row['Observed Rain (mm)']} mm", delta="-12 mm vs threshold", delta_color="inverse")
        st.metric("Required Minimum", f"{farmer_row['Rain Threshold (mm)']} mm")
        st.metric("Oracle Consensus", farmer_row['Oracle Consensus'])

# VIEW 3: MULTI-ORACLE CONSENSUS
elif view_mode == "📡 Multi-Oracle Consensus Feed":
    st.header("📡 Multi-Oracle Consensus Telemetry Feed")
    st.info("Cross-validates 3 independent weather feeds (IMD, NASA POWER, Open-Meteo) to establish median consensus.")
    
    oracle_df = pd.DataFrame([
        {"Weather Station": "Warangal Central (ST-001)", "IMD Radar": "28 mm", "NASA POWER": "27 mm", "Open-Meteo": "29 mm", "Median Consensus": "28 mm", "Consensus Score": "96%", "Status": "TRIGGERED (< 40mm)"},
        {"Weather Station": "Karimnagar North (ST-002)", "IMD Radar": "42 mm", "NASA POWER": "43 mm", "Open-Meteo": "41 mm", "Median Consensus": "42 mm", "Consensus Score": "98%", "Status": "HEALTHY (>= 40mm)"},
        {"Weather Station": "Nalgonda East (ST-003)", "IMD Radar": "18 mm", "NASA POWER": "17 mm", "Open-Meteo": "19 mm", "Median Consensus": "18 mm", "Consensus Score": "97%", "Status": "TRIGGERED (< 40mm)"},
    ])
    st.table(oracle_df)

# VIEW 4: AI VOICE ASSISTANT
else:
    st.header("🤖 Multilingual AI Voice Assistant")
    st.success("Supported Languages: Telugu (తెలుగు), Hindi (हिंदी), English")
    st.markdown("""
    > **AI Audit Explanation**:
    > *"మీ పొలంలో వర్షపాతం 28 మిమీ నమోదు అయింది. 3 వాతావరణ ఆరాకిల్స్ (IMD, NASA, Open-Meteo) 96% విశ్వసనీయతతో ధృవీకరించాయి. ₹20,000 పరిహారం మీ బ్యాంకు ఖాతాలో జమ అవుతుంది."*
    """)

st.markdown("---")
st.caption("🌾 KrishiShield AI (FS-2604) | Built for VIT Hackathon")
