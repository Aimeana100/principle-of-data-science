/* DSC6131 Principles of Data Science — Question Bank, Set B / Batch 4 (Q61–80)
   Calculation-free: principles, technique choice, data cleaning, error detection, data validation, statistical reasoning. */
window.QUESTION_BANK = (window.QUESTION_BANK || []).concat([
{
  id: 61, topic: "Data collection & data quality", difficulty: "Foundational", category: "Practical application", type: "mcq",
  scenario: "A Mutuelle de Santé extract contains the records <code>UWASE Marie | 0788 123 456</code> and <code>Uwase marie  | +250788123456</code> under two different member IDs.",
  question: "What is the problem, and what is the most appropriate <b>first</b> step to address it?",
  options: [
    "It is a validity error; delete the second record because it was entered later.",
    "It is a probable duplicate entity; standardise the fields (trim spaces, normalise case, put phone numbers in one format), then apply exact and fuzzy matching on several fields and review candidate matches before merging.",
    "It is an outlier; replace one of the phone numbers with the column median.",
    "It is not a problem, because the member IDs differ, so the records must be different people."
  ],
  answer: 1,
  modelAnswer: "A likely duplicate (uniqueness problem). Standardise first, then use record linkage (exact plus fuzzy matching on name, phone and date of birth), with human review before merging.",
  explanation: "Duplicates rarely look identical. Differences in case, whitespace and formatting hide them from exact matching. <b>Standardisation</b> (trimming, lower-casing, removing punctuation, converting phones to E.164 <code>+2507…</code>) makes comparison possible. <b>Record linkage</b> then compares several fields with similarity measures (e.g. Jaro–Winkler for names) and classifies pairs as match, non-match or possible match for clerical review. Never auto-merge on a single field: two different people can share a name, and a family can share a phone. Different IDs do not prove different people, since duplicate registration is exactly how such records arise. Log every merge decision so it can be audited and reversed.",
  concepts: ["duplicates", "uniqueness", "record linkage", "standardisation"], source: "D2 p48–50, p53"
},
{
  id: 62, topic: "Data collection & data quality", difficulty: "Foundational", category: "Conceptual", type: "tf",
  question: "True or false: If a dataset is large, deleting every row that contains any missing value (listwise deletion) is always a safe way to handle missing data.",
  answer: false,
  modelAnswer: "False. Listwise deletion is unbiased only under MCAR, and it can discard a large share of the data.",
  explanation: "A large n does not protect against <b>bias</b>, only against random error. If missingness depends on observed variables (MAR) or on the missing value itself (MNAR), the complete cases are a non-random subset and estimates are biased. It is also wasteful: with 20 variables each 5% missing at random, only about 36% of rows may be complete. Before choosing a strategy, look at the missingness pattern (which variables, which groups, any co-occurrence) and ask <i>why</i> the values are missing. Options include deletion (if MCAR and few rows are lost), single imputation with a missing indicator, multiple imputation (MAR), model-based methods, or collecting the data again.",
  concepts: ["listwise deletion", "missingness mechanisms", "bias vs sample size"], source: "D2 p51"
},
{
  id: 63, topic: "Data validation & testing", difficulty: "Intermediate", category: "Practical application", type: "multi",
  question: "You are writing automated validation rules for a household survey (one table of households, one of members). Which of the following are <b>appropriate validation rules</b>? (Select all that apply.)",
  options: [
    "<code>age</code> must lie between 0 and 120 (range/domain rule)",
    "The household size recorded on the household table must equal the number of member rows with that <code>hh_id</code> (cross-table consistency rule)",
    "<code>hh_id</code> must be unique in the household table, and every member's <code>hh_id</code> must exist in it (key and referential-integrity rules)",
    "A mother listed in the household must be noticeably older than her listed children (cross-field plausibility rule)",
    "Household income must follow a normal distribution, otherwise the record is rejected"
  ],
  answer: [0, 1, 2, 3],
  modelAnswer: "The range, consistency, key/referential-integrity and plausibility rules are appropriate. A distributional assumption is not a record-level validation rule.",
  explanation: "Validation rules test whether each value or record <i>could be true</i>:<br>• <b>Type/format</b>: dates parse, numbers are numeric.<br>• <b>Domain/range</b>: age 0–120, district code in the official list.<br>• <b>Uniqueness and referential integrity</b>: primary and foreign keys.<br>• <b>Cross-field and cross-table consistency</b>: household size vs member count; a pregnant respondent must be female.<br>• <b>Plausibility</b>: age gaps between mother and child.<br>Hard rules flag impossible values; soft rules flag unlikely ones for review. Income is naturally skewed, and the shape of a distribution says nothing about whether an individual record is correct, so rejecting records for 'non-normality' would delete real, valid data. Distribution checks belong at the dataset level, as drift monitoring. Implement rules in code (e.g. R <code>validate</code>/<code>pointblank</code>, Python <code>pandera</code>/Great Expectations) so they run on every load.",
  concepts: ["validation rules", "referential integrity", "consistency checks"], source: "D2 p48, p64; D3 p4"
},
{
  id: 64, topic: "Data collection & data quality", difficulty: "Intermediate", category: "Critical thinking", type: "mcq",
  scenario: "In a dataset of 2 million mobile-money transfers, almost all values are below 50,000 RWF, but 140 transfers exceed 5,000,000 RWF.",
  question: "Which handling strategy is most defensible?",
  options: [
    "Delete all 140 values, because they are statistical outliers by Tukey's rule.",
    "Cap (winsorise) them at the 99th percentile for every analysis without further checks.",
    "Investigate them first: check for entry or unit errors and against business rules (e.g. account limits). Then decide by purpose: correct true errors, keep genuine values (they may be the very signal for fraud or business-account analysis), and use robust summaries or transformations where extreme values would dominate.",
    "Replace them with the mean of all transfers so the distribution looks normal."
  ],
  answer: 2,
  modelAnswer: "Investigate before acting, distinguish errors from genuine extremes, and choose the treatment according to the analysis goal.",
  explanation: "An outlier is a value that is <i>unusual</i>, not necessarily <i>wrong</i>. Typical causes: data-entry or unit errors (extra zeros, cents vs francs), merged records, legitimate rare events (bulk business payments), or the phenomenon of interest itself (fraud). Deleting them automatically biases results and can remove the most important cases. Treatment depends on purpose. For a typical customer profile, use the median, the IQR or a log scale. For a regression, use robust methods and check influence. For fraud detection, these are prime candidates for investigation. Mean replacement distorts the data and its variance. Document every decision in a cleaning log.",
  concepts: ["outliers", "error vs genuine extreme", "robust methods"], source: "D2 p52; D3 p9"
},
{
  id: 65, topic: "Data collection & data quality", difficulty: "Advanced", category: "Case study", type: "short",
  scenario: "A community health worker (CHW) survey collected on tablets and synced offline arrives with these problems:<br>• visit dates in several formats (<code>03/04/2026</code>, <code>2026-04-03</code>, <code>3 Apr 26</code>)<br>• sex coded as <code>M</code>, <code>F</code>, <code>1</code>, <code>2</code>, <code>male</code><br>• <code>999</code> used for unknown age<br>• village names typed freely with spelling variants<br>• some submissions duplicated after repeated syncs<br>• some weights recorded in grams instead of kilograms",
  question: "Describe a cleaning strategy for each problem, and explain how you would make the whole cleaning process reproducible and auditable.",
  keyPoints: [
    "Dates: parse with explicit formats per source/device and resolve day–month ambiguity using device locale or metadata; flag unparseable or impossible dates rather than guessing; check against collection period",
    "Categorical recoding: map all variants to one coded set using a documented lookup table (codebook); unmapped values flagged; sentinel codes such as 999 converted to proper missing (NA), never left as numbers",
    "Village names: match against an official reference list (gazetteer/admin codes) using standardisation and fuzzy matching, with manual review of uncertain matches; store the code, not free text",
    "Duplicates: detect with submission/instance IDs or a combination of key fields and timestamps; keep one according to a rule (e.g. latest complete version); unit errors detected by plausibility ranges and corrected only when the cause is clear",
    "Reproducibility: never edit raw data; keep raw → script → clean data; version-controlled scripts (R/Python), cleaning log with counts of changes, validation tests rerun after cleaning, and data dictionary; fix the data-entry form (constraints, dropdowns) to prevent recurrence"
  ],
  modelAnswer: "<b>Dates:</b> parse with explicit formats rather than letting software guess. Resolve the ambiguous <code>03/04</code> from device locale or form metadata. Flag (do not guess) values that cannot be parsed or fall outside the fieldwork period. <b>Sex:</b> recode all variants to one standard via a documented lookup table (M/1/male → Male), confirming from the questionnaire whether 1 = male. Any unmapped value is flagged. <b>999:</b> convert sentinel codes to NA before computing anything; otherwise a mean age is inflated. Record whether a value is 'unknown' or 'not asked'. <b>Villages:</b> standardise text, then match it to the official administrative list with fuzzy matching. Review low-confidence matches manually and store the official code. <b>Duplicates:</b> use the submission UUID where available, otherwise key fields plus timestamp. Keep one copy by a stated rule. <b>Units:</b> detect grams with plausibility ranges (a child cannot weigh 12,000 kg). Convert only where the error is unambiguous; otherwise set to NA and flag. <b>Reproducibility and audit:</b> keep the raw export read-only. Do all cleaning in version-controlled scripts (R tidyverse or Python), with a cleaning log that records each rule and how many records it changed. Rerun the validation rules on the cleaned output and publish a data dictionary. Finally, feed lessons back to the data-collection form (date pickers, dropdowns, range constraints), because preventing errors at entry is cheaper than cleaning them.",
  explanation: "Examiners look for problem-specific techniques, the principle 'flag rather than guess', converting sentinel values to missing, matching against reference data, and a raw → script → clean workflow with logs and tests.",
  concepts: ["data cleaning", "sentinel values", "recoding", "cleaning log", "reproducibility"], source: "D2 p49–51, p64"
},
{
  id: 66, topic: "Data preprocessing & transformation", difficulty: "Intermediate", category: "Analytical", type: "mcq",
  question: "Why is multiple imputation generally preferred to single mean imputation when data are missing at random (MAR) and you intend to make statistical inferences?",
  options: [
    "Because multiple imputation guarantees that the imputed values are the true values.",
    "Because mean imputation is computationally too expensive for large datasets.",
    "Because multiple imputation uses the relationships with other variables to predict plausible values and creates several completed datasets, so the extra uncertainty from missingness is carried into the standard errors. Mean imputation shrinks variance, weakens correlations and makes results look more precise than they are.",
    "Because multiple imputation removes the need to understand why data are missing."
  ],
  answer: 2,
  modelAnswer: "Multiple imputation preserves relationships and correctly reflects imputation uncertainty. Mean imputation distorts distributions and understates uncertainty.",
  explanation: "Mean imputation puts every missing value at the centre. This artificially reduces variance, attenuates correlations with other variables, and treats guessed values as if observed, so confidence intervals become too narrow. <b>Multiple imputation</b> (e.g. MICE) draws several plausible values from a model conditional on observed data, analyses each completed dataset, and pools the results (Rubin's rules) so that between-imputation variability enters the final SE. It is valid under MAR when the imputation model includes the analysis variables and good auxiliary predictors. It cannot fix MNAR, so you still need to reason about the mechanism. For pure prediction tasks, simpler imputation fitted within training folds is often acceptable.",
  concepts: ["multiple imputation", "mean imputation", "uncertainty"], source: "D2 p51; D5 §2.4"
},
{
  id: 67, topic: "Data validation & testing", difficulty: "Advanced", category: "Practical application", type: "multi",
  scenario: "A weekly pipeline extracts malaria case counts from DHIS2, cleans them and loads a dashboard used by district managers.",
  question: "Which practices are sound ways to <b>test and validate</b> this pipeline? (Select all that apply.)",
  options: [
    "Schema tests on every run: expected columns, types and allowed codes; fail loudly if they change",
    "Reconciliation: compare row counts and totals after each stage with the source system, and explain any differences",
    "Unit tests for each transformation function, using small hand-built input tables with known expected outputs (including edge cases such as zero cases and missing weeks)",
    "Data-quality and drift checks: completeness of facility reporting, sudden jumps versus previous weeks, and duplicate facility–week keys",
    "A manager looking at the dashboard every Monday is sufficient testing, because errors would be obvious"
  ],
  answer: [0, 1, 2, 3],
  modelAnswer: "Schema tests, reconciliation, unit tests and data-quality/drift monitoring are all needed. Informal visual checking is not a test.",
  explanation: "A pipeline can fail silently. A source changes a column name, a join drops a district, or a sync duplicates a week, and the dashboard still renders. Layered testing catches this:<br>(1) <b>Schema/contract tests</b> catch structural changes.<br>(2) <b>Reconciliation</b> verifies that nothing is lost or duplicated between stages.<br>(3) <b>Unit tests</b> verify transformation logic deterministically, like software tests.<br>(4) <b>Data-quality and drift monitors</b> catch problems in the content (late reporting, implausible spikes).<br>Add alerts, logging and lineage so failures can be traced. Visual inspection is not systematic, not reproducible, and misses plausible-looking errors, which are the most dangerous ones.",
  concepts: ["pipeline testing", "reconciliation", "unit tests", "data contracts", "monitoring"], source: "D2 p64, p69–71"
},
{
  id: 68, topic: "Data preprocessing & transformation", difficulty: "Foundational", category: "Practical application", type: "mcq",
  question: "A linear regression model must include <code>district</code> (30 unordered categories) as a predictor. How should it be encoded?",
  options: [
    "Convert districts to integers 1–30 (label encoding) and use them as one numeric predictor.",
    "Use one-hot (dummy) encoding with one reference category omitted, so each district gets its own coefficient relative to the reference.",
    "Drop the variable, because regression cannot use categorical data.",
    "Replace each district with its number of letters."
  ],
  answer: 1,
  modelAnswer: "Dummy (one-hot) encoding with a reference category.",
  explanation: "District is <b>nominal</b>: there is no order or spacing. Integer codes 1–30 force the model to assume that district 30 is '29 units' from district 1 and that effects change linearly with an arbitrary code. Dummy coding creates k − 1 indicator variables. Including all k together with an intercept would cause perfect multicollinearity (the 'dummy-variable trap'). Each coefficient is then the difference from the reference district. With many categories and few observations per category, consider grouping rare levels, regularisation, or target encoding computed within training folds. Tree-based models are less sensitive to encoding choice, but they also benefit from avoiding arbitrary orderings. Ordinal variables (e.g. education level) may justify ordered encodings.",
  concepts: ["categorical encoding", "dummy variables", "nominal vs ordinal"], source: "D2 p54; D4 p19"
},
{
  id: 69, topic: "Data preprocessing & transformation", difficulty: "Intermediate", category: "Analytical", type: "mcq",
  scenario: "You regress household food expenditure on household income. Income is strongly right-skewed, and the residual plot shows spread increasing with fitted values.",
  question: "Which transformation strategy is most appropriate, and why?",
  options: [
    "Standardise income to z-scores; this removes skewness and heteroscedasticity.",
    "Log-transform income (and possibly expenditure). Multiplicative, skewed economic variables often become closer to symmetric, the relationship more linear, and the variance more stable. Coefficients then read as relative (percentage or elasticity) effects.",
    "Square income to spread out the low values.",
    "Convert income into a binary rich/poor variable, which always improves the model."
  ],
  answer: 1,
  modelAnswer: "A log transformation suits skewed, multiplicative variables. It often linearises relationships and stabilises variance, and gives elasticity interpretations.",
  explanation: "Standardising (z-scores) only rescales: the shape of the distribution is unchanged, so skewness remains. A log transform compresses large values, which is natural for income, prices and populations. A log–log model's slope is an elasticity: a 1% change in income is associated with a β% change in expenditure. Caveats: log(0) is undefined (use log(x + c) carefully or other methods); interpretation must be translated back to the original scale; and you should re-check the residual plots after transforming. Dichotomising throws away information and reduces power. Squaring makes right skew worse.",
  concepts: ["log transformation", "skewness", "heteroscedasticity", "elasticity"], source: "D3 p10, p32; D4 p19"
},
{
  id: 70, topic: "Exploratory Data Analysis", difficulty: "Intermediate", category: "Practical application", type: "short",
  scenario: "A partner organisation sends you a dataset with 120 variables and no documentation, and asks for 'insights by next week'.",
  question: "Describe a systematic first-pass EDA and profiling plan. What would you check, in what order, and what would you document before doing any modelling?",
  keyPoints: [
    "Clarify context first: what is the unit of observation, how/when/why the data were collected, and the business question; request or build a data dictionary",
    "Structure: dimensions, variable types, keys/IDs and uniqueness, units of measurement; assign each variable its measurement level",
    "Quality: missingness patterns, invalid codes/sentinels, duplicates, impossible or implausible values, inconsistent categories",
    "Univariate then bivariate/multivariate exploration: distributions (centre, spread, shape, outliers), relationships relevant to the question, group comparisons, correlation matrices; plots chosen by variable type",
    "Document: data dictionary, quality report, cleaning decisions, hypotheses generated (not confirmed), open questions for the partner; keep a held-out portion if confirmatory analysis will follow"
  ],
  modelAnswer: "<b>1. Context:</b> before computing anything, ask what one row represents, who collected the data, how and when, and what decision the analysis should inform. Request a codebook, or start building one. <b>2. Structure:</b> rows × columns, data types, candidate keys and whether they are unique, units, and the measurement level of each variable (nominal, ordinal, interval, ratio). <b>3. Quality:</b> missingness by variable and pattern, sentinel codes (99, −1), duplicates, impossible values, inconsistent spellings of categories, and date ranges. Automated profilers (<code>skimr</code>, <code>DataExplorer</code>, ydata-profiling) speed this up but must be read critically. <b>4. Exploration:</b> univariate distributions and outliers; then relationships tied to the question, with tools chosen by variable type (scatter plots and correlation for numeric × numeric, box plots by group, cross-tabs for categorical × categorical); then multivariate views (correlation heat maps, PCA). <b>5. Documentation:</b> a data dictionary, a data-quality report, a log of cleaning decisions, a list of hypotheses generated by EDA (not findings), and questions for the partner. If confirmatory claims are expected, set aside a held-out subset before exploring.",
  explanation: "Strong answers start from context and measurement level, separate quality checks from exploration, and treat EDA output as hypotheses and documentation rather than conclusions.",
  concepts: ["EDA workflow", "data profiling", "data dictionary", "measurement level"], source: "D3 p3–6"
},
{
  id: 71, topic: "Inferential statistics", difficulty: "Foundational", category: "Practical application", type: "mcq",
  scenario: "Blood pressure is measured on the same 40 patients before and after a 3-month exercise programme.",
  question: "Which test is appropriate to assess whether blood pressure changed?",
  options: [
    "An independent two-sample (Welch) t-test comparing the 'before' and 'after' columns",
    "A paired t-test on the within-patient differences (or the Wilcoxon signed-rank test if the differences are clearly non-normal)",
    "A χ² test of independence",
    "One-way ANOVA with 40 groups"
  ],
  answer: 1,
  modelAnswer: "A paired design calls for a paired t-test, or Wilcoxon signed-rank as the non-parametric alternative.",
  explanation: "The two measurements come from the <b>same units</b>, so they are dependent. A paired analysis works on each patient's difference, which removes stable between-person variation (genetics, baseline fitness) and increases power. An independent-samples test wrongly treats the observations as unrelated, violating its independence assumption, and usually loses power. Note the design limitation: without a control group, a before–after change cannot be attributed to the programme (regression to the mean, seasonal effects, measurement learning). A randomised control group or DiD design would be needed for a causal claim.",
  concepts: ["paired vs independent samples", "test selection", "study design"], source: "D3 p15, p19; D5 §4.2"
},
{
  id: 72, topic: "Variable relationships & association", difficulty: "Intermediate", category: "Analytical", type: "multi",
  question: "Which pairings of research situation and analysis method are appropriate? (Select all that apply.)",
  options: [
    "Two categorical variables (area × internet use), all expected cell counts large → χ² test of independence (Fisher's exact test if expected counts are small)",
    "An ordinal outcome (satisfaction 1–5) compared between two independent groups → Mann–Whitney U test",
    "Two continuous variables with a monotonic but curved relationship → Spearman's rank correlation",
    "A continuous outcome compared across four independent groups → one-way ANOVA (Kruskal–Wallis if assumptions fail)",
    "A binary outcome (default yes/no) explained by several predictors → ordinary linear regression"
  ],
  answer: [0, 1, 2, 3],
  modelAnswer: "The first four are appropriate. A binary outcome with several predictors calls for logistic regression, not ordinary linear regression.",
  explanation: "Method choice follows from (i) the measurement level of the outcome and predictors, (ii) the number of groups, (iii) whether samples are independent or paired, and (iv) whether distributional assumptions are plausible. A linear probability model for a binary outcome can predict probabilities below 0 or above 1 and has heteroscedastic errors by construction. <b>Logistic regression</b> models the log-odds and keeps predictions within [0, 1]. Spearman suits monotonic relationships; Pearson assumes linearity. Fisher's exact test replaces χ² when expected counts are below about 5.",
  concepts: ["test selection", "measurement level", "logistic vs linear regression"], source: "D3 p15–22; D4 p27"
},
{
  id: 73, topic: "Statistical models & regression", difficulty: "Advanced", category: "Analytical", type: "mcq",
  question: "In a regression of rent on floor area, the residual-versus-fitted plot shows a funnel: residuals spread out as fitted values increase. What does this indicate, and what are its consequences?",
  options: [
    "Multicollinearity; the coefficients are biased and the model must be discarded.",
    "Heteroscedasticity (non-constant error variance). OLS coefficients remain unbiased, but the usual standard errors, confidence intervals and p-values are unreliable. Use robust (heteroscedasticity-consistent) SEs, transform the outcome (e.g. log rent) or use weighted least squares.",
    "Non-normality of the predictor; standardise floor area.",
    "Perfect model fit; the funnel shows that larger homes are predicted more accurately."
  ],
  answer: 1,
  modelAnswer: "Heteroscedasticity: coefficients are unbiased but standard errors are wrong. Use robust SEs, a log transform or WLS.",
  explanation: "OLS assumes the errors have constant variance (homoscedasticity). A funnel shape violates this. The estimates are still unbiased if the mean model is correct, but they are no longer efficient, and the classical SE formula is wrong, so tests can be over- or under-confident. Remedies: heteroscedasticity-consistent (sandwich) SEs; modelling log(rent), which often stabilises variance for prices; weighted least squares; or a model whose variance grows with the mean (GLMs). Other residual-plot patterns to know: curvature means non-linearity (add terms or splines); clusters mean an omitted grouping variable; isolated extreme points call for influence diagnostics.",
  concepts: ["residual diagnostics", "heteroscedasticity", "robust standard errors"], source: "D3 p32; D5 §4.3"
},
{
  id: 74, topic: "Statistical models & regression", difficulty: "Intermediate", category: "Conceptual", type: "tf",
  question: "True or false: Severe multicollinearity among predictors biases the OLS coefficient estimates.",
  answer: false,
  modelAnswer: "False. Coefficients remain unbiased, but their variances (standard errors) inflate, making individual estimates unstable and hard to interpret.",
  explanation: "When predictors are highly correlated (e.g. years of schooling and highest qualification), the data contain little independent information about each one's separate effect. OLS stays unbiased under the usual assumptions, but the standard errors become large, signs can flip between samples, and individually non-significant coefficients can coexist with a highly significant overall F-test. <b>Prediction</b> is often unaffected, as long as new data share the same correlation structure. Diagnose with correlation matrices and variance inflation factors (VIF). Remedies: drop or combine redundant variables, use domain-driven composites, PCA, or ridge regression. Perfect collinearity, unlike severe collinearity, makes the model unestimable (e.g. the dummy-variable trap).",
  concepts: ["multicollinearity", "VIF", "unbiasedness vs variance"], source: "D3 p17; D4 p18"
},
{
  id: 75, topic: "Research methodology & measurement", difficulty: "Advanced", category: "Critical thinking", type: "short",
  scenario: "A team builds a 12-item 'digital financial literacy' index from survey questions and plans to use it to target training programmes.",
  question: "Explain how you would assess whether this index is reliable and valid. Distinguish the main types of validity and say what evidence would support each.",
  keyPoints: [
    "Reliability (consistency): internal consistency of the items (e.g. Cronbach's alpha / item–total correlations), test–retest stability over a short interval, inter-rater agreement if enumerator-coded",
    "Content validity: items cover the full domain (expert/stakeholder review, mapping items to a framework, pilot/cognitive interviews)",
    "Construct validity: convergent (correlates with related measures, e.g. actual MoMo usage) and discriminant (weakly related to distinct constructs, e.g. general happiness); factor structure consistent with theory",
    "Criterion validity: concurrent/predictive — predicts relevant outcomes such as correct completion of a digital transaction task or later adoption",
    "Reliability is necessary but not sufficient for validity; also check fairness/measurement invariance across groups (language, sex, region) before using it for targeting"
  ],
  modelAnswer: "<b>Reliability</b> asks whether the index measures something consistently. Evidence: internal consistency (Cronbach's α or ω, item–total correlations to drop weak items), test–retest stability for respondents re-interviewed after a short interval, and inter-rater agreement where enumerators score responses. <b>Validity</b> asks whether it measures digital financial literacy specifically. <i>Content validity</i>: experts and users confirm that the items cover the domain (account use, security, fees, digital credit), supported by pilot and cognitive interviews. <i>Construct validity</i>: the factor structure matches theory; the index correlates with related constructs such as frequency of MoMo use and education (<i>convergent</i>) and only weakly with unrelated ones (<i>discriminant</i>). <i>Criterion validity</i>: it relates to an external benchmark now (performance on a practical task: concurrent) or later (adoption of digital savings: predictive). A highly reliable index can still be invalid, consistently measuring the wrong thing. Because it will drive targeting, also check <b>measurement invariance</b> (items work the same across languages, sexes and regions), so that the index does not systematically disadvantage some groups.",
  explanation: "This tests the conceptual distinction between reliability and validity, and the types of validity evidence, without requiring any computation.",
  concepts: ["reliability", "content/construct/criterion validity", "measurement invariance"], source: "D3 p24–26"
},
{
  id: 76, topic: "Data visualisation", difficulty: "Intermediate", category: "Practical application", type: "mcq",
  question: "You want to show the relationship between transaction amount and account age for 1.5 million mobile-money transactions. A standard scatter plot is an unreadable black blob. Which approach is best?",
  options: [
    "A 3-D pie chart of amounts by account age",
    "Address over-plotting: use a 2-D density or hexagonal-binning plot (or transparency on a random sample), with a log scale for the skewed amounts",
    "A bar chart showing each transaction as a separate bar",
    "Remove the axes so the pattern is easier to see"
  ],
  answer: 1,
  modelAnswer: "Hexbin or 2-D density plots, transparency, or sampling, combined with a log scale for skewed amounts.",
  explanation: "With big data, too many marks overlap, so density differences become invisible. This is <b>over-plotting</b>. Solutions: aggregate (hexagonal or rectangular binning, 2-D kernel density, contour plots); reduce ink per point (alpha transparency, small points); sample randomly (preserving the overall pattern); facet by a grouping variable. Because money amounts are right-skewed, a log axis spreads out the dense low range. Datashader-style rendering scales to billions of points. The principle is to choose an encoding that keeps the data distribution visible.",
  concepts: ["over-plotting", "big-data visualisation", "binning", "log scales"], source: "D3 p46"
},
{
  id: 77, topic: "Data visualisation", difficulty: "Foundational", category: "Practical application", type: "mcq",
  question: "A district health officer wants to see how monthly malaria cases evolved over the past five years, including seasonal peaks. Which chart is most appropriate?",
  options: [
    "A pie chart with one slice per month",
    "A stacked area chart of all 60 months' percentage shares",
    "A word cloud of month names",
    "A line chart with time on the x-axis (optionally with a seasonal subseries plot or one line per year to compare seasons)"
  ],
  answer: 3,
  modelAnswer: "A line chart over time; optionally overlay years or add seasonal subseries to compare seasonal patterns.",
  explanation: "Time is continuous and ordered, so connecting points with a line shows trend, seasonality and anomalies. This is the position encoding along a common scale, which people read most accurately. Pie charts show parts of a whole at one point in time and cannot show change. A seasonal plot (one line per year, January–December) makes recurring rainy-season peaks easy to compare. Label the axes and units, mark interventions (e.g. bed-net campaigns) with annotations, and consider rates per 1,000 population if the population changed.",
  concepts: ["chart choice", "time-series visualisation", "seasonality"], source: "D3 p37, p41"
},
{
  id: 78, topic: "Sampling & sampling bias", difficulty: "Intermediate", category: "Practical application", type: "mcq",
  question: "You must run a national household survey, but there is no complete list of households. There is, however, a list of census enumeration areas (EAs) with population counts. Which design is most appropriate?",
  options: [
    "Simple random sampling of households from the national population",
    "Convenience sampling of households near main roads",
    "Two-stage cluster sampling: select EAs (often with probability proportional to size), list households in the selected EAs, then sample households within them. Then analyse with design weights and cluster-robust variance.",
    "Snowball sampling starting from village leaders"
  ],
  answer: 2,
  modelAnswer: "Two-stage (multi-stage) cluster sampling with PPS selection of EAs, followed by household listing and selection, analysed with design weights.",
  explanation: "Simple random sampling requires a frame listing every household, which does not exist, and would scatter interviews expensively. Multi-stage cluster sampling needs a complete frame only at the first stage (EAs). Households are listed only in the selected clusters. This is how DHS and EICV-type surveys work, usually with stratification (e.g. by district and urban/rural) as well. The cost of this efficiency is that households within an EA resemble each other (intra-cluster correlation), so variance is higher than under SRS (design effect > 1). Analyses must use the survey weights and clustered SEs. Convenience and snowball samples are not probability samples, so results cannot be generalised with known error.",
  concepts: ["multi-stage cluster sampling", "sampling frame", "PPS", "design effect"], source: "D5 §2.1–2.2; D3 p4"
},
{
  id: 79, topic: "Data validation & testing", difficulty: "Advanced", category: "Critical thinking", type: "multi",
  question: "A survey firm suspects that some enumerators fabricated interviews (curb-stoning). Which signals in the data and paradata would help detect this? (Select all that apply.)",
  options: [
    "Interview durations far shorter than the questionnaire realistically requires",
    "GPS coordinates of many 'different' households falling at the same spot, or far from the assigned enumeration area",
    "Unusually low variability across an enumerator's interviews, or the same answer patterns repeating (including over-use of 'skip' options that shorten the interview)",
    "Odd distributions of reported values, such as strong digit preference (ages ending in 0 or 5) or a lack of expected relationships (e.g. household size unrelated to food spending)",
    "Interviews conducted in Kinyarwanda rather than English"
  ],
  answer: [0, 1, 2, 3],
  modelAnswer: "Duration, GPS, low variance or repeated patterns, and anomalous distributions or missing expected correlations are valid fabrication indicators. Interview language is not.",
  explanation: "Data validation is not only about whether a value is valid. It is also about whether the data were <i>genuinely generated</i>. Paradata (timestamps, durations, GPS, device logs) and statistical fingerprints reveal fabrication: people inventing data tend to produce answers that are too regular, take shortcuts through skip patterns, and fail to reproduce the natural correlations of real data. Comparing each enumerator's distributions with their peers is a standard check. Such signals justify <b>investigation</b> (back-checks or re-interviews of a sample), not automatic sanctions, because there can be innocent explanations. Prevention: back-check protocols, real-time monitoring dashboards, and audio audits where ethical and consented.",
  concepts: ["data fabrication", "paradata", "back-checks", "enumerator effects"], source: "D3 p24–26; D2 p48"
},
{
  id: 80, topic: "Data collection & data quality", difficulty: "Advanced", category: "Case study", type: "short",
  scenario: "You need malaria incidence per 1,000 people by sector for 2016–2025. The numerators come from HMIS facility reports; the denominators from census-based population projections.",
  question: "Identify the main data-integration problems you expect when combining these sources, and explain how you would validate the merged dataset before computing and publishing incidence rates.",
  keyPoints: [
    "Geography: administrative boundary changes over time and differing codes/names between systems; need a crosswalk / harmonised master list of admin units",
    "Mapping facilities to sectors: facility catchments cross sector borders and patients travel to other facilities, so facility-based counts ≠ resident cases (numerator–denominator mismatch)",
    "Temporal alignment and denominator quality: reporting periods (weeks vs months, epi weeks), late/incomplete reporting, population projections between censuses",
    "Validate the join: unmatched units on either side, row counts before/after, totals reconcile with national figures, no duplicated sector-years",
    "Plausibility checks: reporting completeness by facility, implausible rates or sudden jumps flagged and investigated, sensitivity to denominator assumptions; document limitations when publishing"
  ],
  modelAnswer: "<b>Expected problems.</b> (1) <i>Keys and geography:</i> sector names and codes differ between HMIS and census files (spelling, re-coding), and boundaries or administrative units changed over the period. A harmonised crosswalk to a single master list is needed. (2) <i>Numerator–denominator mismatch:</i> HMIS counts cases where they were diagnosed, not where patients live. Facilities near borders, referral hospitals and private clinics distort sector numerators. (3) <i>Time:</i> different reporting periods (epidemiological weeks vs months), late or missing reports, and population projections that must be interpolated or updated after a new census. (4) <i>Completeness:</i> facilities that did not report in some months make incidence appear to drop. <b>Validation.</b> Before computing, report units that fail to match on either side and resolve them. Check row counts and uniqueness of sector–period keys after the join. Reconcile summed totals with official national figures. Compute reporting-completeness rates and flag sector-periods below a threshold. Screen for implausible rates (e.g. incidence above biologically plausible levels, or a jump after a boundary change). Run sensitivity analyses with alternative denominators. Publish the method, crosswalk and limitations alongside the rates.",
  explanation: "This tests integration thinking: keys, units of analysis, temporal alignment, completeness and reconciliation, which are among the most common sources of silent error in applied data science.",
  concepts: ["data integration", "crosswalks", "numerator–denominator", "reconciliation", "reporting completeness"], source: "D2 p53, p62–66"
}
]);
