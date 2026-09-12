# AI LEDGER — KRISHISHIELD (FS-2604)

> **Mandatory Hackathon Compliance Record**
> **Core Architecture Principle:** *"AI explains. Rules decide."*

---

## 1. Voice Intent Classification & Speech NLP
* **Model Used:** Local BCP-47 Web Speech API + Rule-based Intent Classifier (`frontend/src/services/speech.js`)
* **Asked to do:** Parse natural language speech queries from smallholder farmers in Telugu (తెలుగు), Hindi (हिंदी), and English regarding policy status, rainfall levels, and payout status.
* **Team Changes & Scope Constraints:**
  - Added deterministic fallback mapping to ensure recognition errors do not block policy operations.
  - Implemented explicit voice disclosure pre-purchase comprehension check modal requiring explicit user confirmation (`YES` / `NO`).

---

## 2. Weather Feed Anomaly Detection
* **Model Used:** Isolation Forest / Z-Score Variance Model (`backend/app/engines/anomaly.py`)
* **Asked to do:** Detect suspicious, drifted, corrupted, or manipulated rainfall data streams from weather stations.
* **Team Changes & Scope Constraints:**
  - Configured neighbor-station variance threshold (>15 mm variance).
  - Explicitly separated anomaly score from financial decision engine: high anomaly scores (>0.85) reject corrupt oracle sources from median calculation, but **do not authorize payouts**.

---

## 3. Financial Explanation Engine
* **Model Used:** Rule-driven Structured NLG Generator
* **Asked to do:** Generate simple human-understandable speech and text explanations for payout settlements.
* **Team Changes & Scope Constraints:**
  - Restricted explanation outputs strictly to verified, empirical rule outcomes (`consensus < threshold`).
  - Prohibited hosted generative LLMs from making financial eligibility or payout choices.

---

## 4. UI & Dashboard Design
* **Model Used:** Generative component design & Tailwind UI design system
* **Asked to do:** Create 5 role-based dashboards (Farmer, Provider, Field Data, Claims, Admin).
* **Team Changes & Scope Constraints:**
  - Added explicit live demo offline network simulation toggle button in Navbar.
  - Implemented user-namespaced IndexedDB caching to preserve data privacy on shared mobile phones.
