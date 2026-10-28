async function searchNpm() {
  const res = await fetch('https://registry.npmjs.org/-/v1/search?text=bavest');
  const data = await res.json();
  console.log(data.objects.map(o => o.package.name));
}
searchNpm();
