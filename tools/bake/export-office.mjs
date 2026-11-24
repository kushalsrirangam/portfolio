// Step 1 of the bake: export the office's bakeable meshes as a GLB.
//
// Usage (with the site running, e.g. `npm run build && npm run preview`):
//   node tools/bake/export-office.mjs [siteUrl] [outFile]
// Defaults: http://localhost:4173  tools/bake/out/office_export.glb
import fs from "fs";
import path from "path";
import { chromium } from "playwright-core";

const url = process.argv[2] || "http://localhost:4173";
const out = process.argv[3] || "tools/bake/out/office_export.glb";

const browser = await chromium.launch({
  channel: "chrome",
  headless: true,
  args: ["--enable-unsafe-swiftshader", "--use-angle=swiftshader", "--ignore-gpu-blocklist"],
});
const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
page.on("pageerror", (e) => console.error("page error:", e.message));
await page.goto(`${url}/?bake-export`, { waitUntil: "load", timeout: 120000 });
await page.waitForFunction(() => window.__bakeGlb, null, { timeout: 300000, polling: 1000 });
const { b64, count } = await page.evaluate(() => ({ b64: window.__bakeGlb, count: window.__bakeCount }));
fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, Buffer.from(b64, "base64"));
console.log(`exported ${count} meshes -> ${out} (${(fs.statSync(out).size / 1048576).toFixed(1)} MB)`);
await browser.close();
