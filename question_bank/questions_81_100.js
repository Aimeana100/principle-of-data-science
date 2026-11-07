/* DSC6131 Principles of Data Science — Question Bank, Set B / Batch 5 (Q81–100)
   Calculation-free: model/technique selection, validation design, evaluation theory, unsupervised validation, drift, interpretability, privacy, reproducibility. */
window.QUESTION_BANK = (window.QUESTION_BANK || []).concat([
{
  id: 81, topic: "Model selection & technique choice", difficulty: "Foundational", category: "Practical application", type: "mcq",
  scenario: "A SACCO has 4,000 past members with demographic, savings and loan history, and a column showing whether each member left within a year (yes/no). It wants to identify members likely to leave.",
  question: "How should the problem be framed, and what is a sensible first model?",
  options: [
    "Supervised binary classification; start with an interpretable baseline such as logistic regression (then compare tree ensembles), evaluated on held-out data.",
    "Unsupervised clustering; use k-means to discover who will leave.",
    "Supervised regression; predict the member's savings balance with linear regression.",
    "Association-rule mining on the member table."
  ],
  answer: 0,
  modelAnswer: "A labelled yes/no outcome means supervised binary classification. Start with logistic regression as an interpretable baseline.",
  explanation: "Framing starts with the target. A known, categorical outcome means <b>supervised classification</b>. Clustering could describe member segments, but it does not learn the leaving outcome. Logistic regression is a good first model: fast, interpretable (odds ratios), and it gives probabilities that can be ranked. Compare it with random forests or gradient boosting, and adopt the complex model only if it improves held-out performance enough to justify the lost transparency. Use only features known <i>before</i> the member leaves, and check class balance to choose an appropriate metric.",
  concepts: ["problem framing", "classification", "baseline model"], source: "D4 p7–9, p27"
},
{
  id: 82, topic: "Model evaluation & validation", difficulty: "Foundational", category: "Conceptual", type: "mcq",
  question: "You are forecasting maize yield (t/ha) for districts. Which statement about evaluation metrics is correct?",
  options: [
    "Accuracy is the best metric because it is easy to explain.",
    "MAE and RMSE are both appropriate. RMSE penalises large errors more heavily, while MAE is more robust to occasional extreme errors and is read directly as the average error size.",
    "R² on the training data is sufficient to evaluate forecasting performance.",
    "The F₁ score is the standard metric for continuous targets."
  ],
  answer: 1,
  modelAnswer: "Use regression error metrics (MAE, RMSE, possibly MAPE) on held-out data. RMSE weights large errors more heavily than MAE.",
  explanation: "Accuracy, precision, recall and F₁ apply to categorical predictions. For continuous targets, use error measures in the outcome's units: <b>MAE</b> (average absolute error) and <b>RMSE</b> (squaring errors before averaging, so large misses dominate). Choose by the cost structure: if a large forecasting miss is disproportionately harmful (food-security planning), RMSE reflects that. Training R² measures fit, not predictive ability, and always increases with complexity. Report errors on held-out or future periods and compare against a naive baseline (e.g. last year's yield).",
  concepts: ["regression metrics", "MAE vs RMSE", "held-out evaluation"], source: "D4 p12, p25"
},
{
  id: 83, topic: "Model selection & technique choice", difficulty: "Intermediate", category: "Critical thinking", type: "mcq",
  scenario: "A microfinance regulator requires that every rejected loan application comes with clear reasons. The lender has about 800 labelled historical applications with 12 tabular features.",
  question: "Which modelling choice is most appropriate?",
  options: [
    "A deep neural network with many hidden layers, because deep learning is always most accurate.",
    "An intrinsically interpretable model, such as regularised logistic regression or a shallow decision tree, validated with cross-validation and adopted unless a more complex model shows a substantial, demonstrated gain.",
    "k-means clustering, because there are only 12 features.",
    "Any model, because explanations can be written by staff after the decision."
  ],
  answer: 1,
  modelAnswer: "Use an interpretable model (logistic regression or a shallow tree): the data are small and tabular, and explanations are a hard requirement.",
  explanation: "Model choice balances <b>data size and type</b>, <b>performance</b>, <b>interpretability requirements</b> and <b>operational constraints</b>. Deep networks shine on large unstructured data (images, text, audio). On 800 tabular rows they tend to overfit and rarely beat simpler models. A legal or ethical need for explanations favours models whose logic can be stated directly: coefficients or a few rules. Post-hoc explanation tools (SHAP, LIME) help with black boxes, but they approximate the model's behaviour rather than describe it exactly. Explanations invented after the fact are neither faithful nor accountable.",
  concepts: ["model selection", "interpretability", "small data", "tabular vs unstructured data"], source: "D4 p56, p58"
},
{
  id: 84, topic: "Model selection & technique choice", difficulty: "Intermediate", category: "Analytical", type: "multi",
  scenario: "You classify 3,000 citizen complaints into 8 categories using word-count features. There are about 25,000 distinct words, so there are far more features than documents (p ≫ n).",
  question: "Which approaches are appropriate in this setting? (Select all that apply.)",
  options: [
    "Regularised (e.g. L1/L2-penalised) logistic regression",
    "Linear support vector machine",
    "Multinomial naive Bayes as a fast baseline",
    "Dimensionality reduction or feature selection (e.g. removing rare words, TF-IDF weighting, embeddings) before modelling",
    "Unregularised ordinary least squares with all 25,000 word counts as predictors"
  ],
  answer: [0, 1, 2, 3],
  modelAnswer: "Regularised linear models, linear SVMs, naive Bayes and dimensionality reduction all suit high-dimensional sparse text. Unregularised OLS does not.",
  explanation: "When p ≫ n, an unregularised model can fit the training data perfectly and generalise poorly. OLS is not even uniquely defined, and it is not a classifier. Methods that control complexity work well with sparse text: <b>penalised logistic regression</b> (L1 also selects words), <b>linear SVMs</b> (margin maximisation is effective in high dimensions), and <b>naive Bayes</b> (simple and robust, despite its independence assumption). Feature engineering (stop-word removal, TF-IDF, n-grams) or learned embeddings reduces noise. Validate with stratified CV, because the categories are probably imbalanced.",
  concepts: ["high-dimensional data", "regularisation", "text classification", "naive Bayes", "SVM"], source: "D4 p18, p33–34; D5 §7.5"
},
{
  id: 85, topic: "Model selection & technique choice", difficulty: "Advanced", category: "Case study", type: "short",
  question: "For each dataset and goal below, name the most appropriate family of techniques, justify the choice from the data's characteristics, and state one key pitfall or validation requirement.<br>(a) 50,000 supermarket receipts; the manager wants products often bought together.<br>(b) Monthly electricity demand per district for 8 years; the goal is to forecast the next 6 months.<br>(c) 30 districts described by 15 socio-economic indicators; the goal is to group similar districts for policy.<br>(d) 2 million MoMo transactions, of which only 0.1% are confirmed fraud; the goal is to flag new fraud.",
  keyPoints: [
    "(a) Association-rule mining (Apriori/FP-growth) on transactional baskets — unlabelled co-occurrence; pitfall: judge rules by support and lift (not confidence alone) and remember co-occurrence ≠ causation",
    "(b) Time-series forecasting (seasonal models such as ETS/ARIMA, or ML with lag features) — temporal dependence and seasonality; validate with time-ordered/rolling-origin splits versus a seasonal-naive baseline, never random splits",
    "(c) Unsupervised clustering (hierarchical or k-means), usually after standardising and possibly PCA — no labels, small n; pitfall: scaling and choice of k, check stability and interpretability",
    "(d) Supervised classification with imbalance handling (class weights/resampling in training only, threshold tuning) and/or anomaly detection for novel fraud — evaluate with precision–recall/PR-AUC and cost, not accuracy; time-based validation",
    "General: technique follows from whether labels exist, the data structure (transactions, time-ordered, cross-sectional), sample size and the decision to be supported"
  ],
  modelAnswer: "(a) <b>Association rules</b> (Apriori / FP-growth). The data are unlabelled transaction baskets and the goal is co-occurrence. Keep rules with adequate support and lift > 1 (confidence alone is misleading for popular items), and test promotions before assuming that bundling causes sales. (b) <b>Time-series forecasting</b>. Observations are ordered and autocorrelated, with seasonality and trend: use ETS/ARIMA, or gradient boosting with lag and calendar features. Evaluate with rolling-origin (walk-forward) validation against a seasonal-naive baseline. Random splits leak the future. (c) <b>Clustering</b> (hierarchical clustering suits n = 30 and gives a dendrogram; k-means is an alternative), after standardising the indicators and perhaps PCA to reduce redundancy. Pitfalls: scale dominance, arbitrary k, and unstable clusters. Validate with silhouette scores, stability across methods and seeds, and whether policymakers find the clusters meaningful. (d) <b>Imbalanced supervised classification</b> (gradient boosting or logistic regression with class weights), possibly combined with <b>anomaly detection</b> for new fraud types. Apply resampling only to training folds, tune the threshold for the investigation capacity, report precision–recall and expected cost, and validate on later time periods because fraud tactics drift.",
  explanation: "The core principle: let label availability, data structure (baskets, time series, cross-sectional), size and the decision context determine the technique, then pick the matching validation design.",
  concepts: ["technique selection", "association rules", "forecasting", "clustering", "imbalanced classification"], source: "D2 p26, p44; D4 p58"
},
{
  id: 86, topic: "Model evaluation & validation", difficulty: "Intermediate", category: "Analytical", type: "mcq",
  question: "A fraud dataset is highly imbalanced. Which of the following practices is <b>NOT</b> appropriate?",
  options: [
    "Using class weights so that misclassifying the rare class costs more during training",
    "Choosing the decision threshold from the precision–recall trade-off and the investigation capacity",
    "Reporting precision, recall and PR-AUC rather than accuracy alone",
    "Oversampling the fraud cases in the whole dataset (including the test set) so that the test set is also balanced"
  ],
  answer: 3,
  modelAnswer: "Never resample the test set. Evaluation data must reflect the real class distribution the model will face.",
  explanation: "Resampling (random oversampling, SMOTE, undersampling) is a <i>training</i> technique to help the learner see enough rare cases. Applying it to the test set misrepresents the deployment environment: precision in particular depends on prevalence, and would look far better than it will be in production. Oversampling before splitting can also copy (or synthesise from) the same fraud case into both training and test sets, which is leakage. Correct practice: split first, resample only inside training folds (e.g. inside a pipeline), evaluate on untouched data with the natural class ratio, and choose metrics and thresholds that match the costs.",
  concepts: ["class imbalance", "resampling", "evaluation integrity"], source: "D4 p32"
},
{
  id: 87, topic: "Model evaluation & validation", difficulty: "Foundational", category: "Conceptual", type: "tf",
  question: "True or false: Feature scaling, imputation and oversampling should be fitted on the full dataset before splitting it into training and test sets, because using more data gives better estimates.",
  answer: false,
  modelAnswer: "False. Every data-dependent preprocessing step must be learned from training data only, then applied to validation and test data.",
  explanation: "Any step that learns from the data (means and SDs for scaling, medians for imputation, synthetic samples for oversampling, selected features) leaks information about the test set into training if it is fitted before the split. The resulting performance estimate is optimistic. The rule: <b>split first</b>, then fit preprocessing inside the training data (inside each CV fold during tuning). Bundling preprocessing and the model into a single pipeline (scikit-learn <code>Pipeline</code>, R <code>recipes</code>/<code>tidymodels</code>) enforces this automatically.",
  concepts: ["data leakage", "preprocessing pipelines", "train/test discipline"], source: "D4 p19–20, p55"
},
{
  id: 88, topic: "Model evaluation & validation", difficulty: "Advanced", category: "Case study", type: "mcq",
  scenario: "A readmission-risk model is trained on records from 20 hospitals. Each patient may have several admissions. The model will be deployed in hospitals that are <b>not</b> in the training data.",
  question: "Which validation design gives the most honest estimate of deployment performance?",
  options: [
    "A random 80/20 split of admissions",
    "Leave-one-out cross-validation at the admission level",
    "Grouped cross-validation that holds out whole hospitals (e.g. leave-one-hospital-out), with each patient's admissions kept together in one fold",
    "Evaluating on the training data, because it covers all 20 hospitals"
  ],
  answer: 2,
  modelAnswer: "Group-level validation by hospital (and by patient) mirrors deployment to unseen hospitals.",
  explanation: "Validation should <b>mimic how the model will be used</b>. A random admission-level split puts the same patient, and the same hospital's coding practices and case mix, into both training and test sets. The model partly memorises patients and site-specific patterns, which inflates performance. Holding out entire hospitals tests <b>transportability</b> to new sites. The spread of scores across held-out hospitals shows how variable performance will be, and may reveal sites where recalibration is needed. The same logic applies to households in surveys, students in schools, and future periods in time series.",
  concepts: ["grouped cross-validation", "transportability", "validation design"], source: "D4 p16–17, p20"
},
{
  id: 89, topic: "Model evaluation & validation", difficulty: "Intermediate", category: "Analytical", type: "mcq",
  scenario: "A MoMo churn model performed well at launch. Eighteen months later its precision has fallen sharply. Since launch, transfer fees were changed and a competitor launched a new wallet.",
  question: "What is the most likely explanation and response?",
  options: [
    "The model has 'worn out' with use; retrain it with exactly the same historical data.",
    "Data or concept drift: the input distribution and the relationship between features and churn have changed. Monitor input and outcome drift, re-validate on recent data, retrain or recalibrate with recent data, and set up regular monitoring.",
    "The original evaluation was wrong; models never degrade if they were validated correctly.",
    "Increase the decision threshold until precision returns to its launch value, and change nothing else."
  ],
  answer: 1,
  modelAnswer: "Drift. Detect it through monitoring, re-validate on recent data, retrain or recalibrate, and establish ongoing monitoring and retraining triggers.",
  explanation: "Models assume that the future resembles the training data. <b>Data (covariate) drift</b> changes the distribution of the inputs (e.g. transaction patterns after a fee change). <b>Concept drift</b> changes the relationship between inputs and outcome (the same behaviour now predicts churn differently because of the competitor). Even a perfectly validated model degrades. Responses: monitor feature distributions and performance once labels arrive; compare against recent baselines; retrain on a recent window (possibly weighting recent data); recalibrate the probabilities; review whether the features still make sense. Simply moving the threshold may restore precision at the cost of recall, and does not address the cause.",
  concepts: ["data drift", "concept drift", "model monitoring", "retraining"], source: "D2 p71; D4 p55–57"
},
{
  id: 90, topic: "Model evaluation & validation", difficulty: "Intermediate", category: "Critical thinking", type: "short",
  question: "A random forest predicting student dropout ranks 'student ID number' and 'distance to school' among its most important features. Explain how variable-importance measures work, why this ranking may be misleading, and which more reliable approaches you would use to explain the model globally and for individual students.",
  keyPoints: [
    "Impurity-based (Gini/mean decrease) importance is computed on training data and is biased toward high-cardinality/continuous variables — an ID can look important by memorising noise",
    "Permutation importance on held-out data (drop in performance when a feature is shuffled) is more reliable, but is affected by correlated features (importance shared or masked)",
    "Importance ≠ causation or direction: it shows reliance of the model, not effect on the outcome; an ID number appearing important signals leakage or overfitting (e.g. IDs assigned by enrolment cohort) and should be removed/investigated",
    "Global explanation: permutation importance, partial dependence / accumulated local effects plots to show the direction and shape of effects",
    "Local explanation: SHAP or LIME values for an individual prediction; validate explanations with domain experts and check stability"
  ],
  modelAnswer: "A random forest's default (impurity-based) importance sums how much each feature reduces node impurity across trees. It is computed on <i>training</i> data and is biased toward variables with many distinct values, such as continuous variables or IDs, because they offer many possible split points that can fit noise. An important-looking student ID is a red flag: either overfitting, or leakage if IDs encode the enrolment year or programme. Investigate it and remove it. More reliable: <b>permutation importance</b> on held-out data, measuring how much performance drops when a feature's values are shuffled. Even this splits credit between correlated features (distance to school and transport cost) and can understate both. Importance shows how much the <i>model relies</i> on a feature, not its causal effect or direction. For direction and shape, use <b>partial dependence</b> or ALE plots. For a <b>single student</b>, use SHAP or LIME to show which features pushed that prediction up or down. Review the explanations with teachers or experts, and check that they are stable across retraining.",
  explanation: "This tests understanding of what explanation tools actually measure and how they can mislead, an expectation in the Unit 4 interpretability topic.",
  concepts: ["variable importance", "permutation importance", "SHAP/LIME", "partial dependence", "leakage"], source: "D4 p39, p56"
},
{
  id: 91, topic: "Clustering & dimensionality reduction", difficulty: "Advanced", category: "Analytical", type: "mcq",
  question: "You clustered 5,000 farmers into four segments with k-means. There are no ground-truth labels. Which is the most appropriate way to validate the result?",
  options: [
    "Compute classification accuracy against the cluster labels themselves.",
    "Choose the k that minimises the within-cluster sum of squares, which is always largest k = n.",
    "Combine internal measures (e.g. silhouette, within/between separation), stability checks (re-run with different seeds, bootstrap samples and alternative algorithms, and see whether the segments persist), and external or domain validation (do the segments differ meaningfully on variables not used in clustering, and are they actionable for extension officers?).",
    "Accept the clusters, because k-means always finds the true groups."
  ],
  answer: 2,
  modelAnswer: "Triangulate: internal validity indices, stability or robustness, and external, substantive usefulness.",
  explanation: "Unsupervised results cannot be scored against labels, and the algorithm will always return k clusters, even in data with no real group structure. Validation therefore combines: (1) <b>internal criteria</b> (silhouette, Calinski–Harabasz, the elbow, used together); (2) <b>stability</b>: real structure should reappear under resampling, different initialisations and different methods (hierarchical, Gaussian mixtures); (3) <b>external or substantive validity</b>: clusters should differ on outcomes or attributes not used to build them, and be interpretable and useful for the decision. Within-cluster SS always falls as k increases (zero when k = n), so minimising it alone is meaningless. Remember that results depend on feature choice and scaling.",
  concepts: ["cluster validation", "silhouette", "stability", "external validity"], source: "D4 p43–45; D2 p38"
},
{
  id: 92, topic: "Clustering & dimensionality reduction", difficulty: "Foundational", category: "Conceptual", type: "tf",
  question: "True or false: Principal component analysis (PCA) is a supervised method that uses the target variable to find the directions that best predict it.",
  answer: false,
  modelAnswer: "False. PCA is unsupervised: it finds directions of maximum variance in the features, ignoring any target.",
  explanation: "PCA constructs uncorrelated linear combinations of the (usually standardised) features that capture as much of their variance as possible. It never looks at the outcome, so the high-variance components are not guaranteed to be the most predictive ones. A low-variance direction can matter most for a particular target. Supervised alternatives that use the target include partial least squares (PLS) and lasso. PCA is useful for visualisation, compression, noise reduction and handling multicollinearity, but its components can be hard to interpret.",
  concepts: ["PCA", "unsupervised learning", "dimensionality reduction"], source: "D4 p46; D3 p42"
},
{
  id: 93, topic: "Clustering & dimensionality reduction", difficulty: "Intermediate", category: "Practical application", type: "mcq",
  scenario: "GPS locations of informal market traders form elongated clusters along roads, with very different densities and many isolated points that belong to no market.",
  question: "Which clustering approach is most suitable?",
  options: [
    "k-means with k chosen by the elbow method",
    "Density-based clustering such as DBSCAN/HDBSCAN, which finds arbitrarily shaped dense regions and labels sparse points as noise",
    "PCA followed by linear regression",
    "Apriori association rules on the coordinates"
  ],
  answer: 1,
  modelAnswer: "Density-based clustering (DBSCAN/HDBSCAN).",
  explanation: "k-means assumes roughly spherical, similarly sized clusters and assigns <i>every</i> point to a cluster, so it splits elongated groups and absorbs noise. <b>DBSCAN</b> grows clusters from dense neighbourhoods, follows irregular shapes and explicitly marks outliers. HDBSCAN copes better with varying densities and needs less parameter tuning. For geographic coordinates, use a suitable distance (e.g. haversine) and choose the neighbourhood radius in meaningful units. The general principle: match the algorithm's assumptions (shape, density, noise, scale) to the data.",
  concepts: ["DBSCAN", "k-means assumptions", "spatial clustering"], source: "D4 p43–45; D5 §6.5"
},
{
  id: 94, topic: "Model evaluation & validation", difficulty: "Advanced", category: "Critical thinking", type: "multi",
  question: "A team presents a regression model predicting house rents in Kigali, with training R² = 0.91. Which additional checks are necessary to validate it properly? (Select all that apply.)",
  options: [
    "Estimate prediction error on held-out data (cross-validation or a test set) and compare it with a simple baseline",
    "Examine residual plots for non-linearity, heteroscedasticity and patterns by neighbourhood",
    "Check for influential observations and data errors that may drive the fit",
    "Check whether intended uses require extrapolation beyond the training range (e.g. luxury villas, new districts)",
    "Keep adding predictors until R² stops increasing, since a higher training R² proves a better model"
  ],
  answer: [0, 1, 2, 3],
  modelAnswer: "Out-of-sample error vs a baseline, residual diagnostics, influence checks and extrapolation checks are all needed. Chasing training R² is not validation.",
  explanation: "Training R² measures in-sample fit, and it never decreases when predictors are added, even pure noise. A credible validation shows: (1) <b>generalisation</b>, through held-out error compared with a naive baseline; (2) <b>model adequacy</b>, through residual diagnostics; (3) <b>robustness</b>, by checking that a few influential points (high leverage or Cook's distance), possibly data errors, are not driving the fit; (4) the <b>domain of applicability</b>, since predictions are trustworthy only within the range of the training data. Adjusted R², AIC/BIC or CV error penalise needless complexity.",
  concepts: ["model validation", "R² limitations", "residual diagnostics", "influence", "extrapolation"], source: "D3 p32; D4 p15–17; D5 §10.2"
},
{
  id: 95, topic: "Machine learning foundations", difficulty: "Foundational", category: "Conceptual", type: "mcq",
  question: "Why should every model be compared with a simple baseline (e.g. predicting the majority class, the mean, or last period's value)?",
  options: [
    "Baselines are required by law for all models.",
    "Because a baseline shows how much the model actually adds: an impressive-looking score (e.g. 95% accuracy) may be no better than a trivial rule when classes are imbalanced or the series is persistent.",
    "Because baseline models are always more accurate than machine-learning models.",
    "Baselines are only needed for unsupervised learning."
  ],
  answer: 1,
  modelAnswer: "A baseline puts the model's performance in context and exposes trivial or misleading scores.",
  explanation: "Metrics only mean something relative to a reference. If 95% of students do not drop out, a rule that predicts 'no dropout' for everyone scores 95% accuracy. If demand barely changes month to month, 'same as last month' is a strong forecast. Baselines (majority class, mean, naive or seasonal-naive, a simple logistic regression) reveal whether a complex model adds real value worth its cost and opacity. They also catch bugs: a model that does worse than the baseline usually indicates a pipeline error.",
  concepts: ["baseline model", "performance context"], source: "D4 p25, p41"
},
{
  id: 96, topic: "Model evaluation & validation", difficulty: "Advanced", category: "Critical thinking", type: "short",
  question: "A vendor claims its model predicts university student dropout with 99% accuracy and asks the university to buy it. As the university's data scientist, what questions would you ask, and what evidence would you require before trusting the claim?",
  keyPoints: [
    "Base rate and metric: what is the dropout rate? accuracy may be trivial under imbalance — ask for recall, precision, PR/ROC-AUC, calibration and a confusion matrix at the proposed threshold, compared with a naive baseline",
    "Leakage: which features are used and when are they recorded? (e.g. 'withdrawal form submitted', 'fees unpaid after exit', final-semester marks) — only information available at prediction time",
    "Validation design: was evaluation done on truly held-out data, separated by student and by time (train on earlier cohorts, test on later), and on data like ours (other institutions → transportability)?",
    "Robustness and fairness: performance by subgroups (sex, region, scholarship status, disability), stability over cohorts, how errors would affect students",
    "Evidence: independent replication on the university's own historical data, documentation (model card, data sources), and a pilot with monitoring; decision use and human oversight defined"
  ],
  modelAnswer: "<b>1. What does 99% mean?</b> If only 2% of students drop out, a 'nobody drops out' rule scores 98%. Ask for the base rate, the confusion matrix at the proposed threshold, recall (how many dropouts are caught), precision, PR-AUC and calibration, all compared with a trivial baseline. <b>2. Leakage:</b> list every feature and when it becomes available. Features such as 'withdrawal request filed', 'no exam registration' or end-of-year marks are known only at or after dropout, so they make prediction trivial and useless for early intervention. <b>3. Validation design:</b> was the model tested on unseen students, with temporal validation (earlier cohorts for training, later ones for testing), and on institutions comparable to ours? Performance often drops when a model moves to a new population. <b>4. Fairness and harm:</b> results by subgroup; whether false positives could stigmatise students or false negatives leave them without support. <b>5. Independent evidence:</b> run the model retrospectively on our own historical data, review documentation (data, model card, limitations), then run a monitored pilot with clear human decision-making. Only then consider a purchase.",
  explanation: "Critical appraisal of performance claims combines metric literacy, leakage awareness, validation design, transportability and ethics, without requiring any computation.",
  concepts: ["critical appraisal", "accuracy paradox", "leakage", "temporal validation", "fairness"], source: "D4 p20, p29–32, p57"
},
{
  id: 97, topic: "Decision trees & ensembles", difficulty: "Intermediate", category: "Conceptual", type: "mcq",
  question: "When an analyst refits a single decision tree on slightly different samples of the same data, the tree's structure and predictions change a lot. What does this reveal, and what is the standard remedy?",
  options: [
    "High bias; replace the tree with a linear model.",
    "High variance (instability); use bagging or random forests, which average many trees built on bootstrap samples, and/or prune the tree.",
    "The data contain no signal; stop the analysis.",
    "Data leakage; shuffle the target variable."
  ],
  answer: 1,
  modelAnswer: "Single deep trees are high-variance learners. Averaging (bagging or random forests) and pruning reduce this instability.",
  explanation: "Trees split greedily: a small change near the top changes every split below it. Deep trees therefore have low bias but high variance. <b>Bagging</b> averages many trees fitted on bootstrap samples, which reduces variance. <b>Random forests</b> also decorrelate the trees by sampling features at each split. <b>Pruning</b> (cost-complexity, minimum leaf size, maximum depth) simplifies a single tree, trading a little bias for stability when one interpretable tree is required. Instability matters: if the explanation changes with every resample, decisions based on 'the tree's rules' are not reliable.",
  concepts: ["model instability", "variance", "bagging", "pruning"], source: "D4 p36–38; D2 p35"
},
{
  id: 98, topic: "Responsible Data Science & ethics", difficulty: "Intermediate", category: "Case study", type: "mcq",
  scenario: "A ministry wants to publish an open dataset of health-survey responses with names removed, but with sector, exact age, sex, occupation and HIV-test result for each respondent.",
  question: "Which assessment is most accurate?",
  options: [
    "Removing names makes the data anonymous, so publication is safe.",
    "The data are only pseudonymised. The combination of quasi-identifiers (sector, exact age, sex, occupation) can single out individuals in small populations and reveal a highly sensitive attribute. Reduce re-identification risk (aggregate age bands, coarsen geography, suppress rare combinations, check k-anonymity) or share under controlled access, in line with data-protection law and the FAIR/'open ≠ unprotected' principle.",
    "Health data can never be shared for research in any form.",
    "Encrypting the file before posting it online removes all privacy risks."
  ],
  answer: 1,
  modelAnswer: "Removing names is not anonymisation. Quasi-identifiers enable re-identification, so apply disclosure control or controlled access.",
  explanation: "Combinations of a few indirect attributes are often unique. In a small sector there may be only one 34-year-old female teacher, so publishing her test result discloses it. <b>Pseudonymisation</b> (removing or replacing direct identifiers) is reversible by linkage. <b>Anonymisation</b> requires that individuals cannot reasonably be re-identified. Statistical disclosure control: generalise (age bands, district instead of sector), suppress or perturb rare cells, measure k-anonymity or l-diversity, release aggregates, or offer microdata through a controlled research-access process with data-use agreements. Rwanda's Law No 058/2021 treats health data as sensitive and requires lawful basis, purpose limitation and security. Open data should be FAIR but protected.",
  concepts: ["anonymisation vs pseudonymisation", "quasi-identifiers", "disclosure control", "data protection"], source: "D1 p37–39; D5 §8.1"
},
{
  id: 99, topic: "Model evaluation & validation", difficulty: "Advanced", category: "Practical application", type: "multi",
  question: "You are building a model to forecast weekly fuel demand at petrol stations. Which practices are appropriate for validating this forecasting model? (Select all that apply.)",
  options: [
    "Rolling-origin (walk-forward) evaluation: repeatedly train on data up to time t and test on the following weeks",
    "Comparing performance against naive and seasonal-naive baselines",
    "Checking residuals for remaining autocorrelation or seasonality that the model failed to capture",
    "Evaluating separately around special periods (holidays, price changes) and monitoring error after deployment",
    "Using as predictors exogenous values, such as the actual future fuel price, that will not be known when the real forecast is made"
  ],
  answer: [0, 1, 2, 3],
  modelAnswer: "Walk-forward evaluation, baselines, residual diagnostics and targeted, monitored evaluation are correct. Using future-only information is leakage.",
  explanation: "Time-series observations are dependent and ordered, so validation must respect time. Rolling-origin evaluation imitates repeated real forecasting. Naive baselines are hard to beat for persistent series and expose overfitting. Autocorrelated residuals mean structure is still unexploited (or the intervals are miscalibrated). Errors often concentrate around special events, so evaluate those separately. Feeding the model values that are known only after the fact (actual future prices, the realised weather) makes back-tests look excellent but cannot be reproduced at forecast time. Use forecasts of those drivers instead, or scenarios.",
  concepts: ["time-series validation", "rolling origin", "baselines", "leakage"], source: "D4 p20; D5 §5.4"
},
{
  id: 100, topic: "Reproducibility & documentation", difficulty: "Advanced", category: "Critical thinking", type: "short",
  question: "Six months after you submit an analysis to the Ministry, an auditor asks you to reproduce every number and explain every cleaning decision. Describe the practices that make a data science project reproducible and auditable from raw data to final report, and explain why each matters.",
  keyPoints: [
    "Raw data kept immutable and versioned (with provenance/metadata); all changes done by scripts, never manual edits in spreadsheets",
    "Code under version control (git) with a clear project structure; analysis as a pipeline (e.g. targets/Makefile/run_pipeline script) that regenerates outputs end to end",
    "Computational environment captured (package versions via renv/requirements/containers) and random seeds fixed for stochastic steps",
    "Documentation: data dictionary, cleaning log with rules and counts, decisions and assumptions, README; literate reports (R Markdown/Quarto/notebooks) that generate tables/figures from code",
    "Validation tests and checks built into the pipeline; outputs traceable to inputs (lineage); access controls and privacy safeguards documented"
  ],
  modelAnswer: "<b>Raw data immutable and versioned:</b> keep the original extracts read-only, with source, extraction date and query (provenance). Without this, no one can verify where a number came from. <b>No manual edits:</b> every transformation is in code, because an unrecorded spreadsheet edit cannot be audited or repeated. <b>Version control:</b> git records who changed what and why, and tags the exact version used for the submitted report. <b>Automated pipeline:</b> a single entry point (e.g. <code>run_pipeline.R</code>, the <code>targets</code> package, a Makefile) re-runs ingest → clean → analyse → report, showing that the outputs follow from the inputs. <b>Environment capture:</b> package versions (<code>renv</code>, <code>requirements.txt</code>, Docker) and fixed random seeds, because different library versions or random draws can change results. <b>Documentation:</b> a data dictionary, a cleaning log (each rule, its rationale and the number of records affected), recorded assumptions, and literate reports (Quarto/R Markdown) where every table and figure is generated from code rather than pasted in. <b>Tests and lineage:</b> validation checks run on every execution, and each output can be traced to its inputs. Record privacy and access controls too. Together these turn 'trust me' into 'run this and check'.",
  explanation: "Reproducibility is a cross-cutting principle of the data science lifecycle and of research methodology. It supports auditability, collaboration, error detection and ethical accountability.",
  concepts: ["reproducibility", "version control", "pipelines", "documentation", "provenance"], source: "D2 p69–71; D1 p22–23"
}
]);
