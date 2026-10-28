import https from 'https';

const bavestKey = 'IV0jxCXmBv7w91Bw8Q6xV39TJiGj5mCc4KFAMFma';

const testBavest = (path) => {
  https.get(`https://api.bavest.co${path}`, { headers: { 'x-api-key': bavestKey } }, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(`Bavest ${path}:`, res.statusCode, data));
  });
};

testBavest('/stock/quote?symbol=AAPL');
testBavest('/v1/stock/quote?symbol=AAPL');
testBavest('/portfolio?symbol=AAPL');
testBavest('/v1/portfolio?symbol=AAPL');
