import { createRoot } from "solid-js";
import { createStore, produce } from "solid-js/store";

export enum OutputForm {
  CSS = "CSS",
  SCSS = "SCSS Variable"
}

type Config = {
  outputForm: OutputForm;
  cssSettings: CSSSettings;
  enableSVGO: boolean;
  prefix: string;
  svgList: SVGEntry[];
};

type AppStore = Config & {
  updateOutputForm: (form: OutputForm) => void;
  updateOutputBackgroundProperty: (isEnable: boolean) => void;
  updateOutputWebkitPrefix: (isEnable: boolean) => void;
  updateEnableSVGO: (isEnable: boolean) => void;
  updatePrefix: (prefix: string) => void;
  addSVG: (entry: SVGEntry) => void;
  removeSVG: (index: number) => void;
  resetConfig: (config: Config) => void;
  clearAll: () => void;
};

function createAppStore() {
  const [appStore, setAppStore] = createStore<AppStore>({
    outputForm: OutputForm.CSS,
    updateOutputForm: (form: OutputForm) => {
      setAppStore(
        produce((s) => {
          s.outputForm = form;
        })
      );
    },

    cssSettings: {
      outputBackgroundProperty: true,
      outputWebkitPrefix: false
    },
    updateOutputBackgroundProperty: (isEnable: boolean) => {
      setAppStore(produce((s) => (s.cssSettings.outputBackgroundProperty = isEnable)));
    },
    updateOutputWebkitPrefix: (isEnable: boolean) => {
      setAppStore(produce((s) => (s.cssSettings.outputWebkitPrefix = isEnable)));
    },

    enableSVGO: true,
    updateEnableSVGO: (isEnable: boolean) => {
      setAppStore(produce((s) => (s.enableSVGO = isEnable)));
    },

    prefix: "icon-",
    updatePrefix: (prefix: string) => {
      setAppStore(produce((s) => (s.prefix = prefix)));
    },

    svgList: [] as SVGEntry[],
    addSVG: (entry: SVGEntry) => {
      setAppStore(produce((s) => s.svgList.push(entry)));
    },
    removeSVG: (index: number) => {
      setAppStore(produce((s) => s.svgList.splice(index, 1)));
    },

    resetConfig: (config: Config) => {
      setAppStore(
        produce((s) => {
          s.outputForm = config.outputForm;
          s.cssSettings = config.cssSettings;
          s.enableSVGO = config.enableSVGO;
          s.prefix = config.prefix;
          s.svgList = config.svgList;
        })
      );
    },

    clearAll: () => {
      setAppStore(
        produce((s) => {
          s.outputForm = OutputForm.CSS;
          s.cssSettings = {
            outputBackgroundProperty: true,
            outputWebkitPrefix: false
          };
          s.enableSVGO = true;
          s.prefix = "icon-";
          s.svgList = [];
        })
      );
    }
  });

  return { appStore, setAppStore };
}

export default createRoot(createAppStore);
