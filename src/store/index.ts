import { produce } from "solid-js/store";
import createLocalStore from "./createLocalStore";

const defaultState = {
  prefix: "icon-",
  enableSVGO: true,
  outputBackground: true,
  outputWebkitPrefix: false,
  svgList: [] as SVGEntry[]
};

const [appState, setAppState] = createLocalStore<AppState>(defaultState);

const updateAppState = {
  updatePrefix: (prefix: string) => {
    setAppState(produce((s) => (s.prefix = prefix)));
  },
  updateEnableSVGO: (isEnable: boolean) => {
    setAppState(produce((s) => (s.enableSVGO = isEnable)));
  },
  updateOutputBackground: (isEnable: boolean) => {
    setAppState(produce((s) => (s.outputBackground = isEnable)));
  },
  updateOutputWebkitPrefix: (isEnable: boolean) => {
    setAppState(produce((s) => (s.outputWebkitPrefix = isEnable)));
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
  removeAll: () => {
    setAppState(produce((s) => (s.svgList = [])));
  },
  sortAlphabetically: () => {
    setAppState(produce((s) => (s.svgList = s.svgList.sort((a, b) => a.name.localeCompare(b.name)))));
  },
  restoreConfig: (config: AppState) => {
    setAppState({
      prefix: config.prefix,
      enableSVGO: config.enableSVGO,
      outputBackground: config.outputBackground,
      outputWebkitPrefix: config.outputWebkitPrefix,
      svgList: config.svgList
    });
  }
};

export default { appState, updateAppState };
