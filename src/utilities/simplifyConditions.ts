import {
  createQuirksVisibilityRule,
  evaluateNodeVisibilityParameter,
  evaluateVisibilityCriteriaGroup,
  VisibilityCriteriaGroup,
  VisibilityRules,
  type VisibilityParameterValue,
} from '@uniformdev/canvas';

type VisibilityConditionSimplified =
  | {
      mobile: boolean | null;
      tablet: boolean | null;
      desktop: boolean | null;
    }
  | undefined;

type ParameterConditionsSimplified = {
  [key: string]: {
    mobile: string | number | boolean;
    tablet: string | number | boolean;
    desktop: string | number | boolean;
  };
};

const evaluateVisibilityRuleForViewport = (
  viewport: string,
  criteriaGroup: VisibilityCriteriaGroup
): boolean | null => {
  const rules = createQuirksVisibilityRule({ viewport });
  return evaluateVisibilityCriteriaGroup({
    rules,
    criteriaGroup,
  });
};

export type SimplifiedConditions =
  | {
      visibility: VisibilityConditionSimplified;
      parameters: ParameterConditionsSimplified;
    }
  | undefined;

export const processConditions = (conditionalValue: any): SimplifiedConditions => {
  let visibilityConditions: VisibilityConditionSimplified;
  //let parametersConditions: ParameterConditionsSimplified;

  console.log('simplifyConditions', JSON.stringify(conditionalValue, null, 1));

  if (conditionalValue?.visibilityConditions?.criteria?.clauses) {
    visibilityConditions = {
      mobile: evaluateVisibilityRuleForViewport('mobile', conditionalValue?.visibilityConditions?.criteria),
      tablet: evaluateVisibilityRuleForViewport('tablet', conditionalValue?.visibilityConditions?.criteria),
      desktop: evaluateVisibilityRuleForViewport('desktop', conditionalValue?.visibilityConditions?.criteria),
    };
  }

  const results = {
    visibility: visibilityConditions,
    parameters: {},
  };

  console.log('simplifyConditions results', JSON.stringify(results, null, 1));

  return results;
};
