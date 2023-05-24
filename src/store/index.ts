import { produce } from "solid-js/store";
import createLocalStore from "./createLocalStore";

const defaultState = {
  configVersion: 1,
  prefix: "icon-",
  size: "20px",
  outputSize: true,
  outputCurrentColor: true,
  outputWebkitPrefix: true,
  enableSVGO: true,
  shareStyles: true,
  svgList: [] as SVGEntry[]
};

const [appState, setAppState] = createLocalStore<AppState>(defaultState);

const appStateModifiers = {
  updatePrefix: (prefix: string) => {
    setAppState(produce((s) => (s.prefix = prefix)));
  },
  updateSize: (size: string) => {
    setAppState(produce((s) => (s.size = size)));
  },
  toggleOutputSize: () => {
    setAppState(
      produce((s) => {
        s.outputSize = !s.outputSize;
        if (!s.outputSize && !s.outputCurrentColor) s.shareStyles = false;
      })
    );
  },
  toggleOutputCurrentColor: () => {
    setAppState(
      produce((s) => {
        s.outputCurrentColor = !s.outputCurrentColor;
        if (!s.outputSize && !s.outputCurrentColor) s.shareStyles = false;
      })
    );
  },
  toggleOutputWebkitPrefix: () => {
    setAppState(produce((s) => (s.outputWebkitPrefix = !s.outputWebkitPrefix)));
  },
  toggleEnableSVGO: () => {
    setAppState(produce((s) => (s.enableSVGO = !s.enableSVGO)));
  },
  toggleShareStyles: () => {
    setAppState(produce((s) => (s.shareStyles = !s.shareStyles)));
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
  restoreConfig: (config: AppState) => {
    setAppState(config);
  }
};

export default { appState, appStateModifiers };
