declare module "svgo/dist/svgo.browser.js";

interface SVGEntry {
  name: string;
  filename: string;
  originalSVG: string;
  optimizedSVG: string;
}

interface CSSSettings {
  outputBackgroundProperty?: boolean;
  outputWebkitPrefix?: boolean;
}
