# LearnWise — AI-Powered Educational Learning & Assessment Analysis System

## Overview
**LearnWise** is a full-stack educational web application designed for higher education institutions. It connects Course Learning Objectives (CLOs) directly to the **six cognitive levels of Bloom's Revised Taxonomy**:
1. **Remember** (Recall foundational terms and principles)
2. **Understand** (Explain and categorize relational concepts)
3. **Apply** (Execute procedures and construct queries)
4. **Analyse** (Deconstruct query plans and schema trade-offs)
5. **Evaluate** (Critique architectures and optimize storage)
6. **Create** (Synthesize novel distributed storage topologies)

---

## 🎨 UI Architecture & Dashboard Layout
The user interface matches modern academic SaaS aesthetics with a responsive 3-column layout:
- **Left Column**:
  - *Performance Overview Card*: Cognitive Quotient, CLO completion ratio, mastery index.
  - *Assessment Distribution*: Real-time cohort status with progress bars.
  - *Target Learning Goals*: Evidence-based term milestones.
- **Center Column**:
  - *Active Module Focus*: CS302 syllabus coverage and active assessment trigger.
  - *Bloom's Taxonomy Cognitive Engine*: 6 interactive cognitive action tiers.
  - *AI Prompt / Command Bar*: Natural language question generator with Gemini API.
- **Right Column**:
  - *CLO & Bloom's Mastery Matrix*: Vertical tracking of all 6 Bloom levels with live progress indicators.

---

## 🚀 Quick Start Guide

### 1. Backend Setup (FastAPI & PostgreSQL / SQLite)
```bash
cd backend
python -m venv venv
# On Windows:
.\venv\Scripts\activate
pip install -r requirements.txt

# Run the test suite:
python test_phase1.py

# Launch FastAPI backend:
python -m uvicorn app.main:app --reload --port 8000
```
- API Docs: `http://localhost:8000/api/v1/docs`
- Health check: `http://localhost:8000/`

### 2. Frontend Setup (React 18 + Vite + Tailwind CSS + Recharts)
```bash
cd frontend
npm install
npm run dev
```
- Web Application: `http://localhost:5173`

---

## 🔑 Default Accounts (Seeded)
| Role | Email | Password | Status |
| :--- | :--- | :--- | :--- |
| **Super Admin** | `admin@learnwise.edu` | `Admin@LearnWise2026` | Pre-approved & Active |
| **Faculty (Approved)** | `dr.robert@learnwise.edu` | `FacultyPassword@123` | Approved by Admin |
| **Student** | `student1@learnwise.edu` | `StudentPassword@123` | Active |

---

## 📊 Analytics Visualizations (Recharts)
- **6-Axis Bloom's Taxonomy Radar Chart**: Visualizes cognitive dimensions vs. cohort benchmarks.
- **CLO Achievement Bar Chart**: Compares student achievement against threshold criteria.
- **Cohort Distribution Pie Chart**: Segments students across performance tiers.
- **Progression Line Chart**: Displays longitudinal growth across assessments.
