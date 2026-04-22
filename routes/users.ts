import { Router } from 'express';
import { db } from '../lib/index.js';
import { aspnetusers } from '../lib/db/schema.js';

const router = Router();

router.get('/', async (req, res) => {
  const allUsers = await db.select().from(aspnetusers).limit(10);
  res.json(allUsers);
});

export default router;