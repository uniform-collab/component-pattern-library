/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  CANVAS_DRAFT_STATE,
  CANVAS_PUBLISHED_STATE,
  enhance,
  EnhancerBuilder,
  type ComponentInstance,
} from '@uniformdev/canvas';
import { withUniformGetStaticProps, prependLocale } from '@uniformdev/canvas-next/route';
import { getBreadcrumbs, getProjectMapClient, getRouteClient } from '../utilities/canvas/canvasClients';
export { default } from '../components/BasePage';

type Clause = {
  op: string;
  source: string;
  rule: string;
  value: string;
};
// Doc: https://docs.uniform.app/docs/guides/composition/url-management/routing/slug-based-routing

const transformConditions = (parameters: any) => {
  const allConditions: any = {};
  let result: any = {};
  if (parameters) {
    // transformation the top level visibility rules

    if (parameters.$viz && parameters.$viz.value) {
      console.log('parameters.$viz value: ', parameters.$viz.value);

      allConditions.visibilityConditions = parameters.$viz.value;

      // IMPORTANT: resetting the visibility so Uniform won't precess it anymore
      parameters.$viz = {};
    }

    // transforming the parameterconditions
    for (const parameterName in parameters) {
      const parameter = parameters[parameterName];
      if (parameter) {
        if (!parameter.conditions) {
          continue;
        } else {
          result = {
            ...result,
            [parameterName]: parameter.conditions,
          };
          // parameter.conditions.forEach((condition: { when: { clauses: Clause[] }; value: string }) => {
          //   condition.when.clauses.forEach(clause => {
          //     if (clause?.op === 'is' && clause?.source === quirkName && clause?.rule === '$qk') {
          //       result = {
          //         ...result,
          //         [clause.value]: condition.value,
          //       };
          //     }
          //   });
          // });

          // allConditions = {
          //   parametersConditions: {
          //     ...allConditions,
          //     [parameterName]: result,
          //   },
          // };

          // IMPORTANT: resetting the conditions so Uniform won't process the quirks logic
          parameter.conditions = [];
        }
      }
    }
  }

  if (result) {
    allConditions.parametersConditions = result;
  }

  return allConditions;
};

const transformParametersConditionsEnhancer = ({ component }: { component: ComponentInstance }) => {
  return transformConditions(component?.parameters, 'viewport');
};

export const getStaticProps = withUniformGetStaticProps({
  requestOptions: context => ({
    state:
      Boolean(context.preview) || process.env.NODE_ENV === 'development' ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  }),
  param: 'slug',
  client: getRouteClient(),
  modifyPath: prependLocale,
  handleComposition: async (routeResponse, _context) => {
    const { composition, errors } = routeResponse.compositionApiResponse || {};

    if (errors?.some(e => e.type === 'data' || e.type === 'binding')) {
      return { notFound: true };
    }

    const preview = Boolean(_context.preview);
    const slug = _context.params?.slug;
    const breadcrumbs = await getBreadcrumbs({
      compositionId: composition._id,
      preview,
      dynamicTitle: composition?.parameters?.pageTitle?.value as string,
      urlSegments: typeof slug === 'string' ? slug?.split('/') : slug,
    });

    await enhance({
      composition,
      // adding a new propertyy to each component called conditionalValue, which can be access from the component props
      enhancers: new EnhancerBuilder().data('conditionalValue', transformParametersConditionsEnhancer),
      context: {
        preview: Boolean(_context.preview),
      },
    });

    //console.log('composition: ', JSON.stringify(composition?.slots?.pageContent, null, 1));

    return {
      props: { preview, data: composition || null, context: { breadcrumbs } },
      revalidate: 10,
    };
  },
});

export const getStaticPaths = async () => {
  const { nodes } = await getProjectMapClient().getNodes({
    state: process.env.NODE_ENV === 'development' ? CANVAS_DRAFT_STATE : CANVAS_PUBLISHED_STATE,
  });

  return {
    paths: nodes?.reduce((acc: string[], { path, type }) => (type === 'composition' ? [...acc, path] : acc), []) || [],
    fallback: 'blocking',
  };
};
