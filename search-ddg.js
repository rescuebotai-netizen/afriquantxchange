import { JSDOM } from 'jsdom';

async function search() {
  const res = await fetch('https://html.duckduckgo.com/html/?q=bavest+api+quote+endpoint');
  const text = await res.text();
  const dom = new JSDOM(text);
  const results = Array.from(dom.window.document.querySelectorAll('.result__snippet')).map(e => e.textContent);
  console.log(results);
}
search();
