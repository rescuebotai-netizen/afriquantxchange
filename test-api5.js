import https from 'https';

const bavestKey = 'IV0jxCXmBv7w91Bw8Q6xV39TJiGj5mCc4KFAMFma';

const testBavest = (path) => {
  https.get(`https://api.bavest.co${path}`, (res) => {
    let data = '';
    res.on('data', chunk => data += chunk);
    res.on('end', () => console.log(`Bavest ${path}:`, res.statusCode, data));
  });
};

testBavest(`/quote?symbol=AAPL&api_key=${bavestKey}`);
testBavest(`/quote?symbol=AAPL&apikey=${bavestKey}`);
testBavest(`/v1/quote?symbol=AAPL&api_key=${bavestKey}`);
