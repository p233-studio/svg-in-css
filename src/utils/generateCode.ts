import encodeSVG from "./encodeSVG";

export function generateCSS(prefix: string, list: SVGEntry[], enableSVGO: boolean) {
  return list
    .map((i) => {
      const svg = "data:image/svg+xml," + encodeSVG(enableSVGO ? i.optimizedSVG : i.originalSVG);
      return `.${prefix}${i.name} {\n\tbackground: currentcolor;\n\tmask-image: url("${svg}");\n}`;
    })
    .join("\n\n");
}

export function generateSassVariables(prefix: string, list: SVGEntry[], enableSVGO: boolean) {
  return list
    .map((i) => {
      const svg = "data:image/svg+xml," + encodeSVG(enableSVGO ? i.optimizedSVG : i.originalSVG);
      return `$${prefix}${i.name}: "data:image/svg+xml,${svg}";`;
    })
    .join("\n\n");
}
