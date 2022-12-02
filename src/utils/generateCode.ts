import encodeSVG from "./encodeSVG";

export function generateCSS(prefix: string, list: SVGEntry[]) {
  // prettier-ignore
  return list
    .map((i) => `.${prefix}${i.name} {\n\tbackground: currentcolor;\n\tmask-image: url("data:image/svg+xml,${encodeSVG(i.svg)}");\n}`)
    .join("\n\n");
}

export function generateSassVariables(prefix: string, list: SVGEntry[]) {
  return list.map((i) => `$${prefix}${i.name}: "data:image/svg+xml,${encodeSVG(i.svg)}";`).join("\n\n");
}
