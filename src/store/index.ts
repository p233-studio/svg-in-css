import { produce } from "solid-js/store";
import createLocalStore from "./createLocalStore";

export enum OutputForm {
  CSS = "CSS Class",
  SCSS = "SCSS Variable"
}

type AppState = {
  outputForm: OutputForm;
  cssSettings: CSSSettings;
  enableSVGO: boolean;
  prefix: string;
  svgList: SVGEntry[];
};

const [appState, setAppState] = createLocalStore<AppState>({
  outputForm: OutputForm.CSS,
  cssSettings: {
    outputBackgroundProperty: true,
    outputWebkitPrefix: false
  },
  enableSVGO: true,
  prefix: "icon-",
  svgList: [] as SVGEntry[]
});

const updateAppState = {
  updateOutputForm: (form: OutputForm) => {
    setAppState(produce((s) => (s.outputForm = form)));
  },
  updateOutputBackgroundProperty: (isEnable: boolean) => {
    setAppState(produce((s) => (s.cssSettings.outputBackgroundProperty = isEnable)));
  },
  updateOutputWebkitPrefix: (isEnable: boolean) => {
    setAppState(produce((s) => (s.cssSettings.outputWebkitPrefix = isEnable)));
  },
  updateEnableSVGO: (isEnable: boolean) => {
    setAppState(produce((s) => (s.enableSVGO = isEnable)));
  },
  updatePrefix: (prefix: string) => {
    setAppState(produce((s) => (s.prefix = prefix)));
  },
  addSVG: (entry: SVGEntry) => {
    setAppState(produce((s) => s.svgList.push(entry)));
  },
  removeSVG: (index: number) => {
    setAppState(produce((s) => s.svgList.splice(index, 1)));
  },
  restoreConfig: (config: AppState) => {
    setAppState({
      outputForm: config.outputForm,
      cssSettings: config.cssSettings,
      enableSVGO: config.enableSVGO,
      prefix: config.prefix,
      svgList: config.svgList
    });
  },
  clearAll: () => {
    setAppState({
      outputForm: OutputForm.CSS,
      cssSettings: {
        outputBackgroundProperty: true,
        outputWebkitPrefix: false
      },
      enableSVGO: true,
      prefix: "icon-",
      svgList: [] as SVGEntry[]
    });
  }
};

export default { appState, updateAppState };
