interface SVGEntry {
  name: string;
  filename: string;
  svg: string;
}

interface Config {
  prefix: string;
  list: SVGEntry[];
}
