/**
 * Vercel Serverless Function Entry Point (/api/[...path])
 * Chuyển tiếp toàn bộ request đến server/adapters/vercel
 */

import { dispatchVercelRequest, VercelLikeRequest, VercelLikeResponse } from '../server/adapters/vercel';

export default async function handler(req: VercelLikeRequest, res: VercelLikeResponse) {
  return dispatchVercelRequest(req, res);
}
