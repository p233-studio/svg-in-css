// This function is directly borrowed from github.com/yoksel/url-encoder
// https://github.com/yoksel/url-encoder/blob/master/src/js/script.js#LL133-L147C2

const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;

export default function encodeSVG(data: string) {
  // Use single quotes instead of double to avoid encoding.
  data = data.replace(/"/g, `'`);

  data = data.replace(/>\s{1,}</g, `><`);
  data = data.replace(/\s{2,}/g, ` `);

  // Using encodeURIComponent() as replacement function
  // allows to keep result code readable
  return data.replace(symbols, encodeURIComponent);
}
