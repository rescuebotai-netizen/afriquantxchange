process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const massiveKey = '3v22mB2LR5GUt_peThpYAmsnV1WCpd6S';

async function test() {
  const urls = [
    'https://files.massive.com/flatfiles/market_summary.json',
    'https://flatfiles.files.massive.com/market_summary.json',
    'https://files.massive.com/market_summary.json'
  ];

  for (const url of urls) {
    try {
      const res = await fetch(url, {
        headers: { 'x-api-key': massiveKey, 'Authorization': `Bearer ${massiveKey}` }
      });
      console.log(url, res.status, res.statusText);
    } catch (e) {
      console.log(url, e.message);
    }
  }
}

test();
