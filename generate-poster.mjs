import { chromium } from 'playwright';

const posterData = {
  ep: 18,
  title: 'AI客服',
  desc: '深入探讨AI客服的业务背景、LLM时代的解决方案，以及仍存在的遗留问题。',
  items: 'AI客服业务背景和前LLM时代的问题|LLM时代AI客服的解决方案|AI客服在LLM时代下仍遗留的问题',
  date: '2026-03-28T20:00',
  meetingId: '700 360 080'
};

const query = new URLSearchParams({
  ep: posterData.ep,
  title: posterData.title.replace(/\n/g, '\\n'),
  desc: posterData.desc,
  items: posterData.items,
  date: posterData.date,
  meetingId: posterData.meetingId
}).toString();

const url = `http://localhost:4321/poster?${query}`;

console.log('Navigating to:', url);

const browser = await chromium.launch({ headless: true });
const page = await browser.newPage();

await page.goto(url, { waitUntil: 'networkidle' });

// Wait a bit for React to render
await page.waitForTimeout(2000);

// Take screenshot of the poster
const posterElement = await page.$('#poster-canvas');
if (!posterElement) {
  console.error('Poster element not found!');
  process.exit(1);
}

const outputPath = '/Users/lis/.openclaw/workspace/poster-ep18.png';
await posterElement.screenshot({
  path: outputPath,
  type: 'png'
});

console.log('Poster saved to:', outputPath);
await browser.close();
