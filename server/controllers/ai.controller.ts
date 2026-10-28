import { Request, Response } from 'express';
import { 
  generateMarketIntelligence, 
  generateInvestmentCopilot, 
  generateTradingSignals, 
  generateWalletYield 
} from '../services/gemini.service.js';

export const getMarketIntelligence = async (req: Request, res: Response) => {
  try {
    const data = await generateMarketIntelligence();
    res.json(data);
  } catch (error) {
    console.error('Error generating market intelligence:', error);
    res.status(500).json({ error: 'Failed to generate market intelligence' });
  }
};

export const getInvestmentCopilot = async (req: Request, res: Response) => {
  try {
    const { riskProfile } = req.body;
    const data = await generateInvestmentCopilot(riskProfile || 'Moderate');
    res.json(data);
  } catch (error) {
    console.error('Error generating investment copilot:', error);
    res.status(500).json({ error: 'Failed to generate investment copilot' });
  }
};

export const getTradingSignals = async (req: Request, res: Response) => {
  try {
    const data = await generateTradingSignals();
    res.json(data);
  } catch (error) {
    console.error('Error generating trading signals:', error);
    res.status(500).json({ error: 'Failed to generate trading signals' });
  }
};

export const getWalletYield = async (req: Request, res: Response) => {
  try {
    const data = await generateWalletYield();
    res.json(data);
  } catch (error) {
    console.error('Error generating wallet yield:', error);
    res.status(500).json({ error: 'Failed to generate wallet yield' });
  }
};
