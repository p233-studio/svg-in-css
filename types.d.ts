interface SVGEntry {
  name: string;
  filename: string;
  originalSVG: string;
  optimizedSVG: string;
}

interface Config {
  prefix: string;
  list: SVGEntry[];
}
