async function fetchDocs() {
  const res = await fetch('https://docs.bavest.co/reference/stock');
  console.log(res.status);
  const text = await res.text();
  console.log(text.substring(0, 500));
}
fetchDocs();
