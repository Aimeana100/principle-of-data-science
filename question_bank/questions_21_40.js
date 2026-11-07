/* DSC6131 Principles of Data Science — Question Bank, Batch 2 (Q21–40)
   Topics: sampling, inference, probability, relationships, causality, reliability, visualisation, databases, pipelines. */
window.QUESTION_BANK = (window.QUESTION_BANK || []).concat([
{
  id: 21, topic: "Sampling & sampling bias", difficulty: "Foundational", category: "Conceptual", type: "mcq",
  question: "NISR plans a household survey and divides the population by province, then draws a random sample independently within each province. What is the main statistical advantage of this stratified design over a simple random sample of the same size?",
  options: [
    "It removes all non-response bias.",
    "It guarantees representation of every province and, when strata are internally homogeneous, reduces the variance of national estimates.",
    "It makes the sample cheaper because only some provinces are visited.",
    "It allows causal conclusions to be drawn without randomised treatment."
  ],
  answer: 1,
  modelAnswer: "Stratification ensures each stratum is represented and improves precision when the stratification variable is related to the outcome.",
  explanation: "In <b>stratified</b> sampling, the total variance is a weighted sum of within-stratum variances; between-stratum variation is removed from the estimator's error, so precision improves when strata differ from one another. It also allows reliable sub-national estimates. Option 3 describes <b>cluster</b> sampling (selecting only some groups), which usually lowers cost but <i>increases</i> variance (design effect > 1). Stratification does not fix non-response, and causal inference requires randomised treatment assignment, not random sampling.",
  concepts: ["stratified sampling", "cluster sampling", "precision"], source: "D5 §2.1–2.2"
},
{
  id: 22, topic: "Sampling & sampling bias", difficulty: "Intermediate", category: "Case study", type: "mcq",
  scenario: "A start-up estimates the rural poverty rate by sending an SMS questionnaire to 50,000 randomly selected numbers from a mobile operator's subscriber list. 9,000 people reply.",
  question: "Which statement best describes the main threats to validity and the likely direction of bias?",
  options: [
    "There is no bias because the numbers were selected randomly and the sample is very large.",
    "Coverage (frame) bias and non-response bias: the poorest households are less likely to own phones or reply, so poverty is likely underestimated.",
    "Only random sampling error: a larger sample would fix the problem.",
    "Measurement bias only: SMS questions are always misunderstood, so poverty is overestimated."
  ],
  answer: 1,
  modelAnswer: "Coverage and non-response (self-selection) biases; poverty is likely underestimated. A large n does not fix systematic bias.",
  explanation: "Randomisation is from the <i>subscriber list</i>, not the target population (all rural households). Households without phones are excluded, which is undercoverage. Of those contacted only 18% respond, and responders likely differ systematically (literacy, airtime, engagement), which is non-response bias. Both mechanisms remove poorer households, biasing the estimate <b>downward</b>. Bias does not shrink with n: a huge biased sample yields a precise wrong answer. Mitigations: an area-based frame (e.g. census enumeration areas), mixed modes, post-stratification/raking weights to known census margins, and non-response follow-up.",
  concepts: ["coverage bias", "non-response bias", "sampling frame", "bias vs variance"], source: "D5 §2.1–2.2; D5 §8.1"
},
{
  id: 23, topic: "Inferential statistics", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "A random sample of n = 100 households has mean monthly consumption x̄ = 85 (’000 RWF) and sample standard deviation s = 20. Use t₀.₀₂₅,₉₉ = 1.984.",
  question: "Compute the <b>upper limit</b> of the 95% confidence interval for the population mean (’000 RWF, two decimals).",
  answer: 88.97, tolerance: 0.06, unit: "’000 RWF",
  modelAnswer: "SE = 20/√100 = 2; upper limit = 85 + 1.984 × 2 = 88.97 (z-approximation gives 88.92).",
  explanation: "CI = x̄ ± t* · s/√n.<br>SE = 20 / 10 = 2.0; margin = 1.984 × 2 = 3.968.<br>95% CI = [81.03, <b>88.97</b>].<br><b>Correct interpretation:</b> if we repeated the sampling procedure many times, 95% of intervals built this way would contain the true mean μ. It is <i>not</i> 'a 95% probability that μ lies in this particular interval' (μ is fixed in the frequentist framework). Assumptions: random sampling and independence, and an approximately normal sampling distribution (reasonable here by the CLT with n = 100). For a complex survey with clustering, the SE must include the design effect.",
  concepts: ["confidence interval", "standard error", "t-distribution", "CLT"], source: "D3 p33; D5 §4.1"
},
{
  id: 24, topic: "Inferential statistics", difficulty: "Intermediate", category: "Conceptual", type: "tf",
  question: "True or false: A p-value of 0.03 means there is a 3% probability that the null hypothesis is true.",
  answer: false,
  modelAnswer: "False. The p-value is P(data at least as extreme as observed | H₀ true), not P(H₀ | data).",
  explanation: "The p-value is computed <i>assuming</i> H₀ is true. It measures how surprising the observed data would be under H₀. Turning it into P(H₀ | data) would require Bayes' theorem and a prior probability for H₀ (compare the base-rate fallacy). A p-value also says nothing about the size or practical importance of an effect. The ASA statement (2016) recommends reporting effect sizes and confidence intervals alongside p-values and avoiding bright-line thinking at 0.05.",
  concepts: ["p-value", "hypothesis testing", "misinterpretation"], source: "D3 p33; D5 §4.2"
},
{
  id: 25, topic: "Inferential statistics", difficulty: "Advanced", category: "Analytical", type: "multi",
  question: "Which statements about Type I/II errors and statistical power are correct? (Select all that apply.)",
  options: [
    "Holding effect size and α fixed, increasing the sample size increases power.",
    "Lowering α from 0.05 to 0.01, other things equal, increases the probability of a Type II error.",
    "Power equals 1 − β, the probability of rejecting H₀ when a specified alternative is true.",
    "A non-significant result (p = 0.40) proves the null hypothesis is true.",
    "With very large samples, trivially small effects can be statistically significant, so effect sizes must be reported."
  ],
  answer: [0, 1, 2, 4],
  modelAnswer: "Statements 1, 2, 3 and 5 are correct; 4 is false.",
  explanation: "A <b>Type I error</b> (α) rejects a true H₀; a <b>Type II error</b> (β) fails to reject a false H₀. Power = 1 − β, which increases with n, effect size and α, and decreases with outcome variance. Making α stricter enlarges the acceptance region, so β rises. 'Absence of evidence is not evidence of absence': a non-significant result may simply reflect low power; equivalence testing (TOST) is needed to support 'no meaningful effect'. With n in the hundreds of thousands (e.g. MoMo logs), SE → 0 and negligible differences become significant, so practical significance (effect size, CI) must be judged separately.",
  concepts: ["Type I/II error", "power", "effect size", "statistical vs practical significance"], source: "D3 p33; D5 §4.2"
},
{
  id: 26, topic: "Variable relationships & association", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "A survey of 500 adults cross-tabulates area and internet use:<br><table class='qtable'><tr><th></th><th>Uses internet</th><th>Does not</th><th>Total</th></tr><tr><td>Urban</td><td>120</td><td>80</td><td>200</td></tr><tr><td>Rural</td><td>90</td><td>210</td><td>300</td></tr><tr><td>Total</td><td>210</td><td>290</td><td>500</td></tr></table>",
  question: "Compute the Pearson χ² statistic for independence (no continuity correction), to two decimals.",
  answer: 44.33, tolerance: 0.05, unit: "",
  modelAnswer: "χ² ≈ 44.33 with df = 1 (p < 0.001); Cramér's V ≈ 0.30; odds ratio = 3.5.",
  explanation: "<b>Expected counts</b> E = (row total × column total)/N: Urban–uses = 200×210/500 = 84; Urban–not = 116; Rural–uses = 126; Rural–not = 174.<br>Every |O − E| = 36.<br>χ² = Σ (O−E)²/E = 1296 × (1/84 + 1/116 + 1/126 + 1/174) = 1296 × 0.034209 = <b>44.33</b>.<br>df = (2−1)(2−1) = 1, so p ≈ 3×10⁻¹¹: reject independence.<br><b>Strength:</b> Cramér's V = √(χ²/(N·(min(r,c)−1))) = √(44.33/500) = 0.30 (moderate).<br><b>Direction:</b> odds of internet use are 120/80 = 1.5 (urban) vs 90/210 = 0.43 (rural), OR = 3.5.<br>Assumptions: independent observations and all expected counts ≥ 5 (satisfied). A significant χ² shows association, not causation: urban residence may proxy for income or education.",
  concepts: ["χ² test of independence", "expected counts", "Cramér's V", "odds ratio"], source: "D3 p21–22"
},
{
  id: 27, topic: "Inferential statistics", difficulty: "Advanced", category: "Critical thinking", type: "short",
  question: "You compare mean household consumption across five provinces. (a) Why might you prefer Welch's test over the classical Student t-test when comparing two provinces? (b) For all five provinces you run a one-way ANOVA and obtain p < 0.001. What exactly can you conclude, what should you do next, and what assumptions must be checked?",
  keyPoints: [
    "(a) Student's t assumes equal population variances; Welch's t does not (adjusts df via Welch–Satterthwaite), so it is robust when variances/sample sizes differ — a safe default",
    "(b) ANOVA's H₀ is that all five means are equal; rejecting it only says at least one mean differs, not which ones",
    "Next: post-hoc pairwise comparisons with multiplicity control (e.g. Tukey HSD, Games–Howell if variances unequal) and an effect size (η²)",
    "Assumptions: independence, approximately normal residuals within groups (or large n), homogeneity of variance (Levene test; use Welch ANOVA if violated)",
    "If assumptions fail badly (strong skew/outliers): transform (log) or use Kruskal–Wallis; for survey data account for design/weights"
  ],
  modelAnswer: "(a) Student's two-sample t-test pools the variances and assumes σ₁² = σ₂². When variances differ, especially with unequal group sizes, its Type I error rate becomes inaccurate. Welch's test uses separate variances and Satterthwaite-adjusted degrees of freedom and loses almost no power when variances are equal, so it is the recommended default (R's <code>t.test</code> default). (b) A significant one-way ANOVA (F-test) only rejects H₀: μ₁ = … = μ₅; it shows at least one province mean differs. Next, run post-hoc comparisons that control the family-wise error rate (Tukey HSD, or Games–Howell under unequal variances) and report an effect size such as η² = SS_between/SS_total. Check independence of observations, approximate normality of residuals (Q–Q plot), and equal variances (Levene's test or residual plots). If violated, use Welch's ANOVA, a log transform for skewed consumption, or the Kruskal–Wallis test, and use survey-weighted methods for complex designs.",
  explanation: "Examiners reward precise statements of H₀, recognition of the multiple-comparison problem, and a clear assumption → diagnostic → remedy chain.",
  concepts: ["Welch t-test", "one-way ANOVA", "post-hoc tests", "assumptions"], source: "D3 p19–20; D5 §4.4"
},
{
  id: 28, topic: "Variable relationships & association", difficulty: "Intermediate", category: "Practical application", type: "mcq",
  question: "You want to know whether household monthly consumption (continuous, interval/ratio) differs across Rwanda's five provinces (nominal). Which analysis is most appropriate as a first choice?",
  options: [
    "Pearson correlation between province code (1–5) and consumption",
    "χ² test of independence on the raw consumption values",
    "One-way ANOVA (or Kruskal–Wallis if assumptions fail), with grouped box plots",
    "Simple linear regression of consumption on the numeric province code"
  ],
  answer: 2,
  modelAnswer: "One-way ANOVA / Kruskal–Wallis, visualised with side-by-side box plots.",
  explanation: "The choice of tool follows the measurement level of each variable: interval outcome × categorical predictor → compare group means (t-test for 2 groups, ANOVA for > 2) or distributions (Kruskal–Wallis). Treating province codes 1–5 as numeric imposes a meaningless order and spacing, so Pearson r and regression on the raw code are invalid (dummy coding would make the regression equivalent to ANOVA). χ² requires two categorical variables. For two interval variables use correlation/scatter plots; for two categorical variables use χ² and mosaic or stacked bar charts.",
  concepts: ["choosing statistical tests", "measurement level", "ANOVA"], source: "D3 p15, 19"
},
{
  id: 29, topic: "Statistical models & regression", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "Across 40 plots, the correlation between seasonal rainfall (mm) and maize yield (t/ha) is r = 0.8. The standard deviation of rainfall is 100 mm and of yield is 0.5 t/ha.",
  question: "Using simple linear regression of yield on rainfall, by how many t/ha is yield expected to change for an <b>additional 100 mm</b> of rainfall?",
  answer: 0.4, tolerance: 0.001, unit: "t/ha",
  modelAnswer: "b₁ = r·(s_y/s_x) = 0.8 × 0.5/100 = 0.004 t/ha per mm, i.e. 0.4 t/ha per 100 mm.",
  explanation: "The OLS slope can be written b₁ = r · s_y / s_x = 0.8 × (0.5/100) = 0.004 t/ha per mm. Multiply by 100 to get <b>0.4 t/ha</b> per extra 100 mm.<br>R² = r² = 0.64: 64% of the variance in yield is accounted for by the linear relationship with rainfall.<br><b>Interpretation caveats:</b> this is an average association within the observed rainfall range. Predicting far outside it (e.g. 2,000 mm, with waterlogging) is extrapolation. Causal interpretation requires ruling out confounders (soil, altitude). Inference on b₁ assumes linearity, independence, constant variance and approximately normal residuals, checked with residual plots.",
  concepts: ["regression slope", "correlation", "R²", "extrapolation"], source: "D3 p31–32; D2 p40"
},
{
  id: 30, topic: "Variable relationships & association", difficulty: "Advanced", category: "Critical thinking", type: "mcq",
  scenario: "An analyst reports a Pearson correlation of r = 0.04 between fertiliser dose and maize yield across 300 plots and concludes: 'fertiliser has no relationship with yield'. The scatter plot shows yield rising with dose up to a point and then falling sharply at very high doses (an inverted U).",
  question: "Which is the best critique?",
  options: [
    "The conclusion is correct because |r| < 0.1 indicates no association.",
    "Switching to Spearman's ρ would detect the relationship, because it handles non-linearity.",
    "Pearson's r only measures linear association; a strong non-monotonic relationship can give r ≈ 0. Model the curvature (e.g. quadratic term or spline) and always plot the data.",
    "The sample is too small; with more plots r would become significant."
  ],
  answer: 2,
  modelAnswer: "Pearson's r captures only linear association; an inverted-U relation can yield r ≈ 0. Plot the data and model the non-linearity.",
  explanation: "Pearson's r = cov(X,Y)/(s_X s_Y) measures the strength of a <i>linear</i> relationship. In a symmetric inverted U, positive and negative slopes cancel. Spearman's ρ measures <i>monotonic</i> association and would also be near zero for a non-monotonic curve, which is why option 2 is a distractor. Anscombe's quartet makes the same point: identical r, very different patterns. A quadratic regression (yield ~ dose + dose²), a spline/GAM, or a measure such as distance correlation would capture the relationship. Agronomically, the optimum dose is the substantive finding.",
  concepts: ["Pearson vs Spearman", "non-linearity", "Anscombe's quartet"], source: "D3 p16–18"
},
{
  id: 31, topic: "Correlation & causality", difficulty: "Intermediate", category: "Analytical", type: "mcq",
  question: "Across districts, the number of health centres is strongly positively correlated with the number of reported malaria cases. Which explanation should be considered <b>first</b> before concluding that health centres 'cause' malaria?",
  options: [
    "Reverse causation is impossible here, so the correlation must be causal.",
    "A confounder such as population size (and greater reporting capacity) drives both the number of centres and the number of reported cases.",
    "The correlation is due to a collider, so it should be ignored.",
    "Correlation coefficients above 0.7 always imply causation."
  ],
  answer: 1,
  modelAnswer: "Confounding by population size (and reporting/ascertainment). Use rates per 1,000 people and adjust for exposure.",
  explanation: "Correlation between X and Y may arise from (i) X → Y, (ii) Y → X (reverse causation: high malaria burden leads authorities to build centres), (iii) a common cause Z → X and Z → Y (confounding), (iv) selection/collider bias, or (v) chance. Larger districts have more people, hence more centres <i>and</i> more cases. More centres also mean more cases are <i>detected and reported</i> (ascertainment bias). Normalising to incidence per 1,000 population and adjusting for confounders are the first steps; a causal claim needs a design such as an RCT, DiD or a defensible DAG-based adjustment.",
  concepts: ["confounding", "reverse causation", "ascertainment bias"], source: "D3 p28"
},
{
  id: 32, topic: "Correlation & causality", difficulty: "Advanced", category: "Analytical", type: "multi",
  scenario: "You want the <b>total causal effect</b> of years of education (X) on adult income (Y) from observational data. Your DAG: Parental wealth → X, Parental wealth → Y; Region of birth → X, Region of birth → Y; X → Occupation → Y; X → 'Selected into a professional-association survey' ← Y.",
  question: "Which variables should you adjust (condition) for? (Select all that apply.)",
  options: [
    "Parental wealth",
    "Region of birth",
    "Occupation",
    "Membership of the professional-association survey sample"
  ],
  answer: [0, 1],
  modelAnswer: "Adjust for the confounders (parental wealth, region of birth) only.",
  explanation: "<b>Confounders</b> (common causes of X and Y) open back-door paths; adjusting for them blocks those paths, so adjust for parental wealth and region. <b>Occupation is a mediator</b> (X → M → Y); conditioning on it removes part of the effect you want, estimating only the direct effect. <b>Survey membership is a collider</b> (X → C ← Y); conditioning on it (e.g. analysing only that sample) opens a non-causal path and induces spurious association (selection/collider bias). The rule of thumb: adjust for confounders, not mediators (for total effects) and never colliders. The back-door criterion formalises this.",
  concepts: ["DAGs", "confounder/mediator/collider", "back-door criterion"], source: "D3 p29"
},
{
  id: 33, topic: "Correlation & causality", difficulty: "Intermediate", category: "Calculation", type: "numeric",
  scenario: "A nutrition programme is introduced in District A but not District B. Mean child height-for-age scores (arbitrary index):<br>District A: before 40, after 52.<br>District B (comparison): before 38, after 44.",
  question: "Compute the difference-in-differences (DiD) estimate of the programme effect.",
  answer: 6, tolerance: 0.001, unit: "index points",
  modelAnswer: "DiD = (52 − 40) − (44 − 38) = 12 − 6 = 6 points.",
  explanation: "DiD = (Ȳ_A,after − Ȳ_A,before) − (Ȳ_B,after − Ȳ_B,before) = 12 − 6 = <b>6</b>.<br>The comparison district's change (6) estimates what would have happened in A without the programme (secular trends such as economic growth). A naive before–after comparison in A (12) would double the estimated effect.<br><b>Key assumption — parallel trends:</b> absent treatment, both districts would have followed the same trend. Check with pre-intervention data from several periods. Threats: other programmes starting at the same time in A, composition changes, spillovers to B. In regression form: Y = β₀ + β₁·Treat + β₂·Post + β₃·(Treat×Post) + ε, where β₃ is the DiD estimate.",
  concepts: ["difference-in-differences", "parallel trends", "counterfactual"], source: "D3 p2, p28–29"
},
{
  id: 34, topic: "Research methodology & measurement", difficulty: "Advanced", category: "Calculation", type: "numeric",
  scenario: "Two enumerators independently classify 200 households as poor or non-poor:<br><table class='qtable'><tr><th></th><th>B: poor</th><th>B: non-poor</th></tr><tr><td>A: poor</td><td>60</td><td>25</td></tr><tr><td>A: non-poor</td><td>15</td><td>100</td></tr></table>",
  question: "Compute Cohen's κ (three decimals).",
  answer: 0.584, tolerance: 0.005, unit: "",
  modelAnswer: "pₒ = 0.80, pₑ = 0.519, κ = (0.80 − 0.519)/(1 − 0.519) ≈ 0.584 (moderate agreement).",
  explanation: "Observed agreement pₒ = (60 + 100)/200 = 0.80.<br>Marginals: A poor = 85/200 = 0.425; B poor = 75/200 = 0.375.<br>Chance agreement pₑ = 0.425×0.375 + 0.575×0.625 = 0.1594 + 0.3594 = 0.51875.<br>κ = (pₒ − pₑ)/(1 − pₑ) = 0.28125/0.48125 = <b>0.584</b>.<br>Landis & Koch: 0.41–0.60 is 'moderate'. Despite 80% raw agreement, about half of that is expected by chance, so the classification protocol needs clearer criteria or enumerator training. Remember: <b>reliability ≠ validity</b>. Even κ = 0.95 would not show that the enumerators classify poverty <i>correctly</i>, only consistently. κ also depends on prevalence (the 'kappa paradox').",
  concepts: ["Cohen's kappa", "inter-rater reliability", "reliability vs validity"], source: "D3 p24–26"
},
{
  id: 35, topic: "Probability & distributions", difficulty: "Foundational", category: "Calculation", type: "numeric",
  scenario: "Assume each of 5 randomly selected adults independently uses mobile money with probability p = 0.3.",
  question: "What is the probability that <b>exactly 2</b> of the 5 use mobile money? (four decimals)",
  answer: 0.3087, tolerance: 0.0005, unit: "",
  modelAnswer: "P(X = 2) = C(5,2)·0.3²·0.7³ = 10 × 0.09 × 0.343 = 0.3087.",
  explanation: "X ~ Binomial(n = 5, p = 0.3), P(X = k) = C(n,k) pᵏ (1−p)ⁿ⁻ᵏ.<br>C(5,2) = 10; 0.3² = 0.09; 0.7³ = 0.343 → 10 × 0.09 × 0.343 = <b>0.3087</b>.<br>Mean = np = 1.5, variance = np(1−p) = 1.05.<br>The binomial model assumes a fixed n, independent trials and a constant p. If the 5 adults came from the same household, independence would fail (intra-cluster correlation), which is why survey data with clustering need design-based variance estimates. In R: <code>dbinom(2, 5, 0.3)</code>.",
  concepts: ["binomial distribution", "independence", "discrete distributions"], source: "D5 §3.4–3.5"
},
{
  id: 36, topic: "Data visualisation", difficulty: "Foundational", category: "Conceptual", type: "mcq",
  question: "According to Cleveland & McGill's research on graphical perception, which visual encoding allows viewers to judge quantitative values <b>most accurately</b>?",
  options: [
    "Angle (as in pie charts)",
    "Colour saturation",
    "Position along a common aligned scale (as in dot plots or bar charts)",
    "Area (as in bubble charts)"
  ],
  answer: 2,
  modelAnswer: "Position on a common scale.",
  explanation: "Ranking from most to least accurate: position on a common scale → position on non-aligned scales → length → angle/slope → area → volume → colour hue/saturation. This is why bar and dot charts generally outperform pie and bubble charts for comparing values. Colour is better reserved for categories or for secondary emphasis. Choose the encoding that maps the most important comparison onto the most accurate channel.",
  concepts: ["visual encoding", "graphical perception"], source: "D3 p36"
},
{
  id: 37, topic: "Data visualisation", difficulty: "Intermediate", category: "Critical thinking", type: "multi",
  scenario: "A ministry report includes: (i) a bar chart of district vaccination coverage whose y-axis starts at 85%; (ii) a 3-D exploded pie chart of budget shares for nine programmes; (iii) a choropleth of sector poverty rates using a rainbow (jet) colour scale; (iv) a bar chart sorted from highest to lowest with values labelled directly; (v) a line chart of monthly cases with the y-axis starting above zero to show seasonal variation.",
  question: "Which elements are genuine graphical-integrity or readability problems? (Select all that apply.)",
  options: ["(i) truncated bar chart axis", "(ii) 3-D exploded pie", "(iii) rainbow scale for ordered data", "(iv) sorted, directly labelled bars", "(v) non-zero line-chart axis"],
  answer: [0, 1, 2],
  modelAnswer: "(i), (ii) and (iii) are problems; (iv) is good practice and (v) is acceptable.",
  explanation: "(i) Bars encode value by <i>length</i>, so a truncated axis exaggerates differences (Tufte's lie factor). Bar charts should start at zero. (ii) 3-D perspective distorts angles and areas, which are already weak encodings, and nine slices are hard to compare; use a sorted bar chart. (iii) Rainbow scales are not perceptually ordered, create false boundaries and are not colour-blind safe; use a sequential palette (e.g. viridis) for ordered values. (iv) Sorting and direct labelling aid comparison. (v) Line charts encode values by <i>position</i>, not length, so a non-zero baseline is acceptable when the aim is to show variation, provided the axis is clearly labelled.",
  concepts: ["graphical integrity", "lie factor", "colour palettes", "chart choice"], source: "D3 p35–38"
},
{
  id: 38, topic: "Databases & SQL", difficulty: "Foundational", category: "Practical application", type: "mcq",
  scenario: "Tables: <code>visits(visit_id, patient_id, district, cost, visit_date)</code>.",
  question: "Which SQL query returns the five districts with the highest <b>average</b> visit cost in 2025, but only for districts with at least 100 visits that year?",
  options: [
    "SELECT district, AVG(cost) FROM visits WHERE AVG(cost) > 100 GROUP BY district LIMIT 5;",
    "SELECT district, AVG(cost) AS avg_cost FROM visits WHERE visit_date BETWEEN '2025-01-01' AND '2025-12-31' GROUP BY district HAVING COUNT(*) >= 100 ORDER BY avg_cost DESC LIMIT 5;",
    "SELECT district, cost FROM visits ORDER BY cost DESC LIMIT 5;",
    "SELECT district, AVG(cost) AS avg_cost FROM visits GROUP BY district HAVING visit_date >= '2025-01-01' ORDER BY avg_cost LIMIT 5;"
  ],
  answer: 1,
  modelAnswer: "Option 2: filter rows with WHERE, aggregate with GROUP BY, filter groups with HAVING, then ORDER BY … DESC LIMIT 5.",
  explanation: "Logical order of evaluation: FROM → WHERE (row filter) → GROUP BY → HAVING (group filter on aggregates) → SELECT → ORDER BY → LIMIT. Aggregates such as AVG() cannot appear in WHERE (option 1). Option 3 returns the five most expensive individual visits, not district averages. Option 4 filters a non-aggregated column in HAVING and sorts ascending. An index on (visit_date) or (district, visit_date) would speed up such queries on large tables.",
  concepts: ["SQL GROUP BY", "WHERE vs HAVING", "aggregation"], source: "D2 p15–17"
},
{
  id: 39, topic: "Databases & SQL", difficulty: "Intermediate", category: "Practical application", type: "short",
  scenario: "A coffee washing station keeps a single table:<br><code>deliveries(delivery_id, farmer_id, farmer_name, farmer_phone, coop_id, coop_name, coop_district, delivery_date, kg, price_per_kg)</code><br>where price_per_kg is fixed by the station for each date.",
  question: "Identify the update, insertion and deletion anomalies this design causes, and decompose the table into Third Normal Form (3NF), stating the primary and foreign keys.",
  keyPoints: [
    "Update anomaly: a farmer's phone or a cooperative's name/district is repeated on many rows, so changing it requires updating all rows (risk of inconsistency)",
    "Insertion anomaly: cannot record a new farmer or cooperative (or a day's price) until a delivery exists",
    "Deletion anomaly: deleting a farmer's only delivery loses the farmer's (or cooperative's) details",
    "Transitive/partial dependencies: farmer_id → farmer_name, phone, coop_id; coop_id → coop_name, coop_district; delivery_date → price_per_kg",
    "3NF: farmers(farmer_id PK, farmer_name, farmer_phone, coop_id FK); cooperatives(coop_id PK, coop_name, coop_district); daily_prices(delivery_date PK, price_per_kg); deliveries(delivery_id PK, farmer_id FK, delivery_date FK, kg)"
  ],
  modelAnswer: "<b>Anomalies.</b> <i>Update</i>: farmer and cooperative attributes repeat on every delivery, so changing a phone number or cooperative name in one row but not others creates inconsistency. <i>Insertion</i>: a newly registered farmer, cooperative or the day's price cannot be stored without a delivery row (or with NULL keys). <i>Deletion</i>: removing the last delivery of a farmer also deletes the only record of that farmer and possibly the cooperative. <b>Dependencies.</b> delivery_id → all attributes; farmer_id → farmer_name, farmer_phone, coop_id; coop_id → coop_name, coop_district; delivery_date → price_per_kg. These are transitive dependencies on the key, which violates 3NF. <b>3NF design.</b> <code>cooperatives(coop_id PK, coop_name, coop_district)</code>; <code>farmers(farmer_id PK, farmer_name, farmer_phone, coop_id FK → cooperatives)</code>; <code>daily_prices(delivery_date PK, price_per_kg)</code>; <code>deliveries(delivery_id PK, farmer_id FK → farmers, delivery_date FK → daily_prices, kg)</code>. Delivery value is derived in a query (kg × price) rather than stored.",
  explanation: "1NF requires atomic values with no repeating groups. 2NF removes partial dependencies on part of a composite key. 3NF removes transitive dependencies (non-key → non-key). In analytics warehouses, star schemas deliberately <i>denormalise</i> dimensions for query speed, which is a conscious OLTP vs OLAP trade-off.",
  concepts: ["normalisation", "functional dependencies", "anomalies", "primary/foreign keys"], source: "D2 p12–14"
},
{
  id: 40, topic: "Data pipelines & storage", difficulty: "Advanced", category: "Case study", type: "short",
  question: "Compare (i) a national monthly Consumer Price Index (CPI) production system with (ii) a network of river-level sensors used to send flood warnings. For each, recommend batch or streaming processing and ETL or ELT, and justify your choice with reference to latency, data volume/velocity, data-quality control and storage (warehouse vs data lake).",
  keyPoints: [
    "CPI: batch (monthly price collection; latency of days is acceptable); emphasis on validation and reproducibility",
    "CPI: ETL into a structured data warehouse/star schema is suitable — fixed schema, curated, quality-checked before loading, supports OLAP queries and audit",
    "Flood sensors: streaming (high velocity, decisions within minutes; windowed aggregation and threshold/anomaly alerts, e.g. Kafka/Spark Streaming)",
    "Flood sensors: ELT/raw landing in a data lake (or time-series store) keeps raw readings for re-processing and model retraining; light real-time validation (range checks, sensor-failure detection) in-stream",
    "Trade-offs: streaming is more complex and costly; batch is simpler and more auditable; both need monitoring, lineage and data-quality alerts"
  ],
  modelAnswer: "<b>CPI</b>: prices are collected on a monthly cycle and the index is published on a fixed calendar, so <b>batch</b> processing suffices. Accuracy, auditability and methodological consistency matter more than seconds. <b>ETL</b> fits: extract price returns, transform (validate ranges, impute missing quotes, apply basket weights), then load curated tables into a <b>data warehouse</b> (star schema: fact_price × dim_item × dim_market × dim_month) for OLAP analysis and reproducible publication. <b>Flood sensors</b>: readings arrive continuously and a warning is only useful if it arrives within minutes, so <b>streaming</b> is required (e.g. Kafka → Spark Structured Streaming/Flink), with sliding-window aggregation, threshold rules or anomaly detection, and SMS alerts. Use lightweight in-stream validation (impossible values, flat-lining sensors) and land raw data in a <b>data lake</b> or time-series store (<b>ELT</b>), so historical data can be reprocessed and used to retrain prediction models. Streaming adds operational complexity (exactly-once semantics, late/out-of-order data), so it is justified only by the latency requirement. Both systems need orchestration, monitoring, lineage and data-quality dashboards.",
  explanation: "The key decision variable is <b>required latency</b>, not data size. ETL transforms before loading (schema-on-write, curated); ELT loads raw data first and transforms in the target (schema-on-read, flexible, suited to lakes and cloud warehouses).",
  concepts: ["batch vs streaming", "ETL vs ELT", "data warehouse vs data lake", "pipeline design"], source: "D2 p58–61, 71–74"
}
]);
