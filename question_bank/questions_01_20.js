/* DSC6131 Principles of Data Science — Question Bank, Batch 1 (Q1–20)
   Topics: foundations, lifecycle, data types & measurement, big data, data quality, EDA & descriptive statistics.
   Schema: see README.md. answer: mcq=index, multi=[indices], tf=boolean, numeric=number (+tolerance), short=keyPoints rubric. */
window.QUESTION_BANK = (window.QUESTION_BANK || []).concat([
{
  id: 1, topic: "Foundations of Data Science", difficulty: "Foundational", category: "Conceptual", type: "mcq",
  question: "A district health team records weekly malaria counts (A). They compute that cases rose 40% in the four weeks after heavy rains (B). From several seasons they learn that rainfall reliably precedes malaria surges by about three weeks (C). They therefore decide to pre-position bed nets before each rainy season (D). In the DIKW hierarchy, which mapping is correct?",
  options: [
    "A = Information, B = Data, C = Wisdom, D = Knowledge",
    "A = Data, B = Information, C = Knowledge, D = Wisdom",
    "A = Data, B = Knowledge, C = Information, D = Wisdom",
    "A = Information, B = Knowledge, C = Data, D = Wisdom"
  ],
  answer: 1,
  modelAnswer: "A = Data, B = Information, C = Knowledge, D = Wisdom.",
  explanation: "<b>Data</b> are raw, uncontextualised recordings (weekly counts). <b>Information</b> is data processed and given context (a 40% rise after rain). <b>Knowledge</b> is a generalisable pattern or understanding built from information across contexts (rain precedes surges by ~3 weeks). <b>Wisdom</b> is the judgement to act on knowledge (pre-positioning nets). Each step adds context, synthesis and, finally, decision value; this is why data science is framed as moving organisations up the DIKW ladder rather than just collecting more data.",
  concepts: ["DIKW pyramid", "value of data"], source: "D1 p16; D2 p6"
},
{
  id: 2, topic: "Data types & measurement scales", difficulty: "Foundational", category: "Conceptual", type: "multi",
  question: "Which of the following variables are measured on a <b>ratio</b> scale? (Select all that apply.)",
  options: [
    "Monthly household income in RWF",
    "Air temperature in °C",
    "Ubudehe socio-economic category (1–4)",
    "Number of children in a household",
    "Satisfaction on a 5-point Likert item",
    "Distance to the nearest health centre (km)"
  ],
  answer: [0, 3, 5],
  modelAnswer: "Income, number of children and distance are ratio-scale variables.",
  explanation: "Stevens (1946) defines four levels. A <b>ratio</b> scale has equal intervals <i>and</i> a true zero meaning 'none', so ratios are meaningful (20 km is twice 10 km). Temperature in °C is <b>interval</b>: 0 °C is not 'no heat', so 20 °C is not 'twice as hot' as 10 °C. Ubudehe category and Likert items are <b>ordinal</b>: ordered, but the distances between levels are not known to be equal. The level of measurement determines which summaries (mode/median/mean, geometric mean, CV) and tests are valid.",
  concepts: ["levels of measurement", "ratio vs interval", "ordinal"], source: "D1 p28"
},
{
  id: 3, topic: "Data types & measurement scales", difficulty: "Intermediate", category: "Analytical", type: "mcq",
  question: "A survey records patient satisfaction on a 5-point Likert item (1 = very dissatisfied … 5 = very satisfied). Which of the following analyses is <b>least defensible</b> given the level of measurement?",
  options: [
    "Reporting the median and inter-quartile range of the item",
    "Comparing two clinics with a Mann–Whitney U (Wilcoxon rank-sum) test",
    "Stating that a patient who answered 4 is 'twice as satisfied' as one who answered 2",
    "Computing Spearman's rank correlation between satisfaction and waiting time"
  ],
  answer: 2,
  modelAnswer: "The 'twice as satisfied' statement — ratio claims require a ratio scale with a true zero.",
  explanation: "A single Likert item is <b>ordinal</b>. Median/IQR, rank-based tests (Mann–Whitney) and Spearman's ρ use only order and are appropriate. A ratio statement assumes both equal intervals and an absolute zero — neither holds. (Means of multi-item Likert <i>scales</i> are often treated as approximately interval in practice, but ratio interpretations are never justified.) Exam tip: always justify the summary/test from the measurement level, as the course outcomes require.",
  concepts: ["ordinal data", "permissible statistics", "non-parametric tests"], source: "D1 p28; D3 p15"
},
{
  id: 4, topic: "Data Science lifecycle", difficulty: "Foundational", category: "Conceptual", type: "tf",
  question: "True or false: In CRISP-DM the phases are strictly sequential — once the Data Understanding phase is complete, the project never returns to it.",
  answer: false,
  modelAnswer: "False. CRISP-DM is iterative and cyclical.",
  explanation: "CRISP-DM has six phases: Business Understanding → Data Understanding → Data Preparation → Modelling → Evaluation → Deployment. The reference model explicitly shows feedback arrows: Business ↔ Data Understanding, Data Preparation ↔ Modelling, and Evaluation back to Business Understanding. The outer circle signals that a deployed solution raises new questions. In practice, modelling often reveals data-quality problems that force a return to understanding and preparation.",
  concepts: ["CRISP-DM", "iterative process"], source: "D1 p23; D2 p25"
},
{
  id: 5, topic: "Data Science lifecycle", difficulty: "Intermediate", category: "Practical application", type: "short",
  scenario: "Rwanda Biomedical Centre (RBC) wants to reduce malaria deaths among children under five by targeting interventions at high-risk sectors. You lead the data science team.",
  question: "Map this project onto the six CRISP-DM phases. For each phase, name one concrete activity or deliverable specific to this context.",
  keyPoints: [
    "Business understanding: define objective and success criterion (e.g. reduce under-5 deaths; identify top-risk sectors weekly; measurable KPI)",
    "Data understanding: inventory and profile sources (HMIS/DHIS2 case counts, rainfall, CHW reports, population); assess quality/completeness",
    "Data preparation: clean, join by sector and week, handle missing reports, engineer features (lagged rainfall, incidence per 1,000)",
    "Modelling: choose and fit models (e.g. regression/classification of high-risk sector-weeks) with appropriate validation",
    "Evaluation: assess against the business goal (recall of true outbreaks, false-alarm burden), not only statistical fit; review with RBC",
    "Deployment: weekly pipeline/dashboard or alerts to district teams, with monitoring and retraining; ethics/privacy safeguards"
  ],
  modelAnswer: "1) <b>Business understanding</b> – translate 'reduce under-5 malaria deaths' into an analytic goal (rank sectors by next-month risk) with a success metric agreed with RBC. 2) <b>Data understanding</b> – identify and profile HMIS/DHIS2 weekly cases, rainfall, population, CHW data; check completeness and reporting delays. 3) <b>Data preparation</b> – clean, harmonise sector codes, join datasets, impute or flag missing reports, create features such as 3-week lagged rainfall and incidence rates. 4) <b>Modelling</b> – fit candidate models (e.g. Poisson regression, gradient boosting) with time-aware validation. 5) <b>Evaluation</b> – judge models on decision value (outbreak recall at acceptable false-alarm rates) and check the business objective is met. 6) <b>Deployment</b> – automate as a weekly pipeline feeding a dashboard/SMS alert, with monitoring, retraining and data-protection compliance.",
  explanation: "Examiners look for (a) all six phases in order, (b) context-specific activities rather than generic definitions, and (c) recognition that evaluation is against the <i>business</i> objective. Mentioning iteration between phases and ethical safeguards strengthens the answer.",
  concepts: ["CRISP-DM", "problem framing", "deployment"], source: "D1 p22–24; D2 p25, 62–68"
},
{
  id: 6, topic: "Data types & measurement scales", difficulty: "Foundational", category: "Conceptual", type: "mcq",
  question: "An Irembo service application is stored as a JSON document containing the applicant's details, a nested list of uploaded documents and optional fields that vary by service. How is this data best classified?",
  options: ["Structured data", "Semi-structured data", "Unstructured data", "Metadata only"],
  answer: 1,
  modelAnswer: "Semi-structured data.",
  explanation: "<b>Structured</b> data fit a fixed tabular schema (rows × typed columns, e.g. a relational table). <b>Unstructured</b> data have no predefined model (free text, images, audio). <b>Semi-structured</b> data carry self-describing tags/keys and hierarchy (JSON, XML) but the schema is flexible — fields can be nested, repeated or absent. This is why document databases (e.g. MongoDB) are popular for such records, and why analysis usually requires flattening/normalising first.",
  concepts: ["structured vs semi-structured", "JSON", "document databases"], source: "D1 p26; D2 p20"
},
{
  id: 7, topic: "Big Data & MapReduce", difficulty: "Foundational", category: "Conceptual", type: "multi",
  question: "Which statements about the 'five Vs' of big data are correct? (Select all that apply.)",
  options: [
    "Velocity refers to the speed at which data are generated and must be processed (e.g. real-time MoMo transactions).",
    "Veracity refers to the trustworthiness and quality of the data.",
    "Variety refers to the number of rows in a dataset.",
    "Value means large data are only worthwhile if they lead to useful insight or decisions.",
    "Volume alone is sufficient for data to be considered 'big data' in every definition."
  ],
  answer: [0, 1, 3],
  modelAnswer: "Velocity, Veracity and Value are correctly described.",
  explanation: "The five Vs are <b>Volume</b> (scale), <b>Velocity</b> (speed of generation/processing), <b>Variety</b> (heterogeneity of formats: tables, text, images, sensor streams — not row count), <b>Veracity</b> (uncertainty, noise, bias) and <b>Value</b> (business/social benefit). Big data is usually characterised by the <i>combination</i> of challenges that make traditional single-machine tools inadequate, not by volume alone.",
  concepts: ["5 Vs", "big data characteristics"], source: "D1 p32"
},
{
  id: 8, topic: "Big Data & MapReduce", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "A word-count MapReduce job runs on three input splits of Kinyarwanda radio transcripts:<br>Split 1: <code>amazi meza amazi</code><br>Split 2: <code>meza ubuzima</code><br>Split 3: <code>amazi ubuzima amazi</code>",
  question: "Without a combiner, how many intermediate (key, value) pairs do the mappers emit in total?",
  answer: 8, tolerance: 0, unit: "pairs",
  modelAnswer: "8 intermediate pairs.",
  explanation: "<b>Map</b>: each mapper emits (word, 1) for every token. Split 1 → 3 pairs, Split 2 → 2, Split 3 → 3; total = 3 + 2 + 3 = <b>8</b>.<br><b>Shuffle & sort</b>: pairs are grouped by key: amazi → [1,1,1,1], meza → [1,1], ubuzima → [1,1].<br><b>Reduce</b>: sum the lists → (amazi, 4), (meza, 2), (ubuzima, 2).<br>With a <b>combiner</b> (local reduce on each mapper) the emitted pairs drop to 2 + 2 + 2 = 6 — e.g. Split 1 sends (amazi, 2), (meza, 1). Combiners cut network traffic during the shuffle, which is usually the bottleneck; they are valid here because addition is associative and commutative.",
  concepts: ["MapReduce", "map/shuffle/reduce", "combiner"], source: "D1 p34–36"
},
{
  id: 9, topic: "Big Data & MapReduce", difficulty: "Advanced", category: "Critical thinking", type: "short",
  question: "Explain why classic Hadoop MapReduce is inefficient for iterative algorithms such as k-means or gradient descent, and describe how a framework such as Apache Spark addresses this limitation.",
  keyPoints: [
    "Iterative algorithms need many passes over the same data (one pass per iteration until convergence)",
    "In MapReduce each iteration is a separate job: input is re-read from disk (HDFS) and intermediate/output results are written back to disk",
    "Repeated disk I/O, job start-up overhead and the shuffle make each iteration slow",
    "Spark keeps working data in memory across iterations (RDDs/DataFrames with caching/persist)",
    "Spark builds a DAG of transformations with lazy evaluation and lineage-based fault tolerance, avoiding materialising every step"
  ],
  modelAnswer: "Iterative algorithms repeatedly scan the same dataset: k-means re-assigns every point each iteration; gradient descent recomputes the gradient over all data each epoch. In Hadoop MapReduce each iteration must be expressed as a separate map–reduce job. The data are re-read from HDFS, intermediate results are spilled and shuffled across the network, and outputs are written back to disk before the next job can start. Disk I/O and job-scheduling overhead dominate, so 50 iterations cost roughly 50 full disk round-trips. Spark caches the dataset in cluster memory (RDD/DataFrame <code>cache()</code>), so subsequent iterations read from RAM. It also optimises a DAG of lazily evaluated transformations, and recovers lost partitions from lineage rather than from replicated intermediate files. This yields order-of-magnitude speed-ups for iterative ML (hence Spark MLlib).",
  explanation: "A strong answer links the <i>algorithmic</i> property (iteration over the same data) to the <i>system</i> property (disk-based job boundaries). It then explains the specific Spark mechanisms: in-memory caching, DAG execution and lineage. MapReduce remains well suited to single-pass batch jobs such as word count or ETL.",
  concepts: ["MapReduce limitations", "Spark", "in-memory computing"], source: "D1 p34; D2 p61"
},
{
  id: 10, topic: "Data collection & data quality", difficulty: "Foundational", category: "Practical application", type: "mcq",
  question: "In a community health worker (CHW) survey export, one record has visit date <code>2026-02-30</code>. Which data-quality dimension does this violate most directly?",
  options: ["Completeness", "Validity", "Timeliness", "Uniqueness"],
  answer: 1,
  modelAnswer: "Validity — the value does not conform to the allowed format/domain (February has no 30th day).",
  explanation: "Common data-quality dimensions: <b>completeness</b> (values present), <b>validity</b> (values conform to type, format, range and business rules), <b>accuracy</b> (values match reality), <b>consistency</b> (no contradictions across fields/sources), <b>timeliness</b> (available when needed) and <b>uniqueness</b> (no duplicate entities). An impossible date fails a domain/format rule, so it is a validity problem. Validation rules should be encoded in the pipeline (e.g. parse with <code>lubridate::ymd()</code> and flag NAs) rather than fixed by hand.",
  concepts: ["data quality dimensions", "validation rules"], source: "D2 p48–50, 64"
},
{
  id: 11, topic: "Data collection & data quality", difficulty: "Advanced", category: "Analytical", type: "mcq",
  scenario: "In a household income survey, 18% of income values are missing. Field reports show that wealthier households were much more likely to refuse the income question, even after accounting for district and household size.",
  question: "What is the most plausible missingness mechanism, and what is its main consequence?",
  options: [
    "MCAR — complete-case analysis will be unbiased but less precise.",
    "MAR — multiple imputation using district and household size will fully remove bias.",
    "MNAR — missingness depends on the unobserved income itself, so complete-case means and standard imputation will tend to underestimate income; sensitivity analysis is needed.",
    "Structural missingness — the values do not exist, so they should be coded as zero."
  ],
  answer: 2,
  modelAnswer: "MNAR (missing not at random). Bias persists under listwise deletion and naive/MAR-based imputation, so use sensitivity analysis or explicit selection/pattern-mixture models.",
  explanation: "Rubin's taxonomy: <b>MCAR</b> – missingness unrelated to any data; <b>MAR</b> – missingness depends only on <i>observed</i> variables; <b>MNAR</b> – missingness depends on the <i>unobserved value itself</i>. Here refusal is driven by high income even after conditioning on observed covariates, which is MNAR. Dropping incomplete records removes disproportionately rich households, biasing the mean downward. Mean imputation also shrinks the variance. MAR-based multiple imputation cannot correct for a mechanism it does not model. Appropriate responses: auxiliary variables correlated with income (assets, consumption), sensitivity analyses (δ-adjustment), selection models, and transparent reporting.",
  concepts: ["MCAR/MAR/MNAR", "missing data bias", "imputation"], source: "D2 p51; D5 §2.4"
},
{
  id: 12, topic: "Exploratory Data Analysis", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "Weekly sales of a small Kigali shop (’000 RWF), sorted, n = 8: <code>12, 15, 15, 18, 20, 22, 25, 90</code>. Use R's default quantile method (type 7): Q₁ = 15.00, Q₃ = 22.75.",
  question: "Compute Tukey's <b>upper fence</b> for outliers (in ’000 RWF, two decimals).",
  answer: 34.375, tolerance: 0.01, unit: "’000 RWF",
  modelAnswer: "Upper fence = Q₃ + 1.5 × IQR = 22.75 + 1.5 × 7.75 = 34.375 ≈ 34.38.",
  explanation: "IQR = Q₃ − Q₁ = 22.75 − 15.00 = 7.75.<br>Upper fence = Q₃ + 1.5·IQR = 22.75 + 11.625 = <b>34.375</b>. Lower fence = 15 − 11.625 = 3.375.<br>The value 90 exceeds the upper fence, so it is a suspected outlier. Note how it distorts the mean (27.125) relative to the median (19.0). <b>Interpretation:</b> an outlier flag is a prompt to investigate (data-entry error? a genuine bulk sale?), not an automatic deletion rule. For skewed data, report median and IQR. Different quantile algorithms (types 1–9) can give slightly different fences.",
  concepts: ["IQR", "Tukey fences", "robust statistics"], source: "D3 p9, p13"
},
{
  id: 13, topic: "Descriptive statistics", difficulty: "Foundational", category: "Analytical", type: "mcq",
  question: "Household consumption in a national survey is strongly right-skewed. Which statement is most appropriate?",
  options: [
    "Mean < median; report the mean and standard deviation.",
    "Mean > median; the median and IQR are more representative summaries of a typical household.",
    "Mean = median, because large samples are always symmetric.",
    "Mean > median; the mode is always the best measure for continuous data."
  ],
  answer: 1,
  modelAnswer: "Mean > median; prefer median and IQR (or analyse on a log scale).",
  explanation: "In a right-skewed distribution a long upper tail pulls the mean above the median. The mean and SD are sensitive to extreme values (low breakdown point), whereas the median and IQR are robust. A large sample does not make the population distribution symmetric — the Central Limit Theorem concerns the sampling distribution of the mean, not the data. A log transformation often makes such data near-symmetric for modelling.",
  concepts: ["skewness", "mean vs median", "robustness"], source: "D3 p7–10"
},
{
  id: 14, topic: "Descriptive statistics", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "From RAB demonstration plots: maize yield has mean 3.2 t/ha and SD 0.8 t/ha; bean yield has mean 1.1 t/ha and SD 0.4 t/ha.",
  question: "Compute the coefficient of variation (CV) for <b>beans</b>, in percent (one decimal).",
  answer: 36.4, tolerance: 0.1, unit: "%",
  modelAnswer: "CV(beans) = 0.4 / 1.1 × 100 = 36.4%.",
  explanation: "CV = s / x̄ × 100%.<br>Beans: 0.4 / 1.1 = 0.3636 → <b>36.4%</b>. Maize: 0.8 / 3.2 = 0.25 → 25.0%.<br><b>Interpretation:</b> although maize has the larger absolute SD, beans are relatively more variable, i.e. riskier per unit of expected yield. The CV is unit-free, so it allows comparison across variables with different means or units. It is only meaningful for ratio-scale variables with a positive mean; for °C or variables that can be negative it is misleading.",
  concepts: ["coefficient of variation", "relative dispersion"], source: "D3 p8–9"
},
{
  id: 15, topic: "Exploratory Data Analysis", difficulty: "Advanced", category: "Critical thinking", type: "short",
  question: "Tukey's 'golden rule' of EDA states that you should never test a hypothesis on the same data that suggested it. Explain why this rule matters statistically and give two practical ways to respect it.",
  keyPoints: [
    "EDA explores many patterns/comparisons; selecting the most striking one and then testing it on the same data inflates the Type I error (multiple comparisons / 'garden of forking paths')",
    "p-values and confidence intervals assume the hypothesis was specified before seeing the data; post-hoc selection invalidates their nominal coverage",
    "Related risks: HARKing (hypothesising after results are known), overfitting to noise, findings that fail to replicate",
    "Remedy 1: split data into an exploration set and a held-out confirmation set (or collect new data)",
    "Remedy 2: pre-register hypotheses/analysis plans, and/or adjust for multiplicity (Bonferroni, FDR) and report exploratory findings as hypothesis-generating"
  ],
  modelAnswer: "During EDA an analyst looks at dozens of plots, subgroups and correlations. Purely by chance, some will look striking. If the most striking pattern is then 'tested' on the same data, the test is conditioned on having been selected for looking significant. The real false-positive rate is therefore far above the nominal α (e.g. 0.05), and p-values and CIs lose their meaning. This is the 'garden of forking paths' problem and leads to HARKing and non-replicable findings. Remedies: (1) split the data into an exploration set and a confirmation set, or collect new data, and confirm only on untouched data; (2) pre-register confirmatory hypotheses, correct for multiple testing (Bonferroni/Holm, Benjamini–Hochberg FDR), and label exploratory results as hypotheses rather than findings.",
  explanation: "This distinguishes exploratory (EDA) from confirmatory (CDA) analysis, a core idea in Unit 3. The same logic underlies train/test splitting in ML: evaluation data must not influence model or hypothesis choice.",
  concepts: ["EDA vs CDA", "multiple comparisons", "data splitting"], source: "D3 p3"
},
{
  id: 16, topic: "Probability & distributions", difficulty: "Foundational", category: "Calculation", type: "tf",
  question: "True or false: If test scores are approximately normally distributed with mean 60 and standard deviation 8, about 95% of scores lie between 44 and 76.",
  answer: true,
  modelAnswer: "True — 60 ± 2 × 8 = [44, 76], which covers ≈ 95% under the empirical rule.",
  explanation: "Empirical (68–95–99.7) rule for a normal distribution: ≈68% within μ ± 1σ, ≈95% within μ ± 2σ (exactly 95% within ±1.96σ), ≈99.7% within μ ± 3σ. Here μ ± 2σ = 60 ± 16 = [44, 76]. The rule applies only if the distribution is approximately normal. Check with a histogram or Q–Q plot first; for skewed data, use Chebyshev's inequality (≥ 75% within ±2σ for any distribution).",
  concepts: ["normal distribution", "empirical rule"], source: "D3 p11; D5 §3.5"
},
{
  id: 17, topic: "Exploratory Data Analysis", difficulty: "Intermediate", category: "Analytical", type: "mcq",
  question: "On a normal Q–Q plot (sample quantiles on the y-axis, theoretical normal quantiles on the x-axis), points follow the reference line in the middle but lie <b>above</b> it at the upper end and <b>below</b> it at the lower end (an S-shape). What does this indicate?",
  options: [
    "Right (positive) skew",
    "Left (negative) skew",
    "Heavier tails than the normal distribution (excess kurtosis)",
    "Lighter tails than the normal distribution"
  ],
  answer: 2,
  modelAnswer: "Heavy tails: extreme values are more extreme than a normal distribution predicts.",
  explanation: "At the upper end, sample quantiles exceed theoretical ones (above the line); at the lower end they are below them (more negative than expected). Both tails are stretched, which indicates a heavy-tailed (leptokurtic) distribution such as a t-distribution or financial returns. Right skew produces a convex curve, with points above the line at both ends. Light tails give the reverse S. Heavy tails matter because normal-theory intervals underestimate the frequency of extreme events, so consider robust or non-parametric methods.",
  concepts: ["Q–Q plot", "kurtosis", "normality checking"], source: "D3 p12"
},
{
  id: 18, topic: "Exploratory Data Analysis", difficulty: "Advanced", category: "Case study", type: "short",
  scenario: "You are profiling EICV-style survey files. The household module has 5,000 rows (one per <code>hh_id</code>, according to the documentation). The individual module has 23,000 rows. After <code>left_join(individuals, households, by = \"hh_id\")</code> you obtain 24,100 rows.",
  question: "Diagnose what has gone wrong, explain the risk for subsequent analysis, and describe how you would detect and fix the problem.",
  keyPoints: [
    "A left join of individuals to a one-row-per-household table should return exactly 23,000 rows; 1,100 extra rows imply duplicate hh_id keys in the household file (one-to-many on the right side)",
    "Consequence: individuals are duplicated, inflating counts and distorting means, totals and standard errors (and weights)",
    "Detect: count(households, hh_id) |> filter(n > 1); check key uniqueness before joining; compare row counts before/after",
    "Fix: investigate the duplicates (exact duplicates vs conflicting records, e.g. revisits); de-duplicate with a documented rule or use the correct composite key (e.g. hh_id + visit/round)",
    "Prevent: assert expected cardinality (e.g. dplyr relationship = \"many-to-one\") and document cleaning decisions"
  ],
  modelAnswer: "If <code>hh_id</code> were unique in the household file, a left join from 23,000 individuals would return exactly 23,000 rows. Getting 24,100 means some household IDs occur more than once on the right side. Each matching individual is replicated, creating 1,100 spurious rows. All downstream statistics would be wrong: population totals inflated, means weighted toward duplicated households, standard errors understated, survey weights double-counted. Detection: <code>households |> count(hh_id) |> filter(n > 1)</code>; also check <code>n_distinct(hh_id) == nrow(households)</code> before every join and compare row counts after. Fix: inspect the duplicates. They may be exact copies (keep one), conflicting re-interviews (apply a documented rule, e.g. the latest complete visit), or a sign that the true key is composite (<code>hh_id</code> + <code>cluster</code> or survey round). Prevent recurrence by asserting the relationship in code (<code>relationship = \"many-to-one\"</code>) and logging the decision in the cleaning log.",
  explanation: "The course's profiling workflow stresses checking joins in multi-module surveys: 'did the number of rows change as expected?' Cardinality reasoning (1:1, 1:m, m:m) is also a core relational-database concept (primary vs foreign keys).",
  concepts: ["data profiling", "join cardinality", "primary keys", "duplicates"], source: "D3 p4, p6; D2 p12"
},
{
  id: 19, topic: "Data preprocessing & transformation", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "Annual rainfall in the training data ranges from 300 mm (minimum) to 700 mm (maximum). A min–max scaler is fitted on these training data.",
  question: "What is the scaled value of a plot with 650 mm of rainfall?",
  answer: 0.875, tolerance: 0.001, unit: "",
  modelAnswer: "x′ = (650 − 300) / (700 − 300) = 350 / 400 = 0.875.",
  explanation: "Min–max normalisation: x′ = (x − min) / (max − min), mapping the training range to [0, 1].<br>(650 − 300) / 400 = <b>0.875</b>.<br><b>Key points:</b> (1) min and max must be learned from the <i>training</i> set only and then applied to test/new data, otherwise information leaks. (2) A new value outside the training range maps outside [0, 1]: 800 mm → (800 − 300)/400 = 1.25. (3) Min–max is sensitive to outliers; z-score standardisation, x′ = (x − x̄)/s, or robust scaling (median/IQR) may be preferable. (4) Scaling matters for distance- and gradient-based methods (kNN, k-means, SVM, neural nets, regularised regression) but not for tree-based models.",
  concepts: ["min–max scaling", "standardisation", "fit on training data"], source: "D2 p54; D4 p19"
},
{
  id: 20, topic: "Data types & measurement scales", difficulty: "Intermediate", category: "Analytical", type: "multi",
  question: "According to Wickham's tidy-data principles (each variable a column, each observation a row, each type of observational unit a table), which of the following layouts are <b>untidy</b>? (Select all that apply.)",
  options: [
    "Columns named pop_2022, pop_2023, pop_2024 holding population for each district",
    "A column district_sex with values such as \"Musanze_F\" and \"Musanze_M\"",
    "One row per household per survey year, with columns hh_id, year, consumption",
    "A single table repeating household-level variables (roof type, district) on every individual's row, alongside individual-level variables",
    "Separate columns for hh_id, age and sex, with one row per person"
  ],
  answer: [0, 1, 3],
  modelAnswer: "Options 1, 2 and 4 are untidy.",
  explanation: "(1) Values (years) are stored in column headers, so reshape longer with <code>pivot_longer()</code> into district, year, pop. (2) Two variables are stored in one column; use <code>separate()</code> into district and sex. (4) Two observational units (households and individuals) are mixed in one table, causing redundancy and update anomalies. This is the same issue that database normalisation addresses: keep separate tables linked by hh_id. Options 3 and 5 are tidy. Tidy data matter because tidyverse/ggplot2 and most modelling functions assume this structure.",
  concepts: ["tidy data", "pivoting", "observational units"], source: "D1 p29; D2 p13"
}
]);
