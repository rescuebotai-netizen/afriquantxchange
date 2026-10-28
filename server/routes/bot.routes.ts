import { Router } from 'express';
import { startBot, stopBot, getBotStatus, predefinedStrategies } from '../services/bot.service.js';

const router = Router();

router.get('/strategies', (req, res) => {
  res.json({ strategies: predefinedStrategies });
});

router.get('/status', (req, res) => {
  res.json(getBotStatus());
});

router.post('/start', async (req, res) => {
  try {
    const { userId, strategyId } = req.body;
    if (!userId || !strategyId) {
      return res.status(400).json({ error: 'userId and strategyId are required' });
    }
    const result = await startBot(userId, strategyId);
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/stop', (req, res) => {
  try {
    const result = stopBot();
    res.json(result);
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

export default router;
