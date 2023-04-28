import encodeSVG from "./encodeSVG";

export default function generateCodeSnippet({
  prefix,
  enableSVGO,
  outputBackground,
  outputWebkitPrefix,
  svgList
}: AppState) {
  return svgList
    .map((i: SVGEntry) => {
      const svg = "data:image/svg+xml," + encodeSVG(enableSVGO ? i.optimizedSVG : i.originalSVG);
      // prettier-ignore
      return `.${prefix}${i.name} {\n\t${outputBackground ? "background: currentcolor;\n\t" : ""}${outputWebkitPrefix ? "-webkit-" : ""}mask-image: url("${svg}");\n}`;
    })
    .join("\n\n");
}
