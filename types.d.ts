declare module "svgo/dist/svgo.browser.js";

interface SVGEntry {
  name: string;
  originalSVG: string;
  optimizedSVG: string;
}

interface AppState {
  configVersion: number;
  prefix: string;
  size: string;
  outputSize: boolean;
  outputCurrentColor: boolean;
  outputWebkitPrefix: boolean;
  enableSVGO: boolean;
  shareStyles: boolean;
  svgList: SVGEntry[];
}
