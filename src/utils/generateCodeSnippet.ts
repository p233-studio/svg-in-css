import encodeSVG from "./encodeSVG";

function generateSharedCode(prefix: string, size: string, outputSize: boolean, outputCurrentColor: boolean) {
  const selector = `.${prefix.replace(/[-_]*$/, "") || "icon"}`;
  const sizeProperty = outputSize && size ? `width: ${size};\n\theight: ${size};` : "";
  const backgronudProperty = outputCurrentColor ? "background: currentcolor;" : "";

  if (sizeProperty && backgronudProperty) {
    return `${selector} {\n\t${sizeProperty}\n\t${backgronudProperty}\n}\n\n`;
  }
  return `${selector} {\n\t${sizeProperty}${backgronudProperty}\n}\n\n`;
}

export default function generateCodeSnippet({
  prefix,
  size,
  outputSize,
  outputCurrentColor,
  outputWebkitPrefix,
  enableSVGO,
  shareStyles,
  svgList
}: AppState) {
  const sharedCode = shareStyles ? generateSharedCode(prefix, size, outputSize, outputCurrentColor) : "";
  const svgCodeList = svgList
    .map((i: SVGEntry) => {
      const svg = "data:image/svg+xml," + encodeSVG(enableSVGO ? i.optimizedSVG : i.originalSVG);
      const selector = `.${prefix}${i.name}`;
      const sizeProperty = !shareStyles && outputSize && size ? `width: ${size};\n\theight: ${size};\n\t` : "";
      const backgronudProperty = !shareStyles && outputCurrentColor ? "background: currentcolor;\n\t" : "";
      const maskImageProperty = `${outputWebkitPrefix ? "-webkit-" : ""}mask-image: url("${svg}");`;

      return `${selector} {\n\t${sizeProperty}${backgronudProperty}${maskImageProperty}\n}`;
    })
    .join("\n\n");

  return sharedCode + svgCodeList;
}
