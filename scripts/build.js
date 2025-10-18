const fs = require("fs");
const path = require("path");

const rootDir = path.join(__dirname, "..");
const srcHtml = path.join(rootDir, "index.html");
const distDir = path.join(rootDir, "dist");
const distHtml = path.join(distDir, "index.html");
const assetsToCopy = ["og-image.svg"];

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function minifyHtml(html) {
  const scriptStore = [];
  const styleStore = [];

  const stash = (regex, store, transform) =>
    html.replace(regex, match => {
      const index = store.length;
      store.push(transform ? transform(match) : match);
      return `___PLACEHOLDER_${store === scriptStore ? "SCRIPT" : "STYLE"}_${index}___`;
    });

  html = stash(/<script\b[^>]*>[\s\S]*?<\/script>/gi, scriptStore, minifyScript);
  html = stash(/<style\b[^>]*>[\s\S]*?<\/style>/gi, styleStore, minifyStyle);

  let output = html.replace(/<!--[\s\S]*?-->/g, "");

  styleStore.forEach((content, index) => {
    output = output.replace(`___PLACEHOLDER_STYLE_${index}___`, content);
  });
  scriptStore.forEach((content, index) => {
    output = output.replace(`___PLACEHOLDER_SCRIPT_${index}___`, content);
  });

  return output
    .replace(/>\s+</g, "><")
    .replace(/\s+/g, " ")
    .trim();
}

function minifyStyle(block) {
  const match = block.match(/^(\s*<style\b[^>]*>)([\s\S]*?)(<\/style>)/i);
  if (!match) return block;
  let css = match[2];
  css = css.replace(/\/\*[\s\S]*?\*\//g, "");
  css = css.replace(/\s+/g, " ");
  css = css.replace(/\s*([{}:;,])\s*/g, "$1");
  css = css.replace(/;}/g, "}");
  css = css.trim();
  return `${match[1]}${css}${match[3]}`;
}

function minifyScript(block) {
  const match = block.match(/^(\s*<script\b[^>]*>)([\s\S]*?)(<\/script>)/i);
  if (!match) return block;
  let js = match[2];
  js = js.replace(/\/\*[\s\S]*?\*\//g, "");
  js = js.replace(/\s+/g, " ");
  return `${match[1]}${js.trim()}${match[3]}`;
}

function copyAssets() {
  assetsToCopy.forEach(asset => {
    const src = path.join(rootDir, asset);
    const dest = path.join(distDir, path.basename(asset));
    fs.copyFileSync(src, dest);
  });
}

function build() {
  ensureDir(distDir);
  const html = fs.readFileSync(srcHtml, "utf8");
  const minified = minifyHtml(html);
  fs.writeFileSync(distHtml, minified, "utf8");
  copyAssets();
  console.log(`Build completed: ${path.relative(rootDir, distHtml)}`);
}

build();
