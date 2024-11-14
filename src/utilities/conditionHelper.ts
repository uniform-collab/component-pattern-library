/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  ComponentInstance,
  createQuirksVisibilityRule,
  evaluateVisibilityCriteriaGroup,
  evaluateWalkTreePropertyCriteria,
  flattenValues,
  VisibilityCriteriaGroup,
  VisibilityRules,
  walkNodeTree,
} from '@uniformdev/canvas';
import { produce, setAutoFreeze } from 'immer';

type VisibilityConditionSimplified =
  | {
      mobile: boolean | null;
      tablet: boolean | null;
      desktop: boolean | null;
    }
  | undefined;

type ParameterConditionsSimplified =
  | {
      mobile: { [key: string]: string | number | boolean };
      tablet: { [key: string]: string | number | boolean };
      desktop: { [key: string]: string | number | boolean };
    }
  | undefined;

export type SimplifiedConditions =
  | {
      visibilityConditions?: VisibilityConditionSimplified;
      parametersConditions?: ParameterConditionsSimplified;
    }
  | undefined;

const viewportRules = {
  mobile: createQuirksVisibilityRule({ viewport: 'mobile' }),
  tablet: createQuirksVisibilityRule({ viewport: 'tablet' }),
  desktop: createQuirksVisibilityRule({ viewport: 'desktop' }),
};

export const transformConditions = ({ component }: { component: ComponentInstance }) => {
  // this is to prevent immutability issues
  setAutoFreeze(false);

  let allConditions: SimplifiedConditions = {};
  console.log('component name: ', component?.type);
  if (component?.parameters) {
    if (component.parameters?.$viz && component.parameters.$viz?.value) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const { criteria } = component.parameters.$viz.value as { criteria: any };
      allConditions.visibilityConditions = {
        mobile: evaluateVisibilityRuleForViewport('mobile', criteria),
        tablet: evaluateVisibilityRuleForViewport('tablet', criteria),
        desktop: evaluateVisibilityRuleForViewport('desktop', criteria),
      };

      delete component.parameters.$viz;
    }

    if (componentHasConditions(component)) {
      allConditions = {
        ...allConditions,
        parametersConditions: {
          mobile: evaluateParameterConditions(component, viewportRules.mobile),
          tablet: evaluateParameterConditions(component, viewportRules.tablet),
          desktop: evaluateParameterConditions(component, viewportRules.desktop),
        },
      };
    }

    console.log('evaludated conditons: ', allConditions);
  }

  return allConditions;
};

const componentHasConditions = (component: ComponentInstance) => {
  for (const parameterName in component?.parameters) {
    const parameter = component.parameters[parameterName];
    if (parameter && parameter.conditions) {
      return true;
    }
  }
  return false;
};
const evaluateVisibilityRuleForViewport = (viewport: string, criteriaGroup: VisibilityCriteriaGroup) => {
  const rules = createQuirksVisibilityRule({ viewport, province: 'ON' });
  return evaluateVisibilityCriteriaGroup({
    rules,
    criteriaGroup,
  });
};

function evaluateParameterConditions(component: ComponentInstance, rules: VisibilityRules): { [key: string]: any } {
  // evaluateWalkTreePropertyCriteria({ node: component, rules });

  const resultingComponent = produce(component, draft => {
    walkNodeTree(draft, ({ node }) => {
      evaluateWalkTreePropertyCriteria({ node, rules });
    });
  });

  const result = flattenValues(resultingComponent) as { [key: string]: any };
  console.log('resultingComponent: ', result);
  return result;
}
