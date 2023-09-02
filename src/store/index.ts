import { produce } from "solid-js/store";
import createLocalStore from "./createLocalStore";

const defaultState = {
  prefix: "icon",
  size: "24px",
  enableSVGO: true,
  enableWebkitPrefix: true,
  enableBeforePseudo: false,
  svgList: [] as SVGEntry[],
  previewColor: "#000",
  configVersion: 1
};

const [appState, setAppState] = createLocalStore<AppState>(defaultState);

const appStateModifiers = {
  updatePrefix: (prefix: string) => {
    setAppState(produce((s) => (s.prefix = prefix)));
  },
  updateSize: (size: string) => {
    setAppState(produce((s) => (s.size = size)));
  },
  toggleEnableSVGO: () => {
    setAppState(produce((s) => (s.enableSVGO = !s.enableSVGO)));
  },
  toggleEnableWebkitPrefix: () => {
    setAppState(produce((s) => (s.enableWebkitPrefix = !s.enableWebkitPrefix)));
  },
  toggleEnableBeforePseudo: () => {
    setAppState(produce((s) => (s.enableBeforePseudo = !s.enableBeforePseudo)));
  },
  addSVG: (entry: SVGEntry) => {
    setAppState(produce((s) => s.svgList.push(entry)));
  },
  removeSVG: (index: number) => {
    setAppState(produce((s) => s.svgList.splice(index, 1)));
  },
  renameSVG: (index: number, name: string) => {
    setAppState(produce((s) => (s.svgList[index].name = name)));
  },
  removeAllSVGs: () => {
    setAppState(produce((s) => (s.svgList = [])));
  },
  sortAlphabetically: () => {
    setAppState(produce((s) => (s.svgList = s.svgList.sort((a, b) => a.name.localeCompare(b.name)))));
  },
  updatePreviewColor: (color: string) => {
    setAppState(produce((s) => (s.previewColor = color)));
  },
  restoreConfig: (config: AppState) => {
    setAppState(config);
  }
};

export default { appState, appStateModifiers };
