import https from 'https';

const bavestKey = 'IV0jxCXmBv7w91Bw8Q6xV39TJiGj5mCc4KFAMFma';

const testBavest = (path, headers) => {
  https.get(`https://api.bavest.co${path}`, { headers }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(`Bavest ${path} with ${JSON.stringify(headers)}:`, res.statusCode, data));
  });
};

testBavest('/quote?symbol=AAPL', { 'x-api-key': bavestKey });
testBavest('/quote?symbol=AAPL', { 'Authorization': `Bearer ${bavestKey}` });
testBavest('/quote?symbol=AAPL', { 'Authorization': `API-Key ${bavestKey}` });
testBavest('/quote?symbol=AAPL', { 'apikey': bavestKey });

testBavest('/v1/quote?symbol=AAPL', { 'x-api-key': bavestKey });
testBavest('/v1/quote?symbol=AAPL', { 'Authorization': `Bearer ${bavestKey}` });

testBavest('/stock/price?symbol=AAPL', { 'x-api-key': bavestKey });

// Massive
const massiveKey = '3v22mB2LR5GUt_peThpYAmsnV1WCpd6S';
const testMassive = (url) => {
  https.get(url, { headers: { 'x-api-key': massiveKey, 'Authorization': `Bearer ${massiveKey}` } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(`Massive ${url}:`, res.statusCode, data.substring(0, 100)));
  });
};

testMassive('https://files.massive.com/flatfiles/market_summary.json');
testMassive('https://files.massive.com/market_summary.json');
testMassive('https://flatfiles.files.massive.com/market_summary.json');
