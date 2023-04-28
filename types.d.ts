declare module "svgo/dist/svgo.browser.js";

interface SVGEntry {
  name: string;
  originalSVG: string;
  optimizedSVG: string;
}

interface AppState {
  prefix: string;
  enableSVGO: boolean;
  outputBackground: boolean;
  outputWebkitPrefix: boolean;
  svgList: SVGEntry[];
}
