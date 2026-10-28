async function fetchDocs() {
  const res = await fetch('https://docs.bavest.co/docs');
  const text = await res.text();
  const stripped = text.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ');
  console.log(stripped.substring(0, 2000));
}
fetchDocs();
