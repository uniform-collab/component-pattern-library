/* eslint-disable @typescript-eslint/no-explicit-any */
import { CANVAS_DRAFT_STATE, CANVAS_PUBLISHED_STATE, enhance, EnhancerBuilder } from '@uniformdev/canvas';
import { prependLocale, withUniformGetStaticProps } from '@uniformdev/canvas-next/route';

import { transformConditions } from '@/utilities/conditionHelper';
import { getBreadcrumbs, getProjectMapClient, getRouteClient } from '../utilities/canvas/canvasClients';
export { default } from '../components/BasePage';

// Doc: https://docs.uniform.app/docs/guides/composition/url-management/routing/slug-based-routing

export const getStaticProps = withUniformGetStaticProps({
  requestOptions: context => ({
    diagnostics: true,
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
    // console.log('composition before: ', JSON.stringify(composition?.slots?.pageContent, null, 1));

    await enhance({
      composition,
      // adding a new propertyy to each component called conditionalValue with the results of processing conditions for each viewport quirk, which can be access from the component props
      enhancers: new EnhancerBuilder().data('conditionalValue', transformConditions),
      context: {
        preview: Boolean(_context.preview),
      },
    });

    // console.log('composition after: ', JSON.stringify(composition?.slots?.pageContent, null, 1));

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
