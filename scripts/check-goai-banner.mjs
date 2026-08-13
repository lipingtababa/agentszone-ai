import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';

const componentPath = new URL('../src/components/GoaiBanner.astro', import.meta.url);
const imagePath = new URL('../public/images/campaigns/goai-1000-voices.png', import.meta.url);

assert.ok(existsSync(componentPath), 'GOAI banner component is missing');
assert.ok(existsSync(imagePath), 'GOAI banner image is missing');

const component = readFileSync(componentPath, 'utf8');
assert.match(component, /https:\/\/www\.goaihz\.com\/\?channel=mg/, 'GOAI signup link must retain the mg channel parameter');
assert.match(component, /GOAI 1000 Voices/, 'GOAI banner must identify the campaign');

for (const page of ['../src/pages/index.astro', '../src/pages/en/index.astro']) {
  const source = readFileSync(new URL(page, import.meta.url), 'utf8');
  assert.match(source, /import GoaiBanner/, `${page} must import the GOAI banner`);
  assert.match(source, /<GoaiBanner lang=\{lang\}\s*\/>/, `${page} must render the GOAI banner`);
}

console.log('GOAI banner contract passed');
