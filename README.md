# vit-hackathon

# 🌾 KRISHISHIELD

### Offline-First Parametric Micro-Insurance for Low-Connectivity Farmers

> **Tagline:** “When the network disappears, protection shouldn’t.”
> **Core Principle:** “AI explains. Rules decide.”

---

## 1. Quick Start Guide

### Prerequisites
- Python 3.10+
- Node.js 18+

### Step 1: Start Backend API & Seed Database
```bash
cd backend
pip install -r requirements.txt
python -m uvicorn app.main:app --reload --port 8000
```

### Step 2: Start Frontend Application
```bash
cd frontend
npm install
npm run dev
```

### Step 3: Run Test Suite
```bash
cd backend
python -m pytest tests -v
```

---

## 2. Key Architecture & Features

1. **5 Role-Based Dashboards**:
   - **Farmer**: Policy view, current rainfall, trigger status, payout display, voice assistant, offline status banner.
   - **Provider**: Total portfolio metrics, policy crop distribution chart, monthly premium trend, exposure map.
   - **Field / Data**: 3 independent rainfall oracles (A, B, C), status, median consensus, station health table.
   - **Claims**: Claims status metrics (Triggered, Eligible, Review, Paid, Rejected), interactive Reconstruction Trail modal.
   - **Admin / Risk**: System health checklist, risk warnings, declarative product builder for launch without code deployment.

2. **Deterministic Trigger & Idempotent Payout Engine**:
   - Multi-Oracle Aggregator calculates median consensus of Oracles A, B, and C.
   - Idempotency key (`policy_id:event_id`) prevents duplicate payouts.
   - SHA-256 hash-chained audit trail.

3. **Multilingual & Voice-Enabled**:
   - Full support for **Telugu (తెలుగు)**, **Hindi (हिंदी)**, and **English**.
   - Mandatory voice disclosure and explicit comprehension check modal before policy purchase.

4. **Offline-First PWA & Shared Phone Data Privacy**:
   - User-namespaced IndexedDB caching ensures zero cross-user data leakage on shared devices.
   - Background queue syncs automatically upon network restoration.

---

## 3. Disclosed Failure Conditions ("Where This Breaks")

1. **All Rainfall Oracles Fail Simultaneously**:
   - If 3/3 oracle streams are unavailable or corrupted, the system cannot establish a trustworthy consensus reading and flags status as `REVIEW`.
2. **Extreme Multi-Source Disagreement**:
   - If Oracles A and B disagree by >20 mm, automatic payouts are suspended and routed to human review to protect against corrupted sensors.
3. **Voice Recognition Failure**:
   - If SpeechRecognition fails due to heavy background noise, the system falls back to visual numbered choices rather than making assumptions.
