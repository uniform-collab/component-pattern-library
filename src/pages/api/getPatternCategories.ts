import { getCategoryClient } from '@/utilities/canvas/canvasClients';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    const client = getCategoryClient();
    const { categories } = await client.getCategories();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).send({ error: 'Failed to fetch data' });
  }
}
