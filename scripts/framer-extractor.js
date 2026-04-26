#!/usr/bin/env node

/**
 * Framer Extractor v1
 *
 * Что делает:
 * 1) Открывает страницу предпросмотра Framer в headless Chrome
 * 2) Ждёт рендер
 * 3) Сохраняет screenshot
 * 4) Вытаскивает HTML выбранного блока
 * 5) Пытается собрать доступный CSS
 * 6) Сохраняет result.html / result.css / meta.json
 *
 * Запуск:
 *   npm install puppeteer
 *   node framer-extractor.js "https://framer.com/m/Contact-Section-01-IWaI"
 *
 * Или с селектором:
 *   node framer-extractor.js "https://framer.com/m/Contact-Section-01-IWaI" ".framer-abc123"
 */

import fs from "node:fs";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import puppeteer from "puppeteer";

const CARD_PREVIEW_ASPECT_RATIO = 16 / 9;

const cliArgs = process.argv.slice(2);
const isHeaded = cliArgs.includes("--headed");
const withRuntimeScripts = cliArgs.includes("--with-runtime");
const scriptDir = path.dirname(fileURLToPath(import.meta.url));

let inputUrl = null;
let inputSelector = null;
let explicitOutputDir = null;
let htmlFileName = "result.html";

for (let i = 0; i < cliArgs.length; i += 1) {
  const arg = cliArgs[i];

  if (arg === "--headed") continue;
  if (arg === "--with-runtime") continue;

  if (arg === "--selector") {
    inputSelector = cliArgs[i + 1] || null;
    i += 1;
    continue;
  }

  if (arg.startsWith("--selector=")) {
    inputSelector = arg.slice("--selector=".length) || null;
    continue;
  }

  if (arg === "--output" || arg === "--output-dir") {
    explicitOutputDir = cliArgs[i + 1] || null;
    i += 1;
    continue;
  }

  if (arg.startsWith("--output=")) {
    explicitOutputDir = arg.slice("--output=".length) || null;
    continue;
  }

  if (arg.startsWith("--output-dir=")) {
    explicitOutputDir = arg.slice("--output-dir=".length) || null;
    continue;
  }

  if (arg === "--html-name") {
    htmlFileName = cliArgs[i + 1] || htmlFileName;
    i += 1;
    continue;
  }

  if (arg.startsWith("--html-name=")) {
    htmlFileName = arg.slice("--html-name=".length) || htmlFileName;
    continue;
  }

  if (arg.startsWith("--")) continue;

  if (!inputUrl) {
    inputUrl = arg;
    continue;
  }

  if (!inputSelector) {
    inputSelector = arg;
  }
}

function normalizeInputUrl(raw) {
  if (!raw) return raw;
  let value = String(raw).trim();

  // Framer share links are often copied as module URLs like /m/Name.js or /m/Name.js@hash.
  // Opening those directly returns JavaScript, so normalize them back to the preview page.
  value = value.replace(/(\bframer\.com\/m\/[^?#@]+)\.js(?:@[^?#]+)?/i, "$1");
  value = value.replace(/(\bwww\.framer\.com\/m\/[^?#@]+)\.js(?:@[^?#]+)?/i, "$1");
  value = value.replace(/(\/m\/[^?#@]+)\.js(?:@[^?#]+)?/i, "$1");

  if (/^https?:\/\//i.test(value)) return value;
  if (/^file:\/\//i.test(value)) return value;

  // Allow passing a local HTML path directly (without file:// prefix).
  const localCandidate = path.resolve(value);
  if (fs.existsSync(localCandidate)) {
    return `file://${localCandidate}`;
  }

  if (/^framer\.com\//i.test(value) || /^www\.framer\.com\//i.test(value)) {
    return `https://${value}`;
  }
  if (/^\/m\//i.test(value)) {
    return `https://framer.com${value}`;
  }
  return value;
}

inputUrl = normalizeInputUrl(inputUrl);

if (!inputUrl) {
  console.error("Ошибка: передай URL Framer страницы.");
  console.error('Пример: node framer-extractor.js "https://framer.com/m/Contact-Section-01-IWaI"');
  console.error('С флагом: node framer-extractor.js "https://framer.com/m/..." --headed');
  console.error('С селектором: node framer-extractor.js "https://framer.com/m/..." --selector ".framer-abc123"');
  process.exit(1);
}

function sanitizeFileName(value) {
  return value
    .replace(/^https?:\/\//, "")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function getRootVariantInfoFromHtml(blockHtml) {
  const openTagMatch = blockHtml.match(/^<([a-z0-9-]+)([^>]*)>/i);
  if (!openTagMatch) return null;
  const attrs = openTagMatch[2] || "";
  const classMatch = attrs.match(/\bclass="([^"]+)"/i);
  if (!classMatch) return null;

  const classes = classMatch[1].split(/\s+/).map((v) => v.trim()).filter(Boolean);
  const framerClasses = classes.filter((c) => /^framer-[A-Za-z0-9_-]+$/.test(c));
  const componentClass = framerClasses.find((c) => !c.startsWith("framer-v-")) || null;
  const currentVariant = framerClasses.find((c) => c.startsWith("framer-v-")) || null;
  const variantBaseClass = currentVariant ? currentVariant.replace(/^framer-v-/, "framer-") : null;
  const baseClass =
    (variantBaseClass && framerClasses.includes(variantBaseClass) ? variantBaseClass : null) ||
    framerClasses.find((c) => c !== componentClass && !c.startsWith("framer-v-")) ||
    null;

  return { componentClass, baseClass, currentVariant };
}

function collectVariantsFromCss(cssText, componentClass, baseClass, currentVariant) {
  const variants = new Map();
  if (currentVariant) variants.set(currentVariant, { variantClass: currentVariant, width: null });
  if (!cssText || !componentClass || !baseClass) return Array.from(variants.values());

  const selectorRegex = /([^{}]+)\{([^{}]*)\}/g;
  let m;
  while ((m = selectorRegex.exec(cssText)) !== null) {
    const selector = m[1] || "";
    const body = m[2] || "";
    if (!selector.includes(`.${componentClass}`) || !selector.includes(`.${baseClass}`)) continue;
    const found = selector.match(/framer-v-[A-Za-z0-9_-]+/g) || [];
    if (!found.length && currentVariant) found.push(currentVariant);

    const widthMatch = body.match(/\bwidth\s*:\s*([0-9.]+)px\b/i);
    const width = widthMatch ? Number(widthMatch[1]) : null;

    for (const v of found) {
      if (!variants.has(v)) variants.set(v, { variantClass: v, width: null });
      if (width && !variants.get(v).width) {
        variants.get(v).width = width;
      }
    }
  }

  return Array.from(variants.values());
}

async function launchBrowser() {
  const launchOptions = {
    headless: isHeaded ? false : "new",
    args: [
      "--no-sandbox",
      "--disable-setuid-sandbox",
      "--disable-dev-shm-usage",
      "--disable-blink-features=AutomationControlled",
      "--lang=en-US,en",
    ],
    defaultViewport: {
      width: 1440,
      height: 2200,
      deviceScaleFactor: 2,
    },
  };

  const systemChromeCandidates = [
    process.env.CHROME_PATH,
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    "/Applications/Chromium.app/Contents/MacOS/Chromium",
    "/Applications/Google Chrome for Testing.app/Contents/MacOS/Google Chrome for Testing",
  ].filter(Boolean);

  const errors = [];

  try {
    return await puppeteer.launch(launchOptions);
  } catch (error) {
    errors.push(`default launch: ${error.message}`);
  }

  for (const executablePath of systemChromeCandidates) {
    try {
      return await puppeteer.launch({
        ...launchOptions,
        executablePath,
      });
    } catch (error) {
      errors.push(`${executablePath}: ${error.message}`);
    }
  }

  throw new Error(
    `Failed to launch browser.\nTried:\n- ${errors.join("\n- ")}\n\nTip: run with CHROME_PATH=\"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome\"`
  );
}

async function autoDetectMainBlock(page) {
  const framerRootSelector = await page.evaluate(() => {
    const root = Array.from(document.querySelectorAll("[data-framer-root]")).find((el) => {
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 100 &&
        rect.height > 60
      );
    });
    return root ? "[data-framer-root]" : null;
  });

  if (framerRootSelector) return framerRootSelector;

  const framerVariantSelector = await page.evaluate(() => {
    function isVisible(el) {
      const tag = (el.tagName || "").toLowerCase();
      if (tag === "iframe" || tag === "script" || tag === "style") return false;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 120 &&
        rect.height > 30
      );
    }

    function score(el) {
      const rect = el.getBoundingClientRect();
      const name = (el.getAttribute("data-framer-name") || "").toLowerCase();
      const text = (el.innerText || "").trim().toLowerCase();
      const children = el.querySelectorAll("*").length;
      const className = typeof el.className === "string" ? el.className : "";
      const variantBoost = /\bframer-v-[A-Za-z0-9_-]+\b/.test(className) ? 50000 : 0;
      const namedVariantBoost = ["desktop", "tablet", "phone", "mobile"].includes(name) ? 100000 : 0;
      const shellPenalty = text.includes("copy component") ? 200000 : 0;
      return rect.width * rect.height + children * 120 + variantBoost + namedVariantBoost - shellPenalty;
    }

    const candidates = Array.from(document.querySelectorAll('[class*="framer-v-"]'))
      .filter(isVisible)
      .sort((a, b) => score(b) - score(a));

    const picked =
      candidates.find((el) => {
        const name = (el.getAttribute("data-framer-name") || "").toLowerCase();
        return ["desktop", "tablet", "phone", "mobile"].includes(name);
      }) || candidates[0];

    if (!picked) return null;
    if (picked.id) return `#${CSS.escape(picked.id)}`;

    const className = typeof picked.className === "string" ? picked.className : "";
    const componentClass = className
      .split(/\s+/)
      .map((v) => v.trim())
      .filter(Boolean)
      .find((c) => /^framer-[A-Za-z0-9_-]+$/.test(c) && !c.startsWith("framer-v-"));

    return componentClass ? `.${componentClass}` : null;
  });

  if (framerVariantSelector) return framerVariantSelector;

  const candidates = await page.evaluate(() => {
    const all = Array.from(document.querySelectorAll("body *"));

    function isVisible(el) {
      const tag = (el.tagName || "").toLowerCase();
      if (tag === "iframe" || tag === "script" || tag === "style") return false;
      const style = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();
      return (
        style.display !== "none" &&
        style.visibility !== "hidden" &&
        rect.width > 120 &&
        rect.height > 80
      );
    }

    function score(el) {
      const rect = el.getBoundingClientRect();
      const area = rect.width * rect.height;
      const children = el.querySelectorAll("*").length;
      const textLength = (el.innerText || "").trim().length;
      const hasImages = el.querySelectorAll("img, video, svg").length;
      const roleBoost = el.matches("main, section, article") ? 100000 : 0;
      return area + children * 120 + textLength * 8 + hasImages * 350 + roleBoost;
    }

    return all
      .filter(isVisible)
      .map((el) => {
        const className = typeof el.className === "string" ? el.className : "";
        return {
          tag: el.tagName.toLowerCase(),
          id: el.id || "",
          className,
          score: score(el),
          text: (el.innerText || "").trim().slice(0, 120),
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 20);
  });

  // 1) Best candidate from scoring
  const best = candidates.find((item) => item.className.includes("framer")) || candidates[0];
  if (best) {
    if (best.id) return `#${CSS.escape(best.id)}`;

    if (best.className) {
      const firstClass = best.className
        .split(/\s+/)
        .map((v) => v.trim())
        .filter(Boolean)[0];

      if (firstClass) return `.${firstClass}`;
    }

    return best.tag;
  }

  // 2) Framer-specific fallbacks
  const framerFallback = await page.evaluate(() => {
    const possible = [
      '[class*="framer"]',
      '[data-framer-name]',
      "[data-framer-component-type]",
      "main",
      "section",
      "article",
      "body > div",
    ];

    for (const sel of possible) {
      const nodes = Array.from(document.querySelectorAll(sel));
      const visible = nodes.find((el) => {
        const tag = (el.tagName || "").toLowerCase();
        if (tag === "iframe" || tag === "script" || tag === "style") return false;
        const style = window.getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          rect.width > 100 &&
          rect.height > 60
        );
      });
      if (!visible) continue;

      if (visible.id) return `#${visible.id}`;
      const className = typeof visible.className === "string" ? visible.className : "";
      const firstClass = className.split(/\s+/).map((v) => v.trim()).filter(Boolean)[0];
      if (firstClass) return `.${firstClass}`;
      return visible.tagName.toLowerCase();
    }

    return null;
  });

  return framerFallback;
}

async function getCssText(page) {
  return await page.evaluate(async () => {
    const parts = [];
    const seen = new Set();

    function addCss(css, source = "unknown") {
      const text = (css || "").trim();
      if (!text || seen.has(text)) return;
      seen.add(text);
      parts.push(`/* source: ${source} */\n${text}`);
    }

    function readRulesFromSheet(sheet, source = "stylesheet") {
      try {
        const rules = Array.from(sheet.cssRules || []);
        if (!rules.length) return;
        const css = rules.map((rule) => rule.cssText).join("\n");
        addCss(css, source);
      } catch {
        // cross-origin stylesheet or protected stylesheet
      }
    }

    // 1) regular document stylesheets
    for (const sheet of Array.from(document.styleSheets || [])) {
      const source = sheet.href || "document.styleSheets";
      readRulesFromSheet(sheet, source);
    }

    // 2) constructed/adopted stylesheets on document
    for (const sheet of Array.from(document.adoptedStyleSheets || [])) {
      readRulesFromSheet(sheet, "document.adoptedStyleSheets");
    }

    // 3) style tags in light DOM
    for (const styleTag of Array.from(document.querySelectorAll("style"))) {
      addCss(styleTag.textContent || "", "style tag");
    }

    // 4) shadow roots: style tags + adopted stylesheets
    const allNodes = Array.from(document.querySelectorAll("*"));
    for (const node of allNodes) {
      const root = node.shadowRoot;
      if (!root) continue;

      for (const styleTag of Array.from(root.querySelectorAll("style"))) {
        addCss(styleTag.textContent || "", "shadow style tag");
      }

      for (const sheet of Array.from(root.adoptedStyleSheets || [])) {
        readRulesFromSheet(sheet, "shadow adoptedStyleSheets");
      }
    }

    // 5) fallback: fetch linked css files directly
    for (const link of Array.from(document.querySelectorAll('link[rel="stylesheet"][href]'))) {
      const href = link.getAttribute("href");
      if (!href) continue;
      try {
        const absolute = new URL(href, document.baseURI).href;
        const response = await fetch(absolute, { credentials: "omit" });
        if (!response.ok) continue;
        const css = await response.text();
        addCss(css, absolute);
      } catch {
        // ignore network/CORS failures
      }
    }

    return parts.join("\n\n");
  });
}

async function getBlockData(page, selector) {
  return await page.evaluate((sel) => {
    let target = document.querySelector(sel);
    if (!target) return null;

    // If selector points to an iframe, try to use the nearest meaningful parent block.
    if ((target.tagName || "").toLowerCase() === "iframe") {
      const parentBlock = target.closest("section, article, main, div");
      if (parentBlock) target = parentBlock;
    }

    const framerRoot = target.closest("[data-framer-root]");
    if (framerRoot) {
      target = framerRoot;
    }

    function cleanNode(node) {
      const clone = node.cloneNode(true);

      if (clone instanceof HTMLElement && clone.hasAttribute("data-framer-root")) {
        clone.style.width = "auto";
      }

      if (clone instanceof HTMLElement && !clone.hasAttribute("data-framer-root")) {
        const className = typeof clone.className === "string" ? clone.className : "";
        if (/\bframer-[A-Za-z0-9_-]+\b/.test(className)) {
          clone.style.width = "auto";
        }
      }

      // Keep markup максимально "живым":
      // Framer часто использует data-* и внутреннюю структуру для hover/variants.
      // Но убираем служебные/лишние элементы (editor bar, framer badge, верхние header/nav).
      const removeSelectors = [
        "noscript",
        "header",
        "nav",
        "[id='__framer-editorbar']",
        "[id^='__framer-editorbar']",
        "[class*='framer-editorbar']",
        "[data-framer-name='Light']",
        "[data-framer-name='madeinframer']",
      ];

      if (removeSelectors.length) {
        clone.querySelectorAll(removeSelectors.join(",")).forEach((el) => el.remove());
      }

      clone.querySelectorAll("*").forEach((el) => {
        if (el.hasAttribute("data-framer-root")) {
          el.style.width = "auto";
        }

        if (
          el instanceof HTMLElement &&
          el.classList.contains("ticker-item") &&
          el.closest('ul[role="group"]')
        ) {
          el.style.transform = "none";
        }

        for (const attr of Array.from(el.attributes)) {
          const name = attr.name;
          const value = attr.value || "";

          // Convert relative links to absolute HTTPS URLs where possible
          if (["src", "href", "poster"].includes(name.toLowerCase())) {
            if (!value || value.startsWith("data:") || value.startsWith("javascript:") || value.startsWith("#")) {
              continue;
            }
            try {
              const absolute = new URL(value, document.baseURI).href;
              el.setAttribute(name, absolute);
            } catch {
              // keep original value if URL resolution fails
            }
          }

          if (name.toLowerCase() === "srcset" && value) {
            try {
              const converted = value
                .split(",")
                .map((part) => {
                  const trimmed = part.trim();
                  if (!trimmed) return trimmed;
                  const [urlPart, descriptor] = trimmed.split(/\s+/, 2);
                  if (!urlPart || urlPart.startsWith("data:")) return trimmed;
                  const absolute = new URL(urlPart, document.baseURI).href;
                  return descriptor ? `${absolute} ${descriptor}` : absolute;
                })
                .join(", ");
              el.setAttribute(name, converted);
            } catch {
              // keep original srcset
            }
          }
        }
      });

      return clone;
    }

    const cleaned = cleanNode(target);
    const rect = target.getBoundingClientRect();

    return {
      html: cleaned.outerHTML,
      innerText: (target.innerText || "").trim(),
      width: Math.round(rect.width),
      height: Math.round(rect.height),
    };
  }, selector);
}

async function getFramerCanvasUrl(page) {
  return await page.evaluate(() => {
    const iframe = document.querySelector('iframe[src*="framercanvas.com/modules/play"]');
    if (!iframe) return null;
    const raw = iframe.getAttribute("src") || "";
    return raw.trim() || null;
  });
}

async function getRuntimeAssets(page) {
  return await page.evaluate(() => {
    const headLinks = [];
    const headInlineStyles = [];
    const bodyScripts = [];

    for (const el of Array.from(document.querySelectorAll('link[rel="modulepreload"], link[rel="preload"], link[rel="stylesheet"]'))) {
      const href = el.getAttribute("href");
      if (!href) continue;
      try {
        const abs = new URL(href, document.baseURI).href;
        const clone = el.cloneNode(true);
        clone.setAttribute("href", abs);
        headLinks.push(clone.outerHTML);
      } catch {
        // ignore malformed urls
      }
    }

    // Preserve Framer font-face styles (Inter Display etc.) from head.
    for (const style of Array.from(document.querySelectorAll("head style[data-framer-font-css], head style"))) {
      const text = (style.textContent || "").trim();
      if (!text) continue;
      const isFontStyle =
        style.hasAttribute("data-framer-font-css") ||
        /@font-face/i.test(text) ||
        /Inter Display|Inter Placeholder/i.test(text);
      if (!isFontStyle) continue;
      headInlineStyles.push(style.outerHTML);
    }

    // Preserve script order and attributes exactly, converting src to absolute when needed.
    for (const script of Array.from(document.querySelectorAll("script"))) {
      const clone = script.cloneNode(true);
      const src = clone.getAttribute("src");
      if (src) {
        try {
          const abs = new URL(src, document.baseURI).href;
          clone.setAttribute("src", abs);
        } catch {
          // keep original src if malformed
        }
      }
      bodyScripts.push(clone.outerHTML);
    }

    return {
      headInlineStyles: Array.from(new Set(headInlineStyles)),
      headLinks: Array.from(new Set(headLinks)),
      bodyScripts: Array.from(new Set(bodyScripts)),
    };
  });
}

async function main() {
  const outputDir = explicitOutputDir
    ? path.resolve(explicitOutputDir)
    : path.join(scriptDir, `extract-${sanitizeFileName(inputUrl)}`);
  ensureDir(outputDir);

  const browser = await launchBrowser();

  const page = await browser.newPage();
  page.setDefaultTimeout(45000);
  const networkCssParts = [];
  const seenNetworkCss = new Set();

  page.on("response", async (response) => {
    try {
      const request = response.request();
      const resourceType = request.resourceType();
      const url = response.url() || "";
      const contentType = (response.headers()?.["content-type"] || "").toLowerCase();
      const isCssLike =
        resourceType === "stylesheet" ||
        contentType.includes("text/css") ||
        /\.css(\?|$)/i.test(url);

      if (!isCssLike) return;
      if (!response.ok()) return;

      const cssText = (await response.text())?.trim();
      if (!cssText) return;
      if (seenNetworkCss.has(cssText)) return;

      seenNetworkCss.add(cssText);
      networkCssParts.push(`/* source: ${url || "network stylesheet"} */\n${cssText}`);
    } catch {
      // ignore CSS parse/network read issues
    }
  });

  await page.setUserAgent(
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
  );
  await page.setExtraHTTPHeaders({
    "accept-language": "en-US,en;q=0.9",
  });
  await page.evaluateOnNewDocument(() => {
    Object.defineProperty(navigator, "webdriver", {
      get: () => undefined,
    });
  });

  console.log("→ Открываю страницу:", inputUrl);
  await page.goto(inputUrl, { waitUntil: "domcontentloaded" });
  await page.waitForNetworkIdle({ idleTime: 1000, timeout: 45000 }).catch(() => {});

  await page.evaluate(() => {
    window.scrollTo(0, 0);
  });

  await new Promise((resolve) => setTimeout(resolve, 3500));

  const blockedInfo = await page.evaluate(() => {
    const text = (document.body?.innerText || "").toLowerCase();
    const title = (document.title || "").toLowerCase();
    const html = (document.documentElement?.outerHTML || "").toLowerCase();

    const blocked =
      text.includes("access denied") ||
      text.includes("verify you are human") ||
      text.includes("checking your browser") ||
      text.includes("blocked") ||
      title.includes("access denied") ||
      html.includes("cf-challenge") ||
      html.includes("captcha");

    return { blocked, title, textPreview: text.slice(0, 400) };
  });

  if (blockedInfo.blocked) {
    await page.screenshot({
      path: path.join(outputDir, "blocked.png"),
      fullPage: true,
    });
    throw new Error(
      "Framer page is blocked by anti-bot protection. Run with --headed and complete browser verification once."
    );
  }

  const title = await page.title();
  console.log("→ Title:", title || "(без title)");

  // Framer module pages are often just a wrapper + cross-origin iframe.
  // If we detect such iframe, switch to the playable framercanvas URL and continue extraction there.
  const canvasUrl = await getFramerCanvasUrl(page);
  if (canvasUrl) {
    console.log("→ Найден framercanvas iframe, переключаюсь на:", canvasUrl);
    await page.goto(canvasUrl, { waitUntil: "domcontentloaded" });
    await page.waitForNetworkIdle({ idleTime: 1000, timeout: 45000 }).catch(() => {});
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((resolve) => setTimeout(resolve, 2500));
  }

  const runtimeAssets = await getRuntimeAssets(page);

  const selector = inputSelector || (await autoDetectMainBlock(page));
  if (!selector) {
    await page.screenshot({
      path: path.join(outputDir, "detect-failed.png"),
      fullPage: true,
    });
    fs.writeFileSync(
      path.join(outputDir, "detect-failed.html"),
      await page.content(),
      "utf8"
    );
    throw new Error("Не удалось автоматически определить основной блок.");
  }

  console.log("→ Использую селектор:", selector);

  const handle = await page.$(selector);
  if (!handle) {
    throw new Error(`Элемент не найден по селектору: ${selector}`);
  }

  const tagName = await page.$eval(selector, (el) => (el.tagName || "").toLowerCase()).catch(() => "");
  if (tagName === "iframe") {
    console.warn("⚠️ Выбран iframe. Пытаюсь взять более верхний контейнер вместо iframe.");
  }

  const blockData = await getBlockData(page, selector);
  if (!blockData) {
    throw new Error("Не удалось получить данные выбранного блока.");
  }

  const boundingBox = await handle.boundingBox();
  if (boundingBox) {
    const clipHeight = Math.min(
      boundingBox.height,
      Math.max(320, boundingBox.width / CARD_PREVIEW_ASPECT_RATIO)
    );
    await page.screenshot({
      path: path.join(outputDir, "preview.png"),
      clip: {
        x: Math.max(0, boundingBox.x),
        y: Math.max(0, boundingBox.y),
        width: Math.max(1, boundingBox.width),
        height: Math.max(1, clipHeight),
      },
      captureBeyondViewport: true,
    });
  } else {
    await handle.screenshot({
      path: path.join(outputDir, "preview.png"),
    });
  }

  let fullCss = await getCssText(page);
  const networkCss = networkCssParts.join("\n\n").trim();
  if (networkCss) {
    fullCss = [networkCss, fullCss].filter(Boolean).join("\n\n");
  }
  if (!fullCss.trim()) {
    const pageHtml = await page.content();
    const inlineStyles = Array.from(
      pageHtml.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi),
      (m) => m[1] || ""
    )
      .map((css) => css.trim())
      .filter(Boolean)
      .join("\n\n");

    if (inlineStyles.trim()) {
      fullCss = `/* source: page.content() fallback */\n${inlineStyles}`;
      console.warn("⚠️ CSS из styleSheets не прочитан, использую fallback из <style> тегов HTML.");
    } else {
      console.warn("⚠️ CSS не найден. Попробуй запуск с --headed и после полной загрузки страницы.");
    }
  }

  const rootVariantInfo = getRootVariantInfoFromHtml(blockData.html);
  const knownRootVariants = rootVariantInfo
    ? collectVariantsFromCss(
        fullCss,
        rootVariantInfo.componentClass,
        rootVariantInfo.baseClass,
        rootVariantInfo.currentVariant
      )
    : [];

  const wrappedHtml = `<!doctype html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title || "Framer Extract"}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  ${runtimeAssets.headInlineStyles.join("\n  ")}
  ${runtimeAssets.headLinks.join("\n  ")}
  <link rel="stylesheet" href="./result.css" />
  <style>
    html, body {
      margin: 0;
      padding: 0;
      background: transparent;
      font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    }
    #main {
      width: 100%;
    }
    input, textarea, select, button {
      font-family: inherit;
    }
    /* Keep Framer form controls on the intended typeface */
    .framer-form-input,
    .framer-form-input::placeholder,
    .framer-form-text-input input,
    .framer-form-text-input textarea {
      font-family: "Inter Display", "Inter Display Placeholder", Inter, sans-serif !important;
    }
    /* Hide Framer editor/badge UI if injected after load */
    #__framer-editorbar,
    [id^="__framer-editorbar"],
    [class*="framer-editorbar"] {
      display: none !important;
      visibility: hidden !important;
      pointer-events: none !important;
    }
    .framer-extractor-menu-button {
      align-items: center;
      background: transparent;
      border: 0;
      border-radius: 8px;
      cursor: pointer;
      display: none;
      flex: 0 0 auto;
      height: 44px;
      justify-content: center;
      padding: 0;
      position: relative;
      width: 44px;
      z-index: 20;
    }
    .framer-extractor-menu-button span,
    .framer-extractor-menu-button::before,
    .framer-extractor-menu-button::after {
      background: currentColor;
      border-radius: 999px;
      content: "";
      height: 2px;
      left: 12px;
      position: absolute;
      transition: transform 0.18s ease, opacity 0.18s ease;
      width: 20px;
    }
    .framer-extractor-menu-button::before { transform: translateY(-6px); }
    .framer-extractor-menu-button::after { transform: translateY(6px); }
    .framer-extractor-menu-button[aria-expanded="true"] span { opacity: 0; }
    .framer-extractor-menu-button[aria-expanded="true"]::before { transform: rotate(45deg); }
    .framer-extractor-menu-button[aria-expanded="true"]::after { transform: rotate(-45deg); }
  </style>
</head>
<body>
<div id="main">
${blockData.html}
</div>
<script>
(() => {
  const injectedVariants = ${JSON.stringify(knownRootVariants)};
  const injectedVariantData = injectedVariants
    .map((item) => typeof item === "string" ? { variantClass: item, width: null } : item)
    .filter((item) => item && item.variantClass);

  function getRootSection() {
    const main = document.querySelector("#main");
    if (!main) return null;
    const framerRoot = main.querySelector("[data-framer-root]");
    if (framerRoot) return framerRoot;
    const candidates = Array.from(
      main.querySelectorAll("section[class*='framer-v-'], div[class*='framer-v-']")
    );
    if (!candidates.length) return main.firstElementChild;

    const preferred =
      candidates.find((el) => (el.getAttribute("data-framer-name") || "").toLowerCase() === "desktop") ||
      candidates.find((el) => el.tagName.toLowerCase() === "section") ||
      candidates[0];
    return preferred;
  }

  function collectRules(list, out) {
    for (const rule of Array.from(list || [])) {
      if (!rule) continue;
      if (rule.type === CSSRule.STYLE_RULE) out.push(rule);
      if (rule.cssRules) collectRules(rule.cssRules, out);
    }
  }

  function parseVariantMap(root) {
    const classes = Array.from(root.classList);
    const framerClasses = classes.filter((c) => /^framer-[A-Za-z0-9_-]+$/.test(c));
    const componentClass = framerClasses.find((c) => !c.startsWith("framer-v-"));
    const currentVariant = classes.find((c) => c.startsWith("framer-v-")) || null;
    const variantBaseClass = currentVariant ? currentVariant.replace(/^framer-v-/, "framer-") : null;
    const baseClass =
      (variantBaseClass && framerClasses.includes(variantBaseClass) ? variantBaseClass : null) ||
      framerClasses.find((c) => c !== componentClass && !c.startsWith("framer-v-"));

    if (!componentClass || !baseClass) return { currentVariant, variants: [] };

    const styleRules = [];
    for (const sheet of Array.from(document.styleSheets || [])) {
      try {
        collectRules(sheet.cssRules, styleRules);
      } catch {
        // ignore inaccessible sheets
      }
    }

    const variants = new Map();
    const hasCoreClasses = (selector) =>
      selector.includes("." + componentClass) && selector.includes("." + baseClass);
    const variantTokenRegex = /framer-v-[A-Za-z0-9_-]+/g;

    for (const rule of styleRules) {
      const selector = rule.selectorText || "";
      if (!hasCoreClasses(selector)) continue;

      const found = selector.match(variantTokenRegex) || [];
      if (!found.length && currentVariant) found.push(currentVariant);

      for (const variantClass of found) {
        if (!variants.has(variantClass)) variants.set(variantClass, { variantClass, width: null });

        const widthRaw = (rule.style && rule.style.width) || "";
        const width = /([0-9.]+)px/.test(widthRaw) ? Number(widthRaw.match(/([0-9.]+)px/)[1]) : null;
        if (width && !variants.get(variantClass).width) {
          variants.get(variantClass).width = width;
        }
      }
    }

    return { currentVariant, variants: Array.from(variants.values()) };
  }

  function chooseVariantByFit(root, variants, fallbackVariant) {
    const candidates = Array.from(
      new Set([
        ...variants.map((v) => v.variantClass).filter(Boolean),
        ...injectedVariantData.map((v) => v.variantClass).filter(Boolean),
      ])
    );
    if (!candidates.length) return fallbackVariant;

    const declaredWidths = [...variants, ...injectedVariantData]
      .filter((v) => v.variantClass && Number.isFinite(v.width))
      .sort((a, b) => b.width - a.width);

    if (declaredWidths.length) {
      const fit = declaredWidths.find((v) => v.width <= window.innerWidth + 0.5);
      return (fit || declaredWidths[declaredWidths.length - 1]).variantClass;
    }

    const current = Array.from(root.classList).find((c) => c.startsWith("framer-v-")) || fallbackVariant;
    let best = current || candidates[0];
    let bestOverflow = Number.POSITIVE_INFINITY;
    let bestWidth = 0;

    for (const candidate of candidates) {
      const existing = Array.from(root.classList).filter((c) => c.startsWith("framer-v-"));
      for (const v of existing) root.classList.remove(v);
      root.classList.add(candidate);

      const width = Math.round(root.getBoundingClientRect().width);
      const overflow = Math.max(0, width - window.innerWidth);

      if (
        overflow < bestOverflow ||
        (overflow === bestOverflow && width > bestWidth && width <= window.innerWidth)
      ) {
        best = candidate;
        bestOverflow = overflow;
        bestWidth = width;
      }
    }

    return best;
  }

  function applyResponsiveVariant() {
    const root = getRootSection();
    if (!root) return;
    if (root.dataset.framerExtractorMenuOpen === "true") return;

    const { currentVariant, variants } = parseVariantMap(root);
    const targetVariant = chooseVariantByFit(root, variants, currentVariant);
    if (!targetVariant) return;

    setFramerVariant(root, targetVariant);

    syncNestedFillComponents(root);
    syncFramerNavbarMenu(root);
  }

  function setFramerVariant(root, targetVariant) {
    if (!root || !targetVariant) return;
    const existing = Array.from(root.classList).filter((c) => c.startsWith("framer-v-"));
    for (const v of existing) root.classList.remove(v);
    root.classList.add(targetVariant);
  }

  function syncNestedFillComponents(root) {
    for (const wrapper of Array.from(root.querySelectorAll('[class*="-container"]'))) {
      if (!(wrapper instanceof HTMLElement)) continue;

      const child = wrapper.firstElementChild;
      if (!(child instanceof HTMLElement)) continue;

      const wrapperStyle = getComputedStyle(wrapper);
      const wrapperWidth = wrapper.getBoundingClientRect().width;
      const childWidth = child.getBoundingClientRect().width;
      const isFramerChild = Array.from(child.classList).some((c) => /^framer-[A-Za-z0-9_-]+$/.test(c));

      if (
        isFramerChild &&
        wrapperWidth >= 160 &&
        wrapperStyle.width !== "auto" &&
        childWidth < wrapperWidth * 0.9
      ) {
        child.style.width = "100%";
        child.style.maxWidth = "100%";
      }
    }
  }

  function installFramerHoverInteractions(root) {
    const scope = root || document;

    for (const item of Array.from(scope.querySelectorAll('[data-highlight="true"], a[class*="framer-"]'))) {
      if (!(item instanceof HTMLElement) || item.dataset.framerExtractorHover === "true") continue;
      item.dataset.framerExtractorHover = "true";
      const initialBackground = item.style.backgroundColor || "";
      item.addEventListener("mouseenter", () => {
        if (!item.style.backgroundColor || item.style.backgroundColor === "rgba(245, 245, 245, 0)") {
          item.style.backgroundColor = "rgba(245, 247, 250, 0.9)";
        }
      });
      item.addEventListener("mouseleave", () => {
        item.style.backgroundColor = initialBackground;
      });
    }

    const dropdowns = Array.from(scope.querySelectorAll('[data-framer-name*="Dropdown"], [data-framer-name*="Dropdawn"]'));
    for (const dropdownShell of dropdowns) {
      const dropdown = dropdownShell.matches('[class*="framer-v-"]')
        ? dropdownShell
        : dropdownShell.querySelector('[class*="framer-v-"]');
      if (!(dropdown instanceof HTMLElement) || dropdown.dataset.framerExtractorDropdown === "true") continue;

      const outerLayer = dropdown.querySelector('[data-framer-name="Outer Layer"]');
      if (!(outerLayer instanceof HTMLElement)) continue;

      dropdown.dataset.framerExtractorDropdown = "true";
      const initial = {
        height: dropdown.style.height,
        overflow: dropdown.style.overflow,
        zIndex: dropdown.style.zIndex,
        opacity: outerLayer.style.opacity,
        pointerEvents: outerLayer.style.pointerEvents,
      };

      const open = () => {
        dropdown.style.height = "min-content";
        dropdown.style.overflow = "visible";
        dropdown.style.zIndex = "1000";
        outerLayer.style.opacity = "1";
        outerLayer.style.pointerEvents = "auto";
      };
      const close = () => {
        dropdown.style.height = initial.height;
        dropdown.style.overflow = initial.overflow;
        dropdown.style.zIndex = initial.zIndex;
        outerLayer.style.opacity = initial.opacity || "0";
        outerLayer.style.pointerEvents = initial.pointerEvents || "none";
      };

      dropdown.addEventListener("mouseenter", open);
      dropdown.addEventListener("focusin", open);
      dropdown.addEventListener("mouseleave", close);
      dropdown.addEventListener("focusout", (event) => {
        if (!dropdown.contains(event.relatedTarget)) close();
      });
    }
  }

  function getMobileMenuVariants() {
    const mobile = injectedVariantData
      .filter((item) => item.variantClass && Number.isFinite(item.width) && item.width <= 430)
      .sort((a, b) => a.width - b.width);
    const unique = Array.from(new Set(mobile.map((item) => item.variantClass)));
    return { closed: unique[0] || null, open: unique[1] || unique[0] || null };
  }

  function installFramerNavbarMenu(root) {
    if (!root || root.dataset.framerExtractorMenuInstalled === "true") return;

    const { closed, open } = getMobileMenuVariants();
    if (!closed || !open || closed === open) return;

    const logoRow = root.querySelector('[data-framer-name="Logo + Menu"]');
    if (!(logoRow instanceof HTMLElement)) return;

    let button = root.querySelector(".framer-extractor-menu-button");
    if (!(button instanceof HTMLElement)) {
      button = document.createElement("button");
      button.type = "button";
      button.className = "framer-150lxge-container framer-extractor-menu-button";
      button.setAttribute("aria-label", "Toggle menu");
      button.setAttribute("aria-expanded", "false");
      button.innerHTML = "<span></span>";
      logoRow.appendChild(button);
    }

    root.dataset.framerExtractorMenuInstalled = "true";
    button.addEventListener("click", () => {
      const isOpen = root.classList.contains(open);
      root.dataset.framerExtractorMenuOpen = isOpen ? "false" : "true";
      setFramerVariant(root, isOpen ? closed : open);
      button.setAttribute("aria-expanded", String(!isOpen));
      syncNestedFillComponents(root);
      syncFramerNavbarMenu(root);
    });

    syncFramerNavbarMenu(root);
  }

  function syncFramerNavbarMenu(root) {
    if (!root) return;

    const button = root.querySelector(".framer-extractor-menu-button");
    if (!(button instanceof HTMLElement)) return;

    const { closed, open } = getMobileMenuVariants();
    const isMobile = Boolean(closed && root.classList.contains(closed)) || Boolean(open && root.classList.contains(open));
    button.style.display = isMobile ? "flex" : "none";
    button.setAttribute("aria-expanded", String(Boolean(open && root.classList.contains(open))));
  }

  function startFramerTickerAnimations(root) {
    const groups = Array.from(root.querySelectorAll('ul[role="group"]'))
      .filter((group) => group instanceof HTMLElement && group.querySelector(".ticker-item"));

    groups.forEach((group, index) => {
      if (group.dataset.framerExtractorTicker === "true") return;
      group.dataset.framerExtractorTicker = "true";

      const parent = group.parentElement;
      const parentStyle = parent ? getComputedStyle(parent) : null;
      const groupStyle = getComputedStyle(group);
      const parentClips =
        parentStyle &&
        (parentStyle.overflowX === "hidden" ||
          parentStyle.overflowX === "clip" ||
          parentStyle.overflow === "hidden" ||
          parentStyle.overflow === "clip");

      if (!parentClips && groupStyle.willChange !== "transform") return;

      const gap = Number.parseFloat(groupStyle.columnGap || groupStyle.gap || "0") || 0;
      const originalItems = Array.from(group.querySelectorAll(".ticker-item"))
        .filter((item) => item instanceof HTMLElement && item.dataset.framerExtractorClone !== "true");

      // Framer can preload ticker rows with per-item translateX offsets. Those offsets are
      // meaningful only while Framer's runtime is active; in the static export they create
      // gaps, especially on the reverse row, so normalize the visual track before cloning.
      originalItems.forEach((item) => {
        item.style.transform = "none";
      });

      const itemWidths = originalItems.map((item) => item.getBoundingClientRect().width).filter(Boolean);
      const cycleWidth = itemWidths.reduce((sum, width) => sum + width, 0) + Math.max(0, itemWidths.length - 1) * gap;
      if (!cycleWidth || !originalItems.length) return;

      const parentWidth = parent ? parent.getBoundingClientRect().width : window.innerWidth;
      const minTrackWidth = parentWidth + cycleWidth * 2;
      let currentTrackWidth = group.scrollWidth || cycleWidth;
      while (currentTrackWidth < minTrackWidth) {
        for (const item of originalItems) {
          const clone = item.cloneNode(true);
          clone.setAttribute("aria-hidden", "true");
          clone.dataset.framerExtractorClone = "true";
          clone.style.transform = "none";
          group.appendChild(clone);
        }
        currentTrackWidth += cycleWidth + gap;
      }

      const matrix = new DOMMatrixReadOnly(groupStyle.transform === "none" ? undefined : groupStyle.transform);
      const initialX = Number.isFinite(matrix.m41) ? matrix.m41 : 0;
      const speed = 38;
      const direction = index % 2 === 0 ? -1 : 1;
      const start = performance.now();

      function tick(now) {
        const elapsed = (now - start) / 1000;
        const offset = ((Math.abs(initialX) + elapsed * speed) % cycleWidth + cycleWidth) % cycleWidth;
        const x = direction < 0 ? -offset : offset - cycleWidth;
        group.style.transform = "translateX(" + x + "px)";
        requestAnimationFrame(tick);
      }

      requestAnimationFrame(tick);
    });
  }

  function getMeasuredHeight() {
    const root = getRootSection();
    const main = document.querySelector("#main");
    if (root) {
      root.style.setProperty("min-height", "auto", "important");
      root.style.setProperty("height", "auto", "important");
    }
    const rootRect = root ? root.getBoundingClientRect() : null;
    const componentHeights = [
      root?.scrollHeight || 0,
      root?.offsetHeight || 0,
      rootRect?.height || 0,
      main?.scrollHeight || 0,
      main?.offsetHeight || 0,
    ];
    const fallbackHeights = root
      ? []
      : [
          document.body?.scrollHeight || 0,
          document.documentElement?.scrollHeight || 0,
        ];

    return Math.ceil(Math.max(...componentHeights, ...fallbackHeights));
  }

  function postMeasuredHeight() {
    const height = getMeasuredHeight();
    if (height > 0 && window.parent && window.parent !== window) {
      window.parent.postMessage({ type: "resize", height }, "*");
    }
  }

  applyResponsiveVariant();
  installFramerHoverInteractions(document);
  installFramerNavbarMenu(getRootSection());
  startFramerTickerAnimations(document);
  window.addEventListener("resize", () => {
    const root = getRootSection();
    if (root) root.dataset.framerExtractorMenuOpen = "false";
    applyResponsiveVariant();
    requestAnimationFrame(postMeasuredHeight);
  }, { passive: true });
  window.addEventListener("load", () => setTimeout(postMeasuredHeight, 120));
  for (const img of Array.from(document.images || [])) {
    if (!img.complete) img.addEventListener("load", postMeasuredHeight, { once: true });
  }
  postMeasuredHeight();
  setTimeout(postMeasuredHeight, 400);
  setTimeout(postMeasuredHeight, 1200);
  setTimeout(applyResponsiveVariant, 400);
  setTimeout(() => {
    applyResponsiveVariant();
    postMeasuredHeight();
  }, 1500);
  setTimeout(() => {
    applyResponsiveVariant();
    postMeasuredHeight();
  }, 3500);
})();
</script>
${withRuntimeScripts ? runtimeAssets.bodyScripts.join("\n") : ""}
</body>
</html>`;

  fs.writeFileSync(path.join(outputDir, htmlFileName), wrappedHtml, "utf8");
  fs.writeFileSync(path.join(outputDir, "result.css"), fullCss, "utf8");
  fs.writeFileSync(
    path.join(outputDir, "meta.json"),
    JSON.stringify(
      {
        sourceUrl: inputUrl,
        selector,
        title,
        width: blockData.width,
        height: blockData.height,
        extractedAt: new Date().toISOString(),
        textPreview: blockData.innerText.slice(0, 300),
      },
      null,
      2
    ),
    "utf8"
  );

  await browser.close();

  console.log("\n✅ Готово");
  console.log("Папка:", outputDir);
  console.log("Файлы:");
  console.log("- preview.png");
  console.log(`- ${htmlFileName}`);
  console.log("- result.css");
  console.log("- meta.json");
}

main().catch((error) => {
  console.error("\n❌ Ошибка:", error.message);
  process.exit(1);
});
