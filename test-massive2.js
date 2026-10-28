process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

async function test() {
  const res = await fetch('https://files.massive.com/market_summary.json');
  console.log(res.status, await res.text());
}

test();
