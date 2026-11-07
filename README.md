# DSC6131 Principles of Data Science — Model Exam

100 Master's-level model questions with model answers and explanations, delivered as a static quiz app. The bank has two sets:
- **Set A (Q1–60):** core questions that mix theory with calculations.
- **Set B (Q61–100):** calculation-free questions that test principles, choosing the right technique or model for a dataset, data cleaning, error detection, and validating data and models. Written in vanilla HTML, CSS and JS, with no build step, no backend and no network requests.

## Run locally
Open `index.html` in any modern browser. The question bank loads via `<script>` tags, so it works from `file://` too.

## Deploy to GitHub Pages
1. Push the contents of `model_exam/` to a repository. `index.html` must be at the repository root, or in `/docs`.
2. Go to **Settings → Pages → Build and deployment → Deploy from a branch**, select `main` and `/ (root)`, then save.
3. The site appears at `https://<user>.github.io/<repo>/`. All paths are relative.

## Features
- **Practice mode:** one question at a time, with *Check answer* for immediate feedback, the model answer and an explanation. Previous/next navigation, a question palette and arrow-key navigation.
- **Examination mode:** answers stay hidden until you submit. You get a final mark and percentage, breakdowns by topic area and difficulty, and a detailed review with filters (all / incorrect / flagged / needs self-marking).
- **Filters:** question set (A / B), topic area, difficulty and question type. Options for random question order, shuffled answer options and question count.
- **Flagging:** flag questions for review. *Practise incorrect & flagged* starts a targeted retry session.
- **Progress:** a progress bar, a running score in practice mode, and exam history.
- **Persistence:** `localStorage` keeps the current session (resumable) and the last exam results. The app still works if storage is blocked; nothing is saved in that case.
- **Layout:** responsive from desktop down to phone width, with light/dark themes.

## Marking
| Difficulty | Questions | Marks each | Total |
|---|---:|---:|---:|
| Foundational | 15 | 1 | 15 |
| Intermediate | 25 | 2 | 50 |
| Advanced | 20 | 3 | 60 |
| **Set A total** | **60** | | **125** |

Set B: 10 Foundational, 17 Intermediate and 13 Advanced, for **83 marks**. The full bank is worth 208 marks.

- **MCQ and true/false:** auto-marked.
- **Numerical:** auto-marked within a stated tolerance. Accepts `34.38`, `34,38` and `36.4%`.
- **Multiple-select:** partial credit of max(0, (correct − wrong ticks) ÷ number of correct options).
- **Short answer and written scenario questions:** self-marked against a 5-point examiner rubric, as a fraction of the points covered.

## Question bank
| File | Questions | Focus |
|---|---|---|
| `question_bank/questions_01_20.js` | 1–20 | Foundations, lifecycle, data types, big data, data quality, EDA/descriptive statistics |
| `question_bank/questions_21_40.js` | 21–40 | Sampling, inference, probability, χ², regression, causality, reliability, visualisation, SQL/normalisation, pipelines |
| `question_bank/questions_41_60.js` | 41–60 | ML foundations, association rules, trees, kNN, k-means, regularisation, leakage, CV, metrics, Bayes, neurons, gradient descent, ensembles, PCA, fairness, capstone case |
| `question_bank/questions_61_80.js` | 61–80 (Set B) | Duplicates and record linkage, missing data, validation rules, outliers, cleaning plans, encoding, transformations, EDA plans, test selection, regression diagnostics, measurement validity, chart choice, survey design, fabrication detection, data integration |
| `question_bank/questions_81_100.js` | 81–100 (Set B) | Problem framing, metric choice, model selection by data type, size and interpretability, technique choice per dataset, imbalance, grouped and temporal validation, drift, feature importance, cluster validation, DBSCAN, critical appraisal of claims, anonymisation, reproducibility |

The topic, difficulty, category, type and source of every question are listed in `question_bank/question_registry.md`.

**Types, Set A:** 19 multiple choice, 8 multiple select, 4 true/false, 18 numerical and 11 short answer; 30 are scenario-based.

**Types, Set B:** 21 multiple choice, 7 multiple select, 4 true/false and 8 short answer; no numerical questions; 16 are scenario-based.

### Schema
```js
{ id, topic, difficulty: "Foundational"|"Intermediate"|"Advanced", category, type: "mcq"|"multi"|"tf"|"numeric"|"short",
  scenario?,            // optional case context (HTML); makes the question "scenario-based"
  question,             // HTML
  options?,             // mcq / multi
  answer,               // mcq: index · multi: [indices] · tf: boolean · numeric: number
  tolerance?, unit?,    // numeric
  keyPoints?,           // short: rubric points for self-marking
  modelAnswer, explanation, concepts, source }  // source = course document/page (see research/)
```
To add questions, append objects to a bank file, or add a new file plus a `<script>` tag in `index.html`. Topic areas are mapped from `topic` in `app.js` (`AREA`).

## Quality assurance performed
- Validated the bank: exactly 100 questions (Set B has no numerical items), unique sequential IDs, required fields present, answer keys in range, no duplicate stems. Difficulty split is exactly 15/25/20.
- Recomputed every numerical answer in Python (NumPy/SciPy): Tukey fence, CV, CI, χ², κ, binomial, lift, information gain, kNN distances, k-means WCSS, F₁, PPV, sigmoid, gradient step, PCA variance and DiD.
- Unit-tested the grader: each correct key scores 1 and a wrong response scores 0, for all 100 questions.
- Ran end-to-end headless Chromium tests:
  - practice feedback and partial credit
  - flagging, reload and resume
  - a full 60-question exam scoring 125/125 after self-marking
  - a full 40-question Set B exam scoring 83/83
  - history saving
  - retry of incorrect questions
  - phone width (no horizontal overflow, no console errors)

## Sources
Course decks D1–D4 (Dr. T. Rizinde, UR-ACE-DS) and *Principles of Data Science* (Ault et al., OpenStax, 2025). See `research/` for the inventory, document structure, course scope, extraction plan and the specific pages consulted. All datasets in questions are illustrative.
