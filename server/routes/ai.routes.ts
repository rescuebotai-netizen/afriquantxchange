import { Router } from 'express';
import { 
  getMarketIntelligence, 
  getInvestmentCopilot, 
  getTradingSignals, 
  getWalletYield 
} from '../controllers/ai.controller.js';

const router = Router();

// AI Intelligence Routes
router.post('/market-intelligence', getMarketIntelligence);
router.post('/investment-copilot', getInvestmentCopilot);
router.post('/trading-signals', getTradingSignals);
router.post('/wallet-yield', getWalletYield);

export default router;
