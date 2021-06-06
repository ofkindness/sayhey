import { Router, Response } from 'express';

const router = Router();

router.get('/', (_, res: Response) => {
  res.json({
    title: 'Webhook',
  });
});

export default router;
