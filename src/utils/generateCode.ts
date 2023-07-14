// This function is directly borrowed from github.com/yoksel/url-encoder
// https://github.com/yoksel/url-encoder/blob/master/src/js/script.js#LL133-L147C2
function encodeSVG(data: string) {
  // Use single quotes instead of double to avoid encoding.
  data = data.replace(/"/g, `'`);

  data = data.replace(/>\s{1,}</g, `><`);
  data = data.replace(/\s{2,}/g, ` `);

  // Using encodeURIComponent() as replacement function
  // allows to keep result code readable
  return "data:image/svg+xml," + data.replace(/[\r\n%#()<>?[\\\]^`{|}]/g, encodeURIComponent);
}

export default function generateCode({
  prefix,
  size,
  enableSVGO,
  enableBeforePseudo,
  enableWebkitPrefix,
  svgList
}: AppState) {
  const selectorPrefix = prefix || "icon";
  const sharedStyles = `${
    enableBeforePseudo
      ? `.${selectorPrefix} {
\tdisplay: inline-flex; /* Modify as per your needs. */
\talign-items: center;  /* Modify as per your needs. */
}\n`
      : ""
  }
.${selectorPrefix}${enableBeforePseudo ? "::before {" : " {"}
${
  enableBeforePseudo
    ? `\tcontent: "";
\tflex-shrink: 0;       /* Modify as per your needs. */
\tmargin-right: 4px;    /* Modify as per your needs. */`
    : `\tdisplay: block;       /* Modify as per your needs. */`
}
${size ? `\twidth: ${size};\n\theight: ${size};` : ""}
\tbackground: currentcolor;
\t${enableWebkitPrefix ? "-webkit-" : ""}mask-repeat: no-repeat;
\t${enableWebkitPrefix ? "-webkit-" : ""}mask-position: center;
}\n
`
    .replace(/^\n/, "")
    .replace(/\n\n\t/g, "\n\t");

  const svgCodeList = svgList
    .map((i: SVGEntry) => {
      const svgURI = encodeSVG(enableSVGO ? i.optimizedSVG : i.originalSVG);

      return `.${prefix ? prefix + "-" : ""}${i.name}${enableBeforePseudo ? "::before" : ""} {
\t${enableWebkitPrefix ? "-webkit-" : ""}mask-image: url("${svgURI}");
}`;
    })
    .join("\n\n");

  return sharedStyles + svgCodeList;
}
