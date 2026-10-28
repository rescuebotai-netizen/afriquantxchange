import { JSDOM } from 'jsdom';

async function fetchDocs() {
  const res = await fetch('https://docs.bavest.co/docs/quote');
  const text = await res.text();
  const dom = new JSDOM(text);
  console.log(dom.window.document.body.textContent.replace(/\s+/g, ' ').substring(0, 2000));
}
fetchDocs();
