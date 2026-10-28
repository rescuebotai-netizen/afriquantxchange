import { Router } from 'express';
import WebSocket from 'ws';

const router = Router();

// Twelve Data REST API Integration & FALLBACKS
router.get('/twelvedata/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const apiKey = process.env.TWELVEDATA_API_KEY || process.env.TWELVE_DATA_API_KEY || process.env.VITE_TWELVEDATA_API_KEY;

    if (!apiKey) {
      throw new Error('TWELVEDATA_API_KEY_MISSING');
    }

    const response = await fetch(`https://api.twelvedata.com/quote?symbol=${symbol}&apikey=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Twelve Data API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      throw new Error(data.message || 'Twelve Data error response');
    }

    res.json(data);
  } catch (error) {
    // Silently fallback without crashing or massive logs
    res.json({
      symbol: req.params.symbol.toUpperCase(),
      name: `${req.params.symbol.toUpperCase()} Inc.`,
      price: (150.25 + (Math.random() * 10)).toFixed(2),
      change: ((Math.random() * 4) - 2).toFixed(2),
      percent_change: ((Math.random() * 2) - 1).toFixed(2),
      volume: Math.floor(1000000 + Math.random() * 5000000).toString(),
      datetime: new Date().toISOString(),
      is_fallback: true
    });
  }
});

router.get('/twelvedata/time_series/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const { interval = '1day', outputsize = '30' } = req.query;
    const apiKey = process.env.TWELVEDATA_API_KEY || process.env.TWELVE_DATA_API_KEY || process.env.VITE_TWELVEDATA_API_KEY;

    if (!apiKey) {
      throw new Error('TWELVEDATA_API_KEY_MISSING');
    }

    const response = await fetch(`https://api.twelvedata.com/time_series?symbol=${symbol}&interval=${interval}&outputsize=${outputsize}&apikey=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Twelve Data API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.status === 'error') {
      throw new Error(data.message || 'Twelve Data error response');
    }

    res.json(data);
  } catch (error) {
    // Generate beautiful historical mock data
    const mockValues = [];
    const basePrice = 150 + Math.random() * 100;
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const randomFactor = 1 + (Math.random() * 0.04 - 0.02);
      const price = (basePrice * (1 + (30 - i) * 0.005) * randomFactor).toFixed(2);
      mockValues.push({
        datetime: date.toISOString().split('T')[0],
        open: price,
        high: (parseFloat(price) * 1.01).toFixed(2),
        low: (parseFloat(price) * 0.99).toFixed(2),
        close: price,
        volume: Math.floor(500000 + Math.random() * 1500000).toString()
      });
    }
    res.json({
      meta: { symbol: req.params.symbol.toUpperCase(), interval: '1day' },
      values: mockValues,
      is_fallback: true
    });
  }
});

// SSE Live Stream for Twelve Data WebSocket Proxy
router.get('/twelvedata/stream', (req, res) => {
  const symbolsQuery = req.query.symbols as string;
  const apiKey = process.env.TWELVEDATA_API_KEY || process.env.TWELVE_DATA_API_KEY || process.env.VITE_TWELVEDATA_API_KEY;

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let ws: WebSocket | null = null;
  let heartbeatInterval: NodeJS.Timeout | null = null;
  let mockInterval: NodeJS.Timeout | null = null;

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    sendEvent('status', { message: 'Twelve Data API key missing. Streaming high-fidelity simulated ticks.', type: 'info', mode: 'mock' });
    
    const symbols = symbolsQuery ? symbolsQuery.split(',') : ['AAPL', 'MSFT', 'AFQ'];
    const prices: Record<string, number> = {};
    symbols.forEach(sym => {
      prices[sym] = sym === 'AFQ' ? 152.40 : 150 + Math.random() * 100;
    });

    mockInterval = setInterval(() => {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const changePercent = (Math.random() * 0.4 - 0.2); // -0.2% to +0.2%
      prices[randomSymbol] = parseFloat((prices[randomSymbol] * (1 + changePercent / 100)).toFixed(2));
      
      sendEvent('price', {
        event: 'price',
        symbol: randomSymbol,
        price: prices[randomSymbol],
        change_percent: changePercent.toFixed(4),
        timestamp: Math.floor(Date.now() / 1000),
        is_fallback: true
      });
    }, 1500);

  } else {
    // Connect to Twelve Data WebSocket API
    const wsUrl = `wss://ws.twelvedata.com/v1/quotes/price?apikey=${apiKey}`;
    ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      sendEvent('status', { message: 'Connected to Twelve Data Real-time Network.', type: 'success', mode: 'live' });

      // Subscribe to requested symbols
      const symbols = symbolsQuery ? symbolsQuery.split(',') : ['AAPL', 'MSFT'];
      const subscribeMsg = {
        action: 'subscribe',
        params: {
          symbols: symbols.join(',')
        }
      };
      ws?.send(JSON.stringify(subscribeMsg));
    });

    ws.on('message', (messageBuffer) => {
      try {
        const message = JSON.parse(messageBuffer.toString());
        // Forward message to the SSE client
        if (message.event === 'price' || message.event === 'subscribe-status' || message.status === 'error') {
          sendEvent(message.event || 'message', message);
        } else {
          sendEvent('message', message);
        }
      } catch (e) {
        console.error('[Twelve Data SSE] WS Parse error:', e);
      }
    });

    ws.on('error', (err) => {
      console.error('[Twelve Data SSE] WS Error:', err);
      sendEvent('status', { message: `Twelve Data Link Error: ${err.message}`, type: 'error' });
    });

    ws.on('close', (code, reason) => {
      sendEvent('status', { message: 'Twelve Data WS Connection Closed.', type: 'warning' });
    });

    // Keep SSE alive with heartbeats
    heartbeatInterval = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 15000);
  }

  // Handle client disconnection
  req.on('close', () => {
    if (ws) {
      ws.close();
    }
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    if (mockInterval) {
      clearInterval(mockInterval);
    }
  });
});

// Finnhub REST API Integration & FALLBACKS
router.get('/finnhub/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY_MISSING');
    }

    const response = await fetch(`https://finnhub.io/api/v1/quote?symbol=${symbol.toUpperCase()}&token=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (!data || data.c === 0) {
      throw new Error('Invalid quote data or empty symbol');
    }

    res.json({
      symbol: symbol.toUpperCase(),
      price: data.c,
      change: data.d,
      percent_change: data.dp,
      high: data.h,
      low: data.l,
      open: data.o,
      previous_close: data.pc,
      timestamp: data.t
    });
  } catch (error) {
    // Elegant fallback data
    res.json({
      symbol: req.params.symbol.toUpperCase(),
      price: parseFloat((185.40 + (Math.random() * 8 - 4)).toFixed(2)),
      change: parseFloat(((Math.random() * 4) - 2).toFixed(2)),
      percent_change: parseFloat(((Math.random() * 2) - 1).toFixed(2)),
      high: 190.00,
      low: 180.00,
      open: 184.00,
      previous_close: 185.40,
      is_fallback: true
    });
  }
});

router.get('/finnhub/time_series/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const apiKey = process.env.FINNHUB_API_KEY;

    if (!apiKey) {
      throw new Error('FINNHUB_API_KEY_MISSING');
    }

    const to = Math.floor(Date.now() / 1000);
    const from = to - (30 * 24 * 60 * 60); // 30 days ago

    const response = await fetch(`https://finnhub.io/api/v1/stock/candle?symbol=${symbol.toUpperCase()}&resolution=D&from=${from}&to=${to}&token=${apiKey}`);
    if (!response.ok) {
      throw new Error(`Finnhub API error: ${response.statusText}`);
    }

    const data = await response.json();
    if (data.s !== 'ok' || !Array.isArray(data.c)) {
      throw new Error(data.error || 'Finnhub stock candle error response');
    }

    const formattedValues = data.c.map((close: number, idx: number) => ({
      datetime: new Date(data.t[idx] * 1000).toISOString().split('T')[0],
      open: data.o[idx],
      high: data.h[idx],
      low: data.l[idx],
      close: close,
      volume: data.v[idx]
    }));

    res.json({
      meta: { symbol: symbol.toUpperCase(), resolution: 'D' },
      values: formattedValues
    });
  } catch (error) {
    // Generate beautiful historical mock data
    const mockValues = [];
    const basePrice = 180 + Math.random() * 50;
    for (let i = 30; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const randomFactor = 1 + (Math.random() * 0.04 - 0.02);
      const price = parseFloat((basePrice * (1 + (30 - i) * 0.003) * randomFactor).toFixed(2));
      mockValues.push({
        datetime: date.toISOString().split('T')[0],
        open: price,
        high: parseFloat((price * 1.01).toFixed(2)),
        low: parseFloat((price * 0.99).toFixed(2)),
        close: price,
        volume: Math.floor(800000 + Math.random() * 2000000)
      });
    }
    res.json({
      meta: { symbol: req.params.symbol.toUpperCase(), resolution: 'D' },
      values: mockValues,
      is_fallback: true
    });
  }
});

// SSE Live Stream for Finnhub WebSocket Proxy
router.get('/finnhub/stream', (req, res) => {
  const symbolsQuery = req.query.symbols as string;
  const apiKey = process.env.FINNHUB_API_KEY;

  // Set SSE Headers
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.flushHeaders();

  let ws: WebSocket | null = null;
  let heartbeatInterval: NodeJS.Timeout | null = null;
  let mockInterval: NodeJS.Timeout | null = null;

  const sendEvent = (event: string, data: any) => {
    res.write(`event: ${event}\n`);
    res.write(`data: ${JSON.stringify(data)}\n\n`);
  };

  const symbols = symbolsQuery ? symbolsQuery.split(',') : ['AAPL', 'MSFT', 'AMZN', 'TSLA'];

  if (!apiKey || apiKey === 'undefined' || apiKey === '') {
    sendEvent('status', { message: 'Finnhub API key missing. Streaming high-fidelity simulated ticks.', type: 'info', mode: 'mock' });
    
    const prices: Record<string, number> = {};
    symbols.forEach(sym => {
      prices[sym] = sym === 'AAPL' ? 185.40 : sym === 'MSFT' ? 415.60 : 150 + Math.random() * 100;
    });

    mockInterval = setInterval(() => {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const changePercent = (Math.random() * 0.4 - 0.2); // -0.2% to +0.2%
      prices[randomSymbol] = parseFloat((prices[randomSymbol] * (1 + changePercent / 100)).toFixed(2));
      
      sendEvent('price', {
        event: 'price',
        symbol: randomSymbol,
        price: prices[randomSymbol],
        change_percent: changePercent.toFixed(4),
        timestamp: Math.floor(Date.now() / 1000),
        is_fallback: true
      });
    }, 1500);

  } else {
    // Connect to Finnhub WebSocket API
    const wsUrl = `wss://ws.finnhub.io?token=${apiKey}`;
    ws = new WebSocket(wsUrl);

    ws.on('open', () => {
      sendEvent('status', { message: 'Connected to Finnhub Real-time Network.', type: 'success', mode: 'live' });

      // Subscribe to requested symbols
      symbols.forEach(sym => {
        const subscribeMsg = {
          type: 'subscribe',
          symbol: sym.toUpperCase()
        };
        ws?.send(JSON.stringify(subscribeMsg));
      });
    });

    ws.on('message', (messageBuffer) => {
      try {
        const message = JSON.parse(messageBuffer.toString());
        
        if (message.type === 'trade' && Array.isArray(message.data)) {
          // Send each trade to the client as a price update
          message.data.forEach((trade: any) => {
            sendEvent('price', {
              event: 'price',
              symbol: trade.s,
              price: trade.p,
              volume: trade.v,
              timestamp: Math.floor(trade.t / 1000),
              is_fallback: false
            });
          });
        } else if (message.type === 'ping') {
          // Finnhub keeps connection alive, send heartbeat to SSE client
          res.write(': finnhub ping\n\n');
        } else {
          sendEvent('message', message);
        }
      } catch (e) {
        console.error('[Finnhub SSE] WS Parse error:', e);
      }
    });

    ws.on('error', (err) => {
      console.error('[Finnhub SSE] WS Error:', err);
      sendEvent('status', { message: `Finnhub Link Error: ${err.message}`, type: 'error' });
    });

    ws.on('close', (code, reason) => {
      sendEvent('status', { message: 'Finnhub WS Connection Closed.', type: 'warning' });
    });

    // Keep SSE alive with heartbeats
    heartbeatInterval = setInterval(() => {
      res.write(': heartbeat\n\n');
    }, 15000);
  }

  // Handle client disconnection
  req.on('close', () => {
    if (ws) {
      ws.close();
    }
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    if (mockInterval) {
      clearInterval(mockInterval);
    }
  });
});

// Bavest API Integration for real-time quotes
router.get('/bavest/quote/:symbol', async (req, res) => {
  try {
    const { symbol } = req.params;
    const apiKey = process.env.BAVEST_API_KEY;
    
    if (!apiKey) {
      console.warn('Bavest API key not configured, using fallback data.');
      throw new Error('Bavest API key not configured');
    }

    const response = await fetch(`https://api.bavest.co/v1/quote?symbol=${symbol}`, {
      headers: {
        'x-api-key': apiKey
      }
    });

    if (!response.ok) {
      if (response.status === 403 || response.status === 401) {
        throw new Error('BAVEST_UNAUTHORIZED'); // Custom error message
      }
      throw new Error(`Bavest API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    if (error instanceof Error && error.message === 'BAVEST_UNAUTHORIZED') {
      // Just fallback silently if unauthorized to avoid log spam
    } else {
      console.error('Bavest API Error:', error);
    }
    // Fallback mock data for the dashboard
    res.json({
      symbol: req.params.symbol,
      price: 150.25 + (Math.random() * 10),
      change: (Math.random() * 5) - 2.5,
      timestamp: new Date().toISOString(),
      source: 'mock_fallback'
    });
  }
});

// Massive Financial Data API Integration
router.get('/massive/data', async (req, res) => {
  try {
    const endpoint = process.env.MASSIVE_S3_ENDPOINT;
    const bucket = process.env.MASSIVE_BUCKET;
    const apiKey = process.env.MASSIVE_API_KEY;

    if (!endpoint || !bucket || !apiKey) {
      console.warn('Massive API configuration missing, using fallback data.');
      throw new Error('Massive API configuration missing');
    }

    // Attempting to fetch a generic market data file from the Massive S3 bucket
    const response = await fetch(`${endpoint}/${bucket}/market_summary.json`, {
      headers: {
        'x-api-key': apiKey,
        'Authorization': `Bearer ${apiKey}`
      }
    });

    if (!response.ok) {
      throw new Error(`Massive API error: ${response.statusText}`);
    }

    const data = await response.json();
    res.json(data);
  } catch (error) {
    // Fallback mock data for the dashboard
    res.json({
      status: 'success',
      source: 'mock_fallback',
      data: [
        { id: '1', name: 'Global Market Index', value: 4500.50, trend: 'up', change: '+1.2%' },
        { id: '2', name: 'Emerging Markets', value: 1050.20, trend: 'down', change: '-0.5%' },
        { id: '3', name: 'African Equities', value: 850.75, trend: 'up', change: '+2.4%' }
      ],
      timestamp: new Date().toISOString()
    });
  }
});

// Legacy placeholder routes
router.get('/assets', (req, res) => {
  res.json({ message: 'List of tradable assets' });
});

router.get('/assets/:symbol/price', (req, res) => {
  res.json({ symbol: req.params.symbol, price: 100.00 });
});

export default router;
