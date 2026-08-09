# TAYA-STEPS model methods

TAYA-STEPS is an illustrative research translation model. Prototype preference coefficients are calibrated synthetic values and are not estimates copied from another discrete choice experiment.

## Preference model

For stakeholder group `g` and configuration `x`:

`V_g(x) = ASC_g + setting + beta_wait,g × waitWeeks + delivery + parent involvement + professional support + follow-up + beta_cost,g × costIn10DollarUnits + specified subgroup interactions`.

For support compared with no additional support:

`P_g(support) = exp(V_g) / [1 + exp(V_g)]`.

For multiple service alternatives plus neither, the implementation uses a numerically stable softmax.

## Family rules

The default balanced family rule applies 0.50 weight to youth utility and 0.50 to parent utility before the logistic transformation. Alternatives include youth perspective, parent perspective, youth-centred family at 0.70/0.30, and parent-constrained uptake as the minimum of youth and parent probabilities. These are prototype decision rules rather than empirical dyadic models.

## Reach

`offered = target population × offer rate`

`starters = offered × family-compatible uptake`

`completed = starters × completion rate`

`referred = starters × referral rate`

`referral completed = referred × referral completion rate`

## Cost and capacity

Resource minutes are mapped to loaded hourly costs by service setting. Family out-of-pocket cost is part of the preference scenario and is reported separately. MBS values are payer reference values only.

`productive service hours/FTE = 37.5 × 44 × 0.70 = 1,155` by default.

`FTE required = total direct-service hours / productive hours per FTE`.

Capacity status is available below 80% utilisation, tight from 80% to 100%, and exceeded above 100%.

## Budget impact

Annual variable service cost is grown by the selected nominal cost-growth assumption. Set-up cost applies in year one and annual maintenance applies in each year. Standard budget-impact totals are reported undiscounted.

## Exploratory economic value

`additional improved = completers × incremental improvement probability`

`health value = additional improved × QALY gain × value per QALY`

`total monetised benefit = health value + avoided health-service expenditure + optional broader benefit`

`net benefit = total monetised benefit - economic cost`

`BCR = total monetised benefit / economic cost`.

These calculations are exploratory scenario analyses and are not TAYA effectiveness or cost-effectiveness estimates.

## Preference-based monetary equivalents

For a preference attribute coefficient `beta_k` and the cost coefficient:

`monetary equivalent = -beta_k / beta_cost × AUD 10`.

This output is never added to monetised health benefits.

## Uncertainty and sensitivity

The simulation uses a deterministic seed of 20260808 by default. It varies outcome-relevant parameters within specified prototype ranges. Results report mean, median, 2.5th percentile and 97.5th percentile, plus probabilities of positive net benefit and BCR above one.

One-way sensitivity, threshold calculations and scenario stress tests support decision-sensitivity analysis. TAYA-STEPS does not label this as formal value-of-information analysis.

## Optimisation

The optimiser enumerates combinations of the seven preference attributes across specified levels, removes configurations that fail explicit constraints, calculates all model outputs, and identifies a Pareto frontier for higher uptake, lower cost, lower FTE demand and smaller equity gaps. No policy-value weights are assigned unless a user explicitly chooses them.
