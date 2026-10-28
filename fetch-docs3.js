async function fetchDocs() {
  const res = await fetch('https://bavest.co');
  const text = await res.text();
  console.log(text.substring(0, 500));
}
fetchDocs();
