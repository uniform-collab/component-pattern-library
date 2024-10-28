import { getCanvasClient } from '@/utilities/canvas/canvasClients';
import { CANVAS_PUBLISHED_STATE } from '@uniformdev/canvas';
import type { NextApiRequest, NextApiResponse } from 'next';

async function getCompositions(keyword: string, categories: string[]) {
  const cClient = await getCanvasClient();
  console.log('keyword: ', keyword, 'categories: ', categories);

  const data = await cClient?.getCompositionList({
    state: CANVAS_PUBLISHED_STATE,
    pattern: true,
    skipPatternResolution: false,
    skipOverridesResolution: true,
    withComponentIDs: false,
    search: keyword,
    withTotalCount: true,
    categories: categories.length == 0 ? undefined : categories,
    resolveData: true,
  });

  return data;
}
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { keyword, categories } = req.body;
  console.log('keyword: ', keyword, 'categories: ', categories);

  try {
    const data = await getCompositions(keyword, categories);
    res.status(200).json(data);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch data' });
  }
}
