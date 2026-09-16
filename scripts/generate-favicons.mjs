import sharp from 'sharp';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const publicDir = join(root, 'public');
const SOURCE = join(publicDir, 'assets', 'logo.png');

function makeIco(pngBuffer) {
  const size = 32;
  const offset = 6 + 16;
  const header = Buffer.alloc(offset);
  header.writeUInt16LE(0, 0);
  header.writeUInt16LE(1, 2);
  header.writeUInt16LE(1, 4);
  header.writeUInt8(size, 6);
  header.writeUInt8(size, 7);
  header.writeUInt16LE(1, 12);
  header.writeUInt16LE(32, 14);
  header.writeUInt32LE(pngBuffer.length, 14);
  header.writeUInt32LE(offset, 18);
  return Buffer.concat([header, pngBuffer]);
}

async function squarePng(size, { background = null } = {}) {
  let img = sharp(SOURCE).trim().resize(size, size, {
    fit: 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 },
  });
  if (background) {
    img = img.flatten({ background });
  }
  return img.png().toBuffer();
}

const favicon16 = await squarePng(16);
const favicon32 = await squarePng(32);
const appleTouch = await squarePng(180, { background: '#ffffff' });
const pwa192 = await squarePng(192);
const pwa512 = await squarePng(512);

writeFileSync(join(publicDir, 'favicon-16x16.png'), favicon16);
writeFileSync(join(publicDir, 'favicon-32x32.png'), favicon32);
writeFileSync(join(publicDir, 'apple-touch-icon.png'), appleTouch);
writeFileSync(join(publicDir, 'android-chrome-192x192.png'), pwa192);
writeFileSync(join(publicDir, 'android-chrome-512x512.png'), pwa512);

writeFileSync(join(publicDir, 'favicon.ico'), makeIco(favicon32));

writeFileSync(
  join(publicDir, 'site.webmanifest'),
  JSON.stringify(
    {
      name: 'KrakatauWatch',
      short_name: 'KrakatauWatch',
      start_url: '/',
      display: 'standalone',
      background_color: '#f1f5f9',
      theme_color: '#047857',
      icons: [
        { src: '/android-chrome-192x192.png', sizes: '192x192', type: 'image/png' },
        { src: '/android-chrome-512x512.png', sizes: '512x512', type: 'image/png' },
      ],
    },
    null,
    2
  )
);

console.log('Done: favicon.ico, favicon-16x16.png, favicon-32x32.png, apple-touch-icon.png, android-chrome-192x192.png, android-chrome-512x512.png, site.webmanifest');