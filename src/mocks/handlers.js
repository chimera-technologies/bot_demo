import { rest } from 'msw'; // ✅ Correct for browser-based MSW
import db from '../../public/db/db.json';

export const handlers = [
  rest.get('/api/users', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(db.users));
  }),

  rest.get('/api/products', (req, res, ctx) => {
    return res(ctx.status(200), ctx.json(db.products));
  })
];
