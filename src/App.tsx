import { createSignal, createEffect, createMemo, onCleanup, Show, For } from "solid-js";
import { optimize } from "svgo/dist/svgo.browser.js";
import Prism from "prismjs";
import store, { OutputForm } from "~/store";
import { generateCSSClasses, generateSassVariables } from "~/utils/generateCode";
import css from "~/styles/styles.module.scss";
import { version } from "../package.json";
import type { Component } from "solid-js";

const scssGrammar = Prism.languages.extend("css", {
  property: {
    pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
    inside: {
      variable: /\$[-\w]+|#\{\$[-\w]+\}/
    }
  }
});

const getSVGOConfig = (filename: string) => {
  return {
    plugins: [
      "preset-default",
      "removeDimensions",
      {
        name: "prefixIds",
        params: { prefix: filename }
      }
    ]
  };
};

const App: Component = () => {
  const { appState, updateAppState } = store;

  const [isDropdownOpen, setIsDropdownOpen] = createSignal(false);
  let $menu: HTMLDivElement;
  const handleOutsideClick = (e: any) => !$menu.contains(e.target) && setIsDropdownOpen(false);
  createEffect(() => {
    if (isDropdownOpen()) {
      document.addEventListener("mousedown", handleOutsideClick);
      onCleanup(() => document.removeEventListener("mousedown", handleOutsideClick));
    }
  });

  const code = createMemo(() => {
    return appState.outputForm === OutputForm.CSS
      ? generateCSSClasses(appState.prefix, appState.svgList, appState.cssSettings, appState.enableSVGO)
      : generateSassVariables(appState.prefix, appState.svgList, appState.enableSVGO);
  });
  const codeHTML = createMemo(() => {
    return Prism.highlight(code(), scssGrammar, "scss");
  });
  const hasSVGs = createMemo(() => {
    return !!appState.svgList.length;
  });

  const handleUploadSVGs = (e: any) => {
    Array.from(e.target.files).forEach((i: any) => {
      const reader = new FileReader();
      reader.readAsText(i);
      reader.onload = (e: any) => {
        const name = i.name.replace(/\.svg$/, "");
        updateAppState.addSVG({
          name,
          filename: i.name,
          originalSVG: e.target.result,
          optimizedSVG: optimize(e.target.result, getSVGOConfig(name)).data
        });
      };
    });
  };

  const handleUploadConfigJSON = (e: any) => {
    if (!e.target.files.length) return;

    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = (e: any) => {
      const config = JSON.parse(e.target.result);
      updateAppState.restoreConfig(config);
    };
  };

  const handleDownloadConfigJSON = () => {
    const text = JSON.stringify(
      {
        configVersion: "1",
        outputForm: appState.outputForm,
        cssSettings: appState.outputForm === OutputForm.CSS ? appState.cssSettings : {},
        enableSVGO: appState.enableSVGO,
        prefix: appState.prefix,
        svgList: appState.svgList
      },
      null,
      2
    );

    const $link = document.createElement("a");
    $link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    $link.setAttribute("download", "svg-in-css.config.json");
    $link.style.display = "none";
    document.body.appendChild($link);
    $link.click();

    document.body.removeChild($link);
  };

  const handleClearAll = () => {
    if (confirm("Will delete all SVG data. Are you sure to continue?")) {
      updateAppState.clearAll();
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(code()).catch(console.error);
  };

  return (
    <div class={css.page} classList={{ [css.hasSVGs]: hasSVGs() }}>
      <main class={css.main}>
        <div class={css.container}>
          <div class={css.hgroup}>
            <h1>SVG in CSS</h1>
            <p>URL encoding SVGs</p>
            <Show
              when={hasSVGs()}
              fallback={
                <div class={css.mainUploadButtons}>
                  <label>
                    <input type="file" accept=".json" onChange={handleUploadConfigJSON} />
                    <span>Upload config.json</span>
                  </label>
                  <label>
                    <input type="file" multiple={true} accept=".svg" onChange={handleUploadSVGs} />
                    <span>Upload SVGs</span>
                  </label>
                </div>
              }
            >
              <div class={css.mainController}>
                <label class={css.prefixInput}>
                  <input
                    type="text"
                    value={appState.prefix}
                    onInput={(e: any) => updateAppState.updatePrefix(e.target.value)}
                  />
                </label>

                <label class={css.formSelect}>
                  <button class={css.formSelect__trigger} onMouseDown={() => setIsDropdownOpen(true)}>
                    {appState.outputForm}
                  </button>
                  <div
                    class={css.formSelect__menu}
                    classList={{ [css.show]: isDropdownOpen() }}
                    ref={(el) => ($menu = el)}
                  >
                    <button
                      classList={{ [css.active]: appState.outputForm === OutputForm.CSS }}
                      onClick={() => updateAppState.updateOutputForm(OutputForm.CSS)}
                    >
                      {OutputForm.CSS}
                    </button>
                    <Show when={appState.outputForm === OutputForm.CSS}>
                      <button
                        classList={{ [css.active]: appState.cssSettings.outputBackgroundProperty }}
                        onClick={() =>
                          updateAppState.updateOutputBackgroundProperty(!appState.cssSettings.outputBackgroundProperty)
                        }
                      >
                        Background Property
                      </button>
                      <button
                        classList={{ [css.active]: appState.cssSettings.outputWebkitPrefix }}
                        onClick={() =>
                          updateAppState.updateOutputWebkitPrefix(!appState.cssSettings.outputWebkitPrefix)
                        }
                      >
                        Webkit Prefix
                      </button>
                    </Show>
                    <button
                      classList={{ [css.active]: appState.outputForm === OutputForm.SCSS }}
                      onClick={() => updateAppState.updateOutputForm(OutputForm.SCSS)}
                    >
                      {OutputForm.SCSS}
                    </button>
                  </div>
                </label>

                <label class={css.svgoButton}>
                  <input
                    type="checkbox"
                    checked={appState.enableSVGO}
                    onChange={() => updateAppState.updateEnableSVGO(!appState.enableSVGO)}
                  />
                  <span>Enable SVGO</span>
                </label>
                <button onClick={handleCopyToClipboard} class={css.clipboardButton}>
                  Copy to clipboard
                </button>
              </div>
              <pre class={css.code} innerHTML={codeHTML()} />
            </Show>
          </div>
          <footer class={css.footer}>Version: {version}</footer>
        </div>
      </main>
      <aside class={css.sidebar}>
        <div class={css.sidebarButtons}>
          <label>
            <input type="file" multiple={true} accept=".svg" onChange={handleUploadSVGs} />
            <span>Upload SVGs</span>
          </label>
          <Show when={hasSVGs()}>
            <button onClick={handleDownloadConfigJSON}>Download config.json</button>
            <button onClick={handleClearAll}>Clear all</button>
            <button onClick={updateAppState.sortAlphabetically}>Sort alphabetically</button>
          </Show>
        </div>
        <div class={css.sidebarList}>
          <For each={appState.svgList}>
            {(i, idx) => (
              <div class={css.entry}>
                <img
                  class={css.entry__image}
                  src={`data:image/svg+xml;utf8,${appState.enableSVGO ? i.optimizedSVG : i.originalSVG}`}
                />
                <span class={css.entry__filename}>{i.filename}</span>
                <button class={css.entry__remove} onClick={() => updateAppState.removeSVG(idx())} />
              </div>
            )}
          </For>
        </div>
      </aside>
    </div>
  );
};

export default App;
