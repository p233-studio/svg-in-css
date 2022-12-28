import encodeSVG from "./encodeSVG";

export function generateCSS(prefix: string, svgList: SVGEntry[], cssSettings: CSSSettings, enableSVGO: boolean) {
  return svgList
    .map((i) => {
      const svg = "data:image/svg+xml," + encodeSVG(enableSVGO ? i.optimizedSVG : i.originalSVG);
      // prettier-ignore
      return `.${prefix}${i.name} {\n\t${cssSettings.outputBackgroundProperty ? "background: currentcolor;\n\t" : ""}${cssSettings.outputWebkitPrefix ? "-webkit-" : ""}mask-image: url("${svg}");\n}`;
    })
    .join("\n\n");
}

export function generateSassVariables(prefix: string, svgList: SVGEntry[], enableSVGO: boolean) {
  return svgList
    .map((i) => {
      const svg = "data:image/svg+xml," + encodeSVG(enableSVGO ? i.optimizedSVG : i.originalSVG);
      return `$${prefix}${i.name}: "data:image/svg+xml,${svg}";`;
    })
    .join("\n\n");
}
