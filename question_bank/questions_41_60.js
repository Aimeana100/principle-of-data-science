/* DSC6131 Principles of Data Science — Question Bank, Batch 3 (Q41–60)
   Topics: ML foundations, data mining, supervised/unsupervised learning, evaluation, generalisation, neural nets, responsible ML. */
window.QUESTION_BANK = (window.QUESTION_BANK || []).concat([
{
  id: 41, topic: "Machine learning foundations", difficulty: "Foundational", category: "Conceptual", type: "mcq",
  question: "Using Mitchell's definition (a program learns from experience E with respect to task T and performance measure P), a model predicts maize yield for new plots from soil and weather variables, and is judged by RMSE on plots it has not seen. What is E?",
  options: [
    "Predicting yield for new plots",
    "Root-mean-square error on unseen plots",
    "Historical records of plots with measured soil, weather and actual yield",
    "The regression algorithm's learning rate"
  ],
  answer: 2,
  modelAnswer: "E is the labelled historical data (features plus observed yields).",
  explanation: "T (task) = predict yield for a plot; P (performance) = RMSE on unseen plots; E (experience) = the training examples with known outcomes. A learning-rate setting is a hyper-parameter of the algorithm, not experience. Framing a problem as T/P/E forces clarity about the label, the evaluation metric and the data needed. Because the label is continuous, this is a <b>supervised regression</b> problem.",
  concepts: ["definition of ML", "task/performance/experience"], source: "D4 p5; D1 p30"
},
{
  id: 42, topic: "Supervised & unsupervised learning", difficulty: "Foundational", category: "Conceptual", type: "multi",
  question: "Which of the following are <b>supervised</b> learning tasks? (Select all that apply.)",
  options: [
    "Segmenting MoMo customers into groups with similar transaction behaviour, without predefined groups",
    "Predicting whether a SACCO borrower will default, from past loans with known outcomes",
    "Estimating a house's sale price from historical sales",
    "Reducing 40 correlated EICV indicators to a few principal components",
    "Classifying chest X-rays as TB / not TB using images labelled by radiologists"
  ],
  answer: [1, 2, 4],
  modelAnswer: "Loan default (classification), house price (regression) and X-ray TB detection (classification) are supervised.",
  explanation: "<b>Supervised</b> learning uses labelled examples (x, y) to learn a mapping f(x) ≈ y: classification when y is categorical, regression when y is numeric. <b>Unsupervised</b> learning has no labels and finds structure: clustering (customer segmentation) and dimensionality reduction (PCA). Reinforcement learning, the third paradigm, learns a policy from rewards through interaction with an environment.",
  concepts: ["supervised vs unsupervised", "classification vs regression"], source: "D4 p7–8"
},
{
  id: 43, topic: "Data mining: association rules", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "In 20 supermarket receipts: Milk appears in 10, Bread in 8, and Milk and Bread together in 6.",
  question: "Compute the <b>lift</b> of the rule {Milk} ⇒ {Bread}.",
  answer: 1.5, tolerance: 0.005, unit: "",
  modelAnswer: "Support = 6/20 = 0.30; confidence = 6/10 = 0.60; lift = 0.60/(8/20) = 1.5.",
  explanation: "support(M ⇒ B) = P(M ∩ B) = 6/20 = 0.30.<br>confidence(M ⇒ B) = P(B | M) = 6/10 = 0.60.<br>lift = confidence / P(B) = 0.60 / 0.40 = <b>1.5</b>, equivalently P(M∩B)/(P(M)P(B)) = 0.30/(0.5 × 0.4).<br><b>Interpretation:</b> customers who buy milk are 1.5 times as likely to buy bread as a random customer; lift > 1 indicates positive association, = 1 independence, < 1 negative association. High confidence alone can mislead when the consequent is very common (lift corrects for this). Rules show co-occurrence, not causation. The <b>Apriori principle</b> (every subset of a frequent itemset is frequent) prunes the search space.",
  concepts: ["support", "confidence", "lift", "Apriori"], source: "D2 p27–29"
},
{
  id: 44, topic: "Decision trees & ensembles", difficulty: "Advanced", category: "Calculation", type: "numeric",
  scenario: "A training set of 12 loan applications has 8 'approve' and 4 'reject'.<br>Split A divides it into two groups of 6: group 1 = 6 approve / 0 reject; group 2 = 2 approve / 4 reject.<br>Split B divides it into 4 records (3 approve / 1 reject) and 8 records (5 approve / 3 reject).",
  question: "Compute the information gain (bits) of <b>Split A</b> (three decimals).",
  answer: 0.459, tolerance: 0.003, unit: "bits",
  modelAnswer: "H(S) = 0.918; IG(A) = 0.918 − ½(0) − ½(0.918) = 0.459 bits (Split B gives only ≈ 0.012).",
  explanation: "Entropy H(S) = −Σ pᵢ log₂ pᵢ.<br>Root: p = 8/12, 4/12 → H = −(2/3)log₂(2/3) − (1/3)log₂(1/3) = 0.918 bits.<br>Group 1 (6/0) is pure: H = 0. Group 2 (2/4): H = 0.918.<br>IG(A) = H(S) − Σ (|Sᵥ|/|S|) H(Sᵥ) = 0.918 − (6/12)(0) − (6/12)(0.918) = <b>0.459</b>.<br>Split B: H(3/1) = 0.811, H(5/3) = 0.954 → IG = 0.918 − (4/12)(0.811) − (8/12)(0.954) ≈ 0.012.<br>So the tree chooses Split A. With the <b>Gini index</b> (1 − Σpᵢ²) the conclusion is the same: root Gini = 0.444, weighted Gini after A = 0.222. Caveat: information gain favours attributes with many distinct values (e.g. an ID), which C4.5 corrects with the gain ratio. Unrestricted trees overfit, so control depth, minimum leaf size or prune with cost-complexity.",
  concepts: ["entropy", "information gain", "Gini index", "tree induction"], source: "D2 p33–35; D4 p36"
},
{
  id: 45, topic: "Classification & regression algorithms", difficulty: "Intermediate", category: "Calculation", type: "mcq",
  scenario: "A new SACCO applicant has (income, debt) = (5, 2) (standardised units). Training points: A(4, 2) = No default; B(6, 3) = No; C(5, 5) = Yes; D(8, 1) = Yes; E(2, 4) = Yes. Use Euclidean distance.",
  question: "What does k-NN predict for k = 3 and for k = 5?",
  options: [
    "k = 3: No; k = 5: No",
    "k = 3: No; k = 5: Yes",
    "k = 3: Yes; k = 5: Yes",
    "k = 3: Yes; k = 5: No"
  ],
  answer: 1,
  modelAnswer: "k = 3 → No (A, B, C: 2 No vs 1 Yes); k = 5 → Yes (2 No vs 3 Yes).",
  explanation: "Distances from (5, 2): A = √(1² + 0²) = 1.00; B = √(1 + 1) = 1.41; C = √(0 + 9) = 3.00; D = √(9 + 1) = 3.16; E = √(9 + 4) = 3.61.<br>k = 3 → {A: No, B: No, C: Yes} → majority <b>No</b>.<br>k = 5 → all points → 3 Yes vs 2 No → <b>Yes</b>.<br>The prediction depends on k. Small k gives low bias but high variance (sensitive to noise); large k gives smoother boundaries (higher bias). When k = n, kNN predicts the majority class everywhere. Choose k by cross-validation, standardise features (otherwise large-scale variables dominate distance), and consider distance weighting. kNN is a lazy learner: there is no training cost, but prediction is expensive on large datasets.",
  concepts: ["k-nearest neighbours", "Euclidean distance", "choice of k"], source: "D2 p32; D4 p24"
},
{
  id: 46, topic: "Clustering & dimensionality reduction", difficulty: "Advanced", category: "Calculation", type: "numeric",
  scenario: "Five points: P1(2,3), P2(3,4), P3(8,8), P4(9,7), P5(3,2). k-means with k = 2 starts from centroids c₁ = (2,3) and c₂ = (9,7).",
  question: "After one assignment step and one centroid-update step, what is the total within-cluster sum of squares (WCSS) (three decimals)?",
  answer: 3.667, tolerance: 0.005, unit: "",
  modelAnswer: "Clusters {P1, P2, P5} and {P3, P4}; new centroids (2.667, 3) and (8.5, 7.5); WCSS = 2.667 + 1.000 = 3.667.",
  explanation: "<b>Assign</b> (Euclidean distance to c₁ vs c₂): P1 0 vs 8.06 → C₁; P2 1.41 vs 6.71 → C₁; P5 1.41 vs 7.81 → C₁; P3 7.81 vs 1.41 → C₂; P4 8.06 vs 0 → C₂.<br><b>Update</b>: c₁ = ((2+3+3)/3, (3+4+2)/3) = (2.667, 3.000); c₂ = ((8+9)/2, (8+7)/2) = (8.5, 7.5).<br><b>WCSS</b> = Σ‖xᵢ − c‖²: C₁: P1 0.444 + P2 (0.111 + 1) + P5 (0.111 + 1) = 2.667; C₂: P3 0.5 + P4 0.5 = 1.000 → total <b>3.667</b>.<br>A further assignment step changes nothing, so the algorithm has converged. k-means minimises WCSS but converges only to a local optimum that depends on initialisation (use k-means++ and several random starts). It assumes roughly spherical, similar-sized clusters and requires scaled features. Choose k with the elbow method or silhouette scores.",
  concepts: ["k-means", "WCSS", "convergence", "initialisation"], source: "D2 p36–38; D4 p43–44"
},
{
  id: 47, topic: "Overfitting, bias & variance", difficulty: "Foundational", category: "Conceptual", type: "tf",
  question: "True or false: Lasso (L1) regularisation can shrink some coefficients exactly to zero, effectively performing variable selection, whereas ridge (L2) regularisation shrinks coefficients towards zero but rarely makes them exactly zero.",
  answer: true,
  modelAnswer: "True.",
  explanation: "Ridge minimises RSS + λΣβⱼ²; lasso minimises RSS + λΣ|βⱼ|. The L1 constraint region has corners on the axes, so the optimum often lies where some βⱼ = 0, producing sparse models. Both trade a little bias for a reduction in variance. λ is tuned by cross-validation, and predictors must be standardised first because the penalty depends on scale. With highly correlated predictors, lasso tends to pick one arbitrarily, while ridge spreads the weight; elastic net combines both penalties.",
  concepts: ["ridge", "lasso", "regularisation", "sparsity"], source: "D4 p18"
},
{
  id: 48, topic: "Overfitting, bias & variance", difficulty: "Intermediate", category: "Analytical", type: "mcq",
  question: "A gradient-boosted model for house prices has training RMSE = 0.5 (in $1000s) but 5-fold cross-validated RMSE = 4.2. A linear model has training RMSE 4.6 and CV RMSE 4.8. Which diagnosis and action is most appropriate for the boosted model?",
  options: [
    "Under-fitting (high bias): add more trees and increase depth.",
    "Over-fitting (high variance): reduce complexity (shallower trees, lower learning rate with early stopping, subsampling) and tune via CV.",
    "The model is ideal because its training error is lowest.",
    "Data leakage is certain; discard the model."
  ],
  answer: 1,
  modelAnswer: "Over-fitting: a large gap between training and validation error. Regularise and tune with CV.",
  explanation: "A large <b>generalisation gap</b> (training error much lower than CV error) signals high variance. The linear model's similar train and CV errors but higher level suggest higher bias. Remedies for variance: limit tree depth/leaf size, lower the learning rate with early stopping, row/column subsampling, more data, and feature selection. The decisive comparison is CV (or test) error: the boosted model (4.2) still beats the linear model (4.8), so it may remain the better choice after tuning. Leakage usually shows up as suspiciously <i>good</i> validation scores, not a gap.",
  concepts: ["overfitting", "generalisation gap", "bias–variance trade-off"], source: "D4 p14–17"
},
{
  id: 49, topic: "Model evaluation & validation", difficulty: "Advanced", category: "Critical thinking", type: "multi",
  question: "Which of the following practices introduce <b>data leakage</b>? (Select all that apply.)",
  options: [
    "Standardising all features using the mean and SD of the full dataset before splitting into training and test sets",
    "Including 'number of reminder letters sent' as a feature when predicting whether a loan will default",
    "Randomly splitting monthly sales data from 2019–2025 into train/test sets for a forecasting model",
    "Computing target (mean) encoding of a categorical variable inside each cross-validation training fold only",
    "Allowing several visits of the same patient to appear in both training and test sets when predicting patient-level outcomes"
  ],
  answer: [0, 1, 2, 4],
  modelAnswer: "Options 1, 2, 3 and 5 leak; option 4 is the correct, leakage-free practice.",
  explanation: "Leakage occurs when information unavailable at prediction time influences training or evaluation, producing over-optimistic estimates. (1) <b>Train–test contamination</b>: test-set statistics shape preprocessing. Fit scalers and imputers on training folds only, using pipelines/recipes. (2) <b>Target leakage</b>: reminder letters are sent <i>after</i> default begins, so the feature is a consequence of the label. (3) <b>Temporal leakage</b>: random splits let the model learn from the future. Use time-based splits or rolling-origin CV. (5) <b>Group leakage</b>: the model memorises individuals. Use grouped CV by patient. (4) Encoding computed within training folds is the recommended practice. The diagnostic question for every feature: 'would I know this at the moment of prediction?'",
  concepts: ["data leakage", "pipelines", "time-series validation", "grouped CV"], source: "D4 p20"
},
{
  id: 50, topic: "Model evaluation & validation", difficulty: "Advanced", category: "Analytical", type: "short",
  question: "Explain how k-fold cross-validation works, why it is preferred to a single train/test split, how k should be chosen, and how CV must be organised when it is also used to tune hyper-parameters (so that the reported performance is unbiased).",
  keyPoints: [
    "Partition training data into k folds; train on k−1, validate on the held-out fold; repeat k times so each fold is validated once; average (and report spread of) the k scores",
    "Advantages over one split: uses data more efficiently, lower-variance and less split-dependent estimate of generalisation error, gives a measure of variability",
    "Choice of k: typically 5 or 10 — bias–variance–compute trade-off (small k more pessimistic bias; LOOCV nearly unbiased but high variance and costly); stratify for imbalanced classes; group/time-aware variants when needed",
    "Tuning: select hyper-parameters by inner CV; the score of the selected model on the same folds is optimistically biased",
    "Use nested CV (inner loop tunes, outer loop estimates) or keep a final untouched test set; all preprocessing must be inside the folds"
  ],
  modelAnswer: "In <b>k-fold CV</b> the (training) data are split into k roughly equal folds. For i = 1…k the model is fit on the other k − 1 folds and evaluated on fold i. The k scores are averaged, and their SD indicates stability. Compared with a single hold-out split, every observation is used for both training and validation, so the estimate of out-of-sample error has lower variance and depends less on one lucky or unlucky split. This matters most for small datasets. <b>Choosing k</b> is a trade-off: k = 5 or 10 is standard. Small k trains on less data (pessimistic bias). LOOCV (k = n) is nearly unbiased but has high variance and high cost. Use stratified folds for imbalanced classification, grouped folds when observations cluster (patients, households), and rolling-origin splits for time series. <b>Tuning:</b> if the same CV scores are used both to pick hyper-parameters and to report performance, the result is optimistically biased because we selected the maximum of noisy estimates. Use <b>nested CV</b>: an inner loop tunes and an outer loop estimates the error of the whole tuning procedure. Alternatively, tune with CV on the training set and report performance once on an untouched test set. Preprocessing steps (scaling, imputation, feature selection) must be refitted inside each fold to avoid leakage.",
  explanation: "This is a core Unit 4 learning outcome: 'evaluate on data the model never saw'. Examiners expect the procedure, the rationale, the choice-of-k trade-off and the selection-bias issue.",
  concepts: ["k-fold CV", "nested CV", "hyper-parameter tuning", "stratification"], source: "D4 p16–17, p54"
},
{
  id: 51, topic: "Model evaluation & validation", difficulty: "Advanced", category: "Calculation", type: "numeric",
  scenario: "A MoMo fraud classifier is tested on 20,000 transactions: TP = 45, FP = 405, FN = 5, TN = 19,545.",
  question: "Compute the F₁ score (two decimals).",
  answer: 0.18, tolerance: 0.005, unit: "",
  modelAnswer: "Precision = 45/450 = 0.10; recall = 45/50 = 0.90; F₁ = 2(0.10 × 0.90)/(0.10 + 0.90) = 0.18. Accuracy = 0.9795.",
  explanation: "Accuracy = (TP + TN)/N = 19,590/20,000 = 0.9795.<br>Precision = TP/(TP + FP) = 45/450 = 0.10.<br>Recall (sensitivity) = TP/(TP + FN) = 45/50 = 0.90.<br>Specificity = TN/(TN + FP) = 19,545/19,950 = 0.980.<br>F₁ = 2PR/(P + R) = 0.18/1.00 = <b>0.18</b>.<br><b>Interpretation:</b> 98% accuracy looks excellent, but fraud prevalence is only 0.25%. A model that never flags fraud would score 99.75% accuracy. The model catches 90% of fraud, but 9 of every 10 alerts are false, which annoys honest customers and swamps investigators. With class imbalance, report precision–recall (PR-AUC), F₁ or cost-weighted metrics, and choose the decision threshold from the relative costs of FN vs FP.",
  concepts: ["confusion matrix", "precision", "recall", "F1", "class imbalance"], source: "D2 p31, p78; D4 p29–32"
},
{
  id: 52, topic: "Probability & distributions", difficulty: "Advanced", category: "Calculation", type: "numeric",
  scenario: "A rapid diagnostic test for a disease has sensitivity 90% and specificity 95%. In the screened population the prevalence is 2%.",
  question: "What is the probability that a person who tests <b>positive</b> actually has the disease (positive predictive value), in percent (one decimal)?",
  answer: 26.9, tolerance: 0.1, unit: "%",
  modelAnswer: "PPV = (0.9 × 0.02)/(0.9 × 0.02 + 0.05 × 0.98) = 0.018/0.067 ≈ 26.9%.",
  explanation: "Bayes' theorem: P(D | +) = P(+ | D)P(D) / [P(+ | D)P(D) + P(+ | ¬D)P(¬D)].<br>Numerator = 0.90 × 0.02 = 0.018. False-positive mass = (1 − 0.95) × 0.98 = 0.049.<br>PPV = 0.018/0.067 = 0.2687 ≈ <b>26.9%</b>. NPV = 0.931/0.933 ≈ 99.8%.<br><b>Interpretation:</b> with low prevalence most positives are false, even for a good test (the base-rate fallacy). The same logic applies to ML classifiers deployed in a population with different prevalence from the training data: precision changes with prevalence while sensitivity and specificity do not. Confirmatory testing or targeting high-risk groups (higher prior) raises PPV.",
  concepts: ["Bayes' theorem", "PPV", "base-rate fallacy", "prevalence"], source: "D4 p33; D5 §3.4"
},
{
  id: 53, topic: "Model evaluation & validation", difficulty: "Intermediate", category: "Conceptual", type: "mcq",
  question: "A diabetes classifier has ROC AUC = 0.85 on a test set. Which interpretation is correct?",
  options: [
    "85% of patients are correctly classified at a threshold of 0.5.",
    "If one diabetic and one non-diabetic patient are chosen at random, there is an 85% probability that the model gives the diabetic patient the higher risk score.",
    "The model's precision is 0.85 at every threshold.",
    "The model will achieve AUC 0.85 in any population regardless of prevalence and case mix."
  ],
  answer: 1,
  modelAnswer: "AUC is the probability that a random positive is ranked above a random negative (equivalent to the Mann–Whitney statistic).",
  explanation: "The ROC curve plots TPR (sensitivity) against FPR (1 − specificity) across all thresholds. AUC summarises <b>ranking/discrimination</b> independently of any single threshold: 0.5 is random, 1.0 is perfect separation. It is not accuracy at a particular cut-off and not precision. AUC can transfer poorly to populations with a different case mix, and it says nothing about <b>calibration</b> (whether predicted probabilities match observed frequencies). Under heavy class imbalance, the precision–recall curve is often more informative.",
  concepts: ["ROC curve", "AUC", "discrimination vs calibration"], source: "D4 p31"
},
{
  id: 54, topic: "Neural networks & deep learning", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "A single artificial neuron has inputs x = (1, 2), weights w = (0.5, −0.25), bias b = 0.1 and a sigmoid activation σ(z) = 1/(1 + e⁻ᶻ).",
  question: "Compute the neuron's output (three decimals).",
  answer: 0.525, tolerance: 0.002, unit: "",
  modelAnswer: "z = 0.5(1) − 0.25(2) + 0.1 = 0.1; σ(0.1) = 1/(1 + e⁻⁰·¹) ≈ 0.525.",
  explanation: "Pre-activation z = w·x + b = 0.5 − 0.5 + 0.1 = 0.1.<br>Output a = σ(0.1) = 1/(1 + 0.9048) = <b>0.525</b>.<br>A neuron with a sigmoid activation is exactly a logistic-regression unit. Stacking such units with non-linear activations in hidden layers lets networks approximate complex functions (the universal approximation theorem). Backpropagation applies the chain rule to compute ∂Loss/∂w for every weight, and gradient descent then updates the weights. Sigmoid saturates for large |z| (vanishing gradients), so ReLU is the usual hidden-layer default.",
  concepts: ["artificial neuron", "activation function", "sigmoid", "backpropagation"], source: "D4 p48–50; D5 §7.1–7.2"
},
{
  id: 55, topic: "Classification & regression algorithms", difficulty: "Advanced", category: "Calculation", type: "numeric",
  scenario: "Fit ŷ = w·x (no intercept) to the data (x, y) = (1, 2), (2, 4), (3, 5) by minimising the mean squared error L(w) = (1/n)Σ(yᵢ − w xᵢ)². Start at w₀ = 1 with learning rate η = 0.05.",
  question: "What is w after <b>one</b> gradient-descent step (four decimals)?",
  answer: 1.3667, tolerance: 0.0005, unit: "",
  modelAnswer: "∂L/∂w = −(2/n)Σxᵢ(yᵢ − w xᵢ) = −(2/3)(11) = −7.3333; w₁ = 1 − 0.05(−7.3333) = 1.3667.",
  explanation: "Residuals at w = 1: (2 − 1) = 1, (4 − 2) = 2, (5 − 3) = 2.<br>Σxᵢ·residualᵢ = 1(1) + 2(2) + 3(2) = 11.<br>Gradient = −(2/3)(11) = −7.333 (negative, so increasing w reduces the loss).<br>Update: w₁ = w₀ − η·∂L/∂w = 1 + 0.05 × 7.333 = <b>1.3667</b>.<br>The closed-form OLS solution is w* = Σxy/Σx² = 25/14 ≈ 1.786, so gradient descent is moving toward it. If η is too large the iterates overshoot and diverge; if too small, convergence is slow. Feature scaling improves conditioning. Stochastic and mini-batch variants use subsets of the data per step, which is essential for big data and deep learning.",
  concepts: ["gradient descent", "learning rate", "MSE loss", "optimisation"], source: "D4 p11–12, p23"
},
{
  id: 56, topic: "Classification & regression algorithms", difficulty: "Intermediate", category: "Analytical", type: "mcq",
  question: "A logistic regression predicting diabetes has a coefficient of 0.70 for 'BMI above 30' (1 = yes, 0 = no), holding other variables constant. Which interpretation is correct?",
  options: [
    "Having BMI above 30 increases the probability of diabetes by 0.70 (70 percentage points).",
    "Having BMI above 30 multiplies the odds of diabetes by about e^0.70 ≈ 2.01, holding the other predictors constant.",
    "Having BMI above 30 doubles the probability of diabetes for every patient.",
    "The coefficient cannot be interpreted because logistic regression is a black-box model."
  ],
  answer: 1,
  modelAnswer: "The odds ratio is e^0.70 ≈ 2.01: the odds (not the probability) roughly double, ceteris paribus.",
  explanation: "Logistic regression models log-odds: log(p/(1−p)) = β₀ + β₁x₁ + …. A one-unit change in xⱼ adds βⱼ to the log-odds, i.e. multiplies the odds by e^βⱼ. The change in <i>probability</i> is non-linear and depends on the baseline risk (largest near p = 0.5), so 'doubles the probability' is wrong in general. The relationship is associational unless the design supports causal inference. Probabilities from σ(β·x) are then turned into class labels via a threshold chosen from the costs of the two error types.",
  concepts: ["logistic regression", "odds ratio", "log-odds"], source: "D4 p27–28"
},
{
  id: 57, topic: "Decision trees & ensembles", difficulty: "Advanced", category: "Critical thinking", type: "short",
  question: "Compare bagging/random forests with gradient boosting. Your answer should explain (a) how each builds its ensemble, (b) which component of error (bias or variance) each mainly reduces and why, (c) why random forests subsample features, and (d) practical implications for tuning and over-fitting.",
  keyPoints: [
    "Bagging/RF: many deep trees trained independently (in parallel) on bootstrap samples; predictions averaged (regression) or voted (classification)",
    "Averaging many low-bias/high-variance trees mainly reduces variance",
    "RF samples a random subset of features (mtry) at each split to decorrelate trees, because averaging correlated trees reduces variance less; OOB error gives a free validation estimate",
    "Boosting: shallow trees (weak learners) added sequentially, each fitting the residuals/gradient of the current ensemble's loss, scaled by a learning rate — mainly reduces bias",
    "Practical: RF is robust with few tuning parameters and rarely overfits as trees are added; boosting often achieves higher accuracy but can overfit — needs tuning of learning rate, number of trees (early stopping), depth and subsampling via CV"
  ],
  modelAnswer: "(a) <b>Bagging</b> draws B bootstrap samples, grows a (typically deep, unpruned) tree on each independently, and averages or votes their predictions. A <b>random forest</b> adds random feature selection: at each split only m of p predictors (e.g. m ≈ √p) are candidates. <b>Gradient boosting</b> builds trees sequentially. Each new shallow tree is fitted to the negative gradient (residuals) of the current ensemble's loss, and its contribution is shrunk by a learning rate ν before being added. (b) Deep trees have low bias and high variance; averaging B of them cuts variance (for correlation ρ, Var ≈ ρσ² + (1−ρ)σ²/B) while bias stays roughly the same. Boosting starts from high-bias weak learners and reduces <b>bias</b> step by step by correcting earlier mistakes. (c) If one predictor is strong, all bagged trees split on it first and become highly correlated, so averaging helps little (the ρσ² term). Feature subsampling decorrelates trees and lowers ensemble variance. (d) RF performs well with defaults, is parallelisable and provides out-of-bag error and variable importance. Adding trees does not cause over-fitting. Boosting (GBM, XGBoost) often reaches the highest accuracy on tabular data but is sensitive to noise and can over-fit as iterations increase. Tune ν, the number of trees (early stopping on validation data), tree depth and row/column subsampling by CV. Both sacrifice the interpretability of a single tree, so use variable importance, partial dependence plots or SHAP.",
  explanation: "This tests the ability to link algorithm mechanics to bias–variance theory, a Unit 4 learning outcome ('diagnose under- and over-fitting').",
  concepts: ["bagging", "random forest", "boosting", "bias–variance", "OOB error"], source: "D4 p38–41"
},
{
  id: 58, topic: "Clustering & dimensionality reduction", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "PCA is run on five <b>standardised</b> district indicators. The eigenvalues of the correlation matrix are 2.6, 1.2, 0.6, 0.4 and 0.2.",
  question: "What percentage of total variance is explained by the first two principal components?",
  answer: 76, tolerance: 0.1, unit: "%",
  modelAnswer: "(2.6 + 1.2)/5.0 = 3.8/5 = 76%. The Kaiser rule (λ > 1) also retains 2 components.",
  explanation: "For standardised variables the total variance equals the number of variables (sum of eigenvalues = 5). Proportion explained by PCₖ = λₖ/Σλ: PC1 = 52%, PC2 = 24%, cumulative <b>76%</b>.<br>Retention rules: Kaiser (λ > 1) → 2 PCs; scree-plot elbow; or a cumulative threshold (e.g. 70–80%).<br><b>Caveats:</b> PCA captures <i>linear</i> structure and maximises variance, which is not necessarily relevant to a later prediction target. It must be run on standardised data when units differ, otherwise high-variance variables dominate. Components are linear combinations of the variables, interpreted through their loadings. Fit PCA on training data only before modelling. Non-linear methods such as t-SNE/UMAP are for visualisation, not general feature extraction.",
  concepts: ["PCA", "eigenvalues", "explained variance", "Kaiser rule"], source: "D4 p46; D3 p42"
},
{
  id: 59, topic: "Responsible Data Science & ethics", difficulty: "Advanced", category: "Case study", type: "short",
  scenario: "A SACCO deploys a credit-scoring model trained on ten years of its historical loan decisions. An audit shows that women applicants with similar repayment capacity are approved far less often than men. 'Sex' is not an input, but the model uses mobile-money transaction patterns, land-title ownership and occupation.",
  question: "Explain how the bias could arise despite excluding 'sex', and propose a responsible course of action covering technical, governance and legal aspects.",
  keyPoints: [
    "Historical labels encode past human/structural discrimination (biased training targets, selection bias — only approved applicants have observed repayment)",
    "Proxy variables (land titles, occupation, MoMo patterns) correlate with sex, so the model reconstructs the protected attribute — 'fairness through unawareness' fails",
    "Measure fairness by group: approval rates, TPR/FPR (equal opportunity / equalised odds), calibration within groups; recognise trade-offs between fairness definitions",
    "Mitigate: re-collect/re-label data, reweighting or constraints during training, threshold adjustment, remove or transform problematic proxies; validate on outcome data; keep human review and appeal",
    "Governance/legal: transparency and explainability to applicants, documentation (model cards), monitoring, accountability; comply with Rwanda Law No 058/2021 on personal data (lawful purpose, minimisation, data-subject rights) and anti-discrimination principles"
  ],
  modelAnswer: "<b>Sources of bias.</b> (1) The labels are past approval decisions, which embed historical and structural discrimination; the model learns to imitate them. (2) Selection bias: repayment is observed only for previously approved applicants, so the data under-represent women who were rejected. (3) Removing 'sex' does not remove information about sex. Land-title ownership (which may be registered mainly to men), occupation and MoMo patterns act as proxies, so 'fairness through unawareness' fails. <b>Actions.</b> <i>Technical:</i> audit by group (approval rate, TPR/FPR for equal opportunity, calibration) and choose fairness criteria with stakeholders, acknowledging that definitions conflict. Investigate and transform or remove proxies. Use repayment outcomes rather than past decisions as labels where possible, with reject inference. Apply reweighting, fairness-constrained training or group-aware thresholds, then re-validate accuracy and fairness on held-out data. <i>Governance:</i> keep a human in the loop with an appeal process, give applicants explanations of adverse decisions, document data and model limitations (datasheets, model cards), and monitor drift and fairness metrics after deployment. <i>Legal/ethical:</i> ensure lawful, purpose-limited and minimised processing and respect data-subject rights under Rwanda's Law No 058/2021 on personal data and privacy, in line with the National AI Policy's emphasis on trustworthy AI.",
  explanation: "This addresses the Unit 4 outcome 'reflect on interpretability, fairness and privacy when ML is used for decisions about people' and the ethics themes of Unit 1.",
  concepts: ["algorithmic fairness", "proxy discrimination", "selection bias", "data protection"], source: "D4 p56–57; D1 p39–41; D5 Ch8"
},
{
  id: 60, topic: "Data Science lifecycle", difficulty: "Advanced", category: "Case study", type: "short",
  scenario: "The Ministry of Health asks you to build a model that flags children under five at high risk of stunting, using Rwanda DHS (RDHS) survey data, so community health workers can prioritise home visits.",
  question: "Outline an end-to-end, methodologically sound approach: problem framing and target, data preparation and EDA, modelling and validation strategy, choice of evaluation metric and threshold, and deployment/ethical considerations. Highlight at least two pitfalls specific to this setting.",
  keyPoints: [
    "Framing: binary target (HAZ < −2 SD per WHO standards) or continuous HAZ; define the decision (prioritise visits), the unit (child) and features available at prediction time (exclude post-outcome variables)",
    "Data & EDA: profile modules, join child–mother–household correctly, handle missing data, check implausible anthropometry, use survey design/weights and clusters; explore relationships (wealth, maternal education, sanitation, birth interval)",
    "Modelling & validation: baseline logistic regression vs tree ensembles; CV grouped by survey cluster/household (avoid leakage from siblings/cluster neighbours), or hold-out by survey round/region; tune within training folds",
    "Metrics: prioritise recall/sensitivity for high-risk children at a CHW-capacity-constrained threshold; report PR-AUC/ROC-AUC, calibration, and performance by subgroup (district, wealth)",
    "Deployment & ethics: DHS is cross-sectional and not a live register — model needs routine data (CHW/HMIS) at deployment; privacy (Law 058/2021), avoid stigmatisation, human judgement, monitoring and periodic recalibration"
  ],
  modelAnswer: "<b>1. Framing.</b> The decision is which children CHWs should visit first. Target: stunted (height-for-age z < −2, WHO growth standards) as a binary label, or HAZ as a continuous outcome. Only include predictors that CHWs could know <i>before</i> measurement: household wealth, maternal education and height, sanitation, birth order/interval, prior illness. <b>2. Data & EDA.</b> Join the child, mother and household recodes on correct keys and check row counts. Flag implausible anthropometric values (|HAZ| > 6). Assess missingness. Explore bivariate relationships and confounding. Account for the complex design (strata, clusters, weights) when estimating prevalence. <b>3. Modelling & validation.</b> Start with an interpretable logistic regression baseline, then compare a random forest or gradient boosting. Use cross-validation <i>grouped by cluster/household</i>, because siblings and neighbours share unobserved factors and random splits leak. Optionally validate on a later survey round or held-out regions to test transportability. Tune inside the training folds only. <b>4. Metrics & threshold.</b> Missing a stunted child (FN) is costlier than an extra visit, so emphasise recall, choose the threshold to match CHW capacity (e.g. top 20% of risk), and report PR-AUC, calibration and subgroup performance. <b>5. Deployment & ethics.</b> <i>Pitfalls:</i> (i) DHS is cross-sectional and sampled, so deployment needs routine data from CHW/HMIS systems with the same features, and a distribution shift must be checked. (ii) Associations are not causal, so the model prioritises visits but does not explain what intervention will work. (iii) Leakage through cluster-level features or post-outcome variables. (iv) Fairness and stigmatisation of poor households. Comply with Law 058/2021, keep human judgement in the loop, and monitor and recalibrate periodically.",
  explanation: "A capstone question integrating the whole lifecycle (CRISP-DM), EDA, validation design, metric choice under asymmetric costs, and responsible deployment, as required by the course group project (question → data → EDA → model → report).",
  concepts: ["end-to-end lifecycle", "grouped validation", "metric choice", "deployment", "ethics"], source: "D1 p8, p22–23, p42; D3 p4; D4 p55–57"
}
]);
