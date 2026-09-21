# DDCET Practice Quiz Application

**Student Practice Application / College Project**  
*A complete, responsive React.js web application for practicing the Gujarat Diploma to Degree Common Entrance Test (DDCET) Engineering Entrance Examination.*

---

## 📌 1. Project Objective

The **DDCET Practice Quiz** portal is designed to provide diploma engineering students in Gujarat with an authentic, exam-standard online testing platform. Built using **React.js** and **Vite**, the application follows the official GTU/ACPC syllabus and exam structure, utilizing previous-year question papers (2024-25 / 2025-26) with exact question distributions, real-time countdown timing, dynamic question navigation, negative marking calculations, and comprehensive performance analytics.

> **Note:** This application is developed strictly as an educational college project for student practice and is not officially affiliated with ACPC or GTU.

---

## 🏛️ 2. Official DDCET Exam Pattern & Structure

The exam consists of **100 Multiple Choice Questions (MCQs)** carrying a total of **200 Marks** with an allotted duration of **2 Hours 30 Minutes (150 Minutes / 9000 Seconds)**.

```
Total Questions: 100
Total Marks:     200 (2 Marks each)
Duration:        2 Hours 30 Minutes (9000s)
Negative Mark:   -0.5 Marks for each wrong answer
Unattempted:     0 Marks
```

### Paper & Subject Distribution

| Section / Paper | Subject | Question Range | Total Questions | Total Marks |
|---|---|---|---|---|
| **Section 01: BE-01** (Science & Engg) | **Physics** | Q.1 – Q.30 | 30 | 60 Marks |
| | **Chemistry** | Q.31 – Q.40 | 10 | 20 Marks |
| | **Computer Practice** | Q.41 – Q.45 | 5 | 10 Marks |
| | **Environmental Science** | Q.46 – Q.50 | 5 | 10 Marks |
| **Section 02: BE-02** (Aptitude Test) | **Mathematics** | Q.51 – Q.75 | 25 | 50 Marks |
| | **English / Soft Skills** | Q.76 – Q.100 | 25 | 50 Marks |
| **Total** | | **Q.1 – Q.100** | **100 MCQs** | **200 Marks** |

---

## 🚀 3. Key Application Features

1. **Dual Practice Modes**:
   - **Mode A: Full Mock Test**: Complete 100-question timed simulation with active countdown timer (02:30:00), question palette, mark for review, and auto-submission upon timer expiry.
   - **Mode B: Practice by Subject**: Target individual subjects (e.g., Physics, Mathematics, Chemistry) with instant feedback showing right and wrong options immediately.
2. **Interactive Question Navigator**:
   - Palette grid supporting direct jumps to any question.
   - Visual indicator tags:
     - 🟢 **Answered**
     - ⚪ **Unanswered**
     - 🟣 **Marked for Review**
     - 🟣✓ **Marked & Answered**
     - 🔵 **Current Question**
   - Quick subject-filter tabs in the navigator for swift traversal.
3. **Real Countdown Timer (`useEffect`)**:
   - Live formatted `HH:MM:SS` countdown timer.
   - Visual warning pulse when under 5 minutes remain.
   - Auto-submit trigger at `00:00:00` without losing answers.
4. **Answer Management**:
   - Single-click option selection.
   - **Clear Answer** button to deselect an option.
   - **Mark for Review** toggle to bookmark questions.
5. **Submission Verification Modal**:
   - Displays real-time summary of attempted, unattempted, and marked questions before final confirmation.
6. **Detailed Result & Analytics**:
   - Final Score out of 200 and overall Percentage.
   - Separate breakdown for Paper BE-01 and Paper BE-02.
   - Subject-wise progress bars and individual scores.
7. **Answer Review System**:
   - Full question review with official answer keys vs. student choices.
   - Filter review by: *All Questions*, *Correct Only*, *Incorrect Only*, or *Unattempted Only*.
   - Includes reading comprehension passages (Q.76 to Q.80) in context.
8. **Retry & Fresh Attempt**:
   - Instant state reset allowing students to reattempt tests from scratch.

---

## 🧮 4. Scoring Logic & Negative Marking

The scoring logic is encapsulated in `src/utils/quizUtils.js` via the `calculateScore` pure function:

$$\text{Final Score} = (\text{Correct Answers} \times 2) - (\text{Wrong Answers} \times 0.5)$$

- **Positive Marks**: $\text{Correct} \times 2$
- **Negative Marks**: $\text{Wrong} \times 0.5$
- **Unattempted**: $0\text{ Marks}$ (No negative penalty applied to unattempted questions)
- **Percentage**: $\frac{\text{Final Score}}{\text{Max Marks}} \times 100$

---

## ⚛️ 5. Core React Concepts (Viva Explanation Guide)

| Concept | Implementation in Code | File Reference |
|---|---|---|
| **1. Components** | Cleanly separated functional components for modularity and reusability. | `Navbar.jsx`, `QuestionCard.jsx`, `Option.jsx`, `QuestionNavigator.jsx`, `Timer.jsx`, `SubmitModal.jsx` |
| **2. Props** | Unidirectional data passing from parent containers to presentational components (e.g. question data, state, callbacks). | `src/components/QuestionCard.jsx`, `src/components/Option.jsx` |
| **3. useState** | State hooks managing screen navigation, selected answers object, bookmarks, timer ticks, and scores. | `src/App.jsx` (`currentScreen`, `selectedAnswers`, `markedQuestions`, `timeRemaining`) |
| **4. Events** | React synthetic event handlers (`onClick`, `onChange`) for buttons, options, and modal dialogs. | `handleSelectOption`, `handlePrevious`, `handleNext`, `handleClearAnswer` in `App.jsx` |
| **5. Array.map()** | Dynamic rendering of 100 questions, multiple-choice options, subject cards, and review lists. | `QuestionNavigator.jsx`, `QuestionCard.jsx`, `Home.jsx`, `Result.jsx` |
| **6. Conditional Rendering** | Seamless screen transitions without external routers, conditional badges, and passage display. | `{currentScreen === 'QUIZ' && <Quiz ... />}`, `{q.hasPassage && <PassageBox />}` |
| **7. useEffect** | Managing the 9000-second timer interval with proper cleanup (`clearInterval`) on unmount. | `useEffect` hook in `src/App.jsx` |

---

## 📁 6. Project Structure

```
ddcet-quiz/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx             # Top sticky navbar with project badge
│   │   ├── Timer.jsx              # HH:MM:SS timer with warning state
│   │   ├── Option.jsx             # Accessible option choice item
│   │   ├── QuestionCard.jsx       # Question text, passage, and options list
│   │   ├── QuestionNavigator.jsx  # Question palette with filter and color codes
│   │   ├── NavigationButtons.jsx  # Prev, Next, Clear, Review, Submit toolbar
│   │   └── SubmitModal.jsx        # Submission confirmation modal
│   ├── data/
│   │   └── questions.js           # 100 questions dataset transcribed from DDCET paper
│   ├── pages/
│   │   ├── Home.jsx               # Dashboard, exam overview, subject cards
│   │   ├── Instructions.jsx       # Examination rules and palette guide
│   │   ├── Quiz.jsx               # Main test examination interface
│   │   ├── Result.jsx             # Scorecard, paper & subject analytics
│   │   └── ReviewAnswers.jsx      # Filterable answer evaluation screen
│   ├── utils/
│   │   └── quizUtils.js           # Score calculation, time formatting helpers
│   ├── App.jsx                    # Root state management & screen router
│   ├── index.css                  # Modern responsive design system
│   └── main.jsx                   # React DOM entry point
├── index.html                     # HTML5 template with Google fonts
├── package.json                   # Project scripts and dependencies
├── vite.config.js                 # Vite development build configuration
└── README.md                      # Comprehensive project documentation
```

---

## 💻 7. How to Run Locally

### Prerequisites
- Node.js (v16.0.0 or above)
- npm (v7.0.0 or above)

### Steps
1. Open the project folder in terminal:
   ```bash
   cd "ddcet-quiz"
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start local development server:
   ```bash
   npm run dev
   ```
4. Open the browser at the printed local URL (typically `http://localhost:5173/`).
5. To test production build:
   ```bash
   npm run build
   ```
