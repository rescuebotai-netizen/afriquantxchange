import { Router, Request, Response } from 'express';
import { WhopService } from '../services/whop.service.js';

const router = Router();

/**
 * GET /api/whop/status
 * Returns environment variable configuration status for Whop API
 */
router.get('/status', async (req: Request, res: Response) => {
  try {
    const status = await WhopService.getStatus();
    res.json({
      success: true,
      ...status,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check Whop status',
    });
  }
});

/**
 * GET /api/whop/verify
 * Verifies WHOP_API_KEY (from environment or query parameter)
 */
router.get('/verify', async (req: Request, res: Response) => {
  try {
    const apiKey = typeof req.query.key === 'string' ? req.query.key : undefined;
    const result = await WhopService.verifyApiKey(apiKey);
    
    // Always respond 200 with result payload so client UI receives structured test results
    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Verification process failed',
    });
  }
});

/**
 * POST /api/whop/verify
 * Tests a custom Whop API Key submitted via POST body
 */
router.post('/verify', async (req: Request, res: Response) => {
  try {
    const { apiKey } = req.body || {};
    const result = await WhopService.verifyApiKey(apiKey);

    res.json({
      success: true,
      data: result,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Verification process failed',
    });
  }
});

/**
 * GET /api/whop/entitlements
 * Returns wallet benefits & tier entitlements verified via Whop API
 */
router.get('/entitlements', async (req: Request, res: Response) => {
  try {
    const apiKey = typeof req.query.key === 'string' ? req.query.key : undefined;
    const entitlements = await WhopService.getWalletEntitlements(apiKey);
    res.json({
      success: true,
      data: entitlements,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to check entitlements',
    });
  }
});

/**
 * GET /api/whop/memberships
 * Returns memberships for the authenticated Whop user
 */
router.get('/memberships', async (req: Request, res: Response) => {
  try {
    const apiKey = typeof req.query.key === 'string' ? req.query.key : undefined;
    const result = await WhopService.getUserMemberships(apiKey);
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to retrieve memberships',
    });
  }
});

/**
 * POST /api/whop/fund-card
 * Funds card / wallet in real-time via Whop API key with local debit/credit card
 */
router.post('/fund-card', async (req: Request, res: Response) => {
  try {
    const { amount, currency, region, bankCountry, cardDetails, cardId, apiKey } = req.body || {};
    if (!amount || amount <= 0) {
      return res.status(400).json({ success: false, error: 'Valid positive funding amount is required' });
    }
    const result = await WhopService.fundCardWithWhop({
      amount: Number(amount),
      currency: currency || 'USD',
      region: region || 'America',
      bankCountry: bankCountry || 'United States',
      cardDetails: cardDetails || { cardNumberMasked: '4532 **** **** 8891', cardHolderName: 'Valued Investor', expiry: '12/28', cardBrand: 'Visa' },
      cardId,
      apiKey,
    });
    res.json(result);
  } catch (error: any) {
    res.status(500).json({
      success: false,
      error: error.message || 'Failed to fund card via Whop API',
    });
  }
});

export default router;
