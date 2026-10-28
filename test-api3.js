import https from 'https';

const bavestKey = 'IV0jxCXmBv7w91Bw8Q6xV39TJiGj5mCc4KFAMFma';

const testBavest = (path, headers) => {
  https.get(`https://api.bavest.co${path}`, { headers }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(`Bavest ${path} with ${JSON.stringify(headers)}:`, res.statusCode, data));
  });
};

testBavest('/quote?symbol=AAPL', { 'x-api-key': `Bearer ${bavestKey}` });
testBavest('/quote?symbol=AAPL', { 'x-api-key': `Api-Key ${bavestKey}` });
testBavest('/quote?symbol=AAPL', { 'Authorization': bavestKey });
