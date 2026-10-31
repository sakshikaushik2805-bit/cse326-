# SENSUS — Faculty Feedback & Course Evaluation Portal
> *"Your Feedback. Our Progress."*

Sensus is a university-grade academic portal designed for higher education institutions (colleges and universities). It enables students to evaluate courses and faculty members through structured 5-step rubrics while providing academic administrators with real-time analytics, rating distributions, and accreditation compliance reports.

---


## 📚 Core Academic Course & Faculty Mappings

1. **Internet Programming (`CSE326`)** — *Mrs. Manjit Kaur* (Dept. of Computer Science & Engineering)
2. **Orientation to Computing (`CSE111`)** — *Dr. Manjit Kaur* (Dept. of Computer Science & Engineering)
3. **Environmental Studies (`CHE110`)** — *Dr. Pooja Sharma* (Dept. of Computer Science & Engineering)
4. **Python Programming (`INT108`)** — *Mr. Rahul Punj* (Dept. of Computer Science & Engineering)
5. **Mathematics (`MTH165`)** — *Dr. Narinder Singh* (Dept. of Computer Science & Engineering)

---

## 🚀 Key Functional Modules

### 1. Public Landing Page
- Institutional brand presentation with mission and architectural campus photography.
- Core value propositions: student confidentiality, objective metrics, accreditation alignment.
- Workflows explaining the 3-step closed-loop evaluation cycle.

### 2. Student Authentication & Registration
- Registration with program selection, semester mapping, email verification, and password checks.
- Session persistence in browser LocalStorage.

### 3. Student Dashboard & Portals
- Personalized greeting, enrolled courses status, and term completion progress bar.
- 4 Quick-access cards: Give Feedback, My Feedback, Course Information, Guidelines.
- Real-time detection of evaluated vs. pending courses with direct evaluation triggers.

### 4. 5-Step Guided Feedback Form
- **Step 1: Course Selection** — Course dropdown that dynamically retrieves assigned faculty, department, and credits.
- **Step 2: Faculty Evaluation Matrix** — 6 standardized criteria with interactive 1 to 5 star ratings:
  1. Teaching Quality
  2. Subject Knowledge
  3. Communication Skills
  4. Doubt Resolution
  5. Classroom Engagement
  6. Course Content Quality
- **Step 3: Written Qualitative Feedback** — Concrete inputs for strengths and areas for improvement with minimum character validation.
- **Step 4: Privacy & Anonymity Choice** — Option to submit anonymously with institutional FERPA privacy guarantee.
- **Step 5: Review & Submit** — Full summary with edit triggers and duplicate prevention checks.
- **Success Receipt** — Generates unique submission receipt ID and timestamp.

### 5. My Feedback View
- Personal history accessible only to the logged-in student.
- Detailed modal inspection of criterion scores, qualitative comments, and anonymity status.

### 6. Administrator Analytics Dashboard
- 7 Summary KPI cards:
  - Total Submissions
  - Overall Average Rating
  - Average Teaching Rating
  - Average Course Rating
  - Total Courses
  - Total Faculty
  - Feedback Completion Rate (%)
- Interactive Graphical Visualizations:
  - Overall Rating Distribution (1 to 5 stars breakdown)
  - Course-wise Average Ratings with university 4.0 benchmark
  - Faculty-wise Performance Bar Chart
  - Teaching Quality vs. Course Content Matrix
- Multi-dimensional Filtering (Course, Faculty, Semester, Score bracket, and live search).
- Data Table with modal detail inspector.
- **Strict Anonymity Guard:** Submissions marked anonymous strictly mask student identity as `Anonymous Student`.
- **CSV Report Export:** Generates standardized `.csv` file for accreditation committees (NAAC / NBA / ABET).

### 7. Course & Faculty Management
- Add, Edit, and Delete courses with faculty reassignment.
- Add, Edit, and Delete faculty members (with active course dependency safety checks).
- Confirmation modals before destructive operations.

---

## 🛠️ Technology Stack & Architecture

- **Frontend:** React 19, TypeScript, Tailwind CSS v4.
- **Icons:** Lucide React.
- **Storage Layer:** LocalStorage Service with automated seed data (`src/services/storage.ts`).
- **Data Sync:** Live reactive updates between student evaluations and administrator analytics.

### LocalStorage Architecture Note (For College Technical Viva)
> In this project version, browser Local Storage is utilized to deliver a zero-friction, client-authoritative demonstration without external database configuration overhead. In an enterprise university environment, this storage service is replaced with a relational SQL database (e.g., PostgreSQL / Cloud SQL) protected by TLS encryption, bcrypt password hashing, and token-based JWT session authorization.

---

## 💻 Local Development Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd clario-feedback-portal

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# App runs at: http://localhost:3000
```
