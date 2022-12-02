import { createRoot } from "solid-js";
import { createStore, produce } from "solid-js/store";

function createAppStore() {
  const [appStore, setAppStore] = createStore({
    list: [] as SVGEntry[],
    prefix: "icon-",
    updatePrefix: (prefix: string) => {
      setAppStore(
        produce((s) => {
          s.prefix = prefix;
        })
      );
    },
    addSVG: (entry: SVGEntry) => {
      setAppStore(produce((s) => s.list.push(entry)));
    },
    removeSVG: (index: number) => {
      setAppStore(produce((s) => s.list.splice(index, 1)));
    },
    resetConfig: (config: Config) => {
      setAppStore(
        produce((s) => {
          s.list = config.list;
          s.prefix = config.prefix;
        })
      );
    },
    clearAll: () => {
      setAppStore(
        produce((s) => {
          s.list = [];
          s.prefix = "icon-";
        })
      );
    }
  });
  return { appStore, setAppStore };
}

export default createRoot(createAppStore);
