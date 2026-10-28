import { JSDOM } from 'jsdom';

async function search() {
  const res = await fetch('https://html.duckduckgo.com/html/?q=bavest+python+sdk+github');
  const text = await res.text();
  const dom = new JSDOM(text);
  const results = Array.from(dom.window.document.querySelectorAll('.result__url')).map(e => e.textContent.trim());
  console.log(results);
}
search();
