import { createSignal, createEffect, createMemo, onCleanup, Show, For } from "solid-js";
import { optimize } from "svgo/dist/svgo.browser.js";
import Prism from "prismjs";
import store from "~/store";
import generateCodeSnippet from "~/utils/generateCodeSnippet";
import css from "~/styles/styles.module.scss";
import { version } from "../package.json";
import type { Component } from "solid-js";

const getSVGOConfig = (prefix: string) => {
  return {
    plugins: [
      "preset-default",
      "removeDimensions",
      {
        name: "prefixIds",
        params: { prefix }
      }
    ]
  };
};

const Toggle = (props: { isActive: boolean; onClick: () => void }) => (
  <button class={css.toggle} classList={{ [css.active]: props.isActive }} onClick={() => props.onClick()}>
    <span>On</span>
    <span>Off</span>
  </button>
);

const App: Component = () => {
  const { appState, updateAppState } = store;

  const [isModalOpen, setIsModalOpen] = createSignal(false);
  let $modal: HTMLDivElement;
  const handleModalOutsideClick = (e: any) => !$modal.contains(e.target) && setIsModalOpen(false);
  createEffect(() => {
    if (isModalOpen()) {
      document.addEventListener("mousedown", handleModalOutsideClick);
      onCleanup(() => document.removeEventListener("mousedown", handleModalOutsideClick));
    }
  });

  const code = createMemo(() => {
    return generateCodeSnippet(appState);
  });
  const codeHTML = createMemo(() => {
    return Prism.highlight(code(), Prism.languages["css"], "css");
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
    const content = JSON.stringify(
      {
        prefix: appState.prefix,
        enableSVGO: appState.enableSVGO,
        outputBackground: appState.outputBackground,
        outputWebkitPrefix: appState.outputWebkitPrefix,
        svgList: appState.svgList
      },
      null,
      2
    );

    const $link = document.createElement("a");
    $link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(content));
    $link.setAttribute("download", "svg-in-css.config.json");
    $link.style.display = "none";
    document.body.appendChild($link);
    $link.click();

    document.body.removeChild($link);
  };

  const handleDownloadSVG = (idx: number) => {
    const target = appState.svgList[idx];

    const $link = document.createElement("a");
    $link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(target.originalSVG));
    $link.setAttribute("download", `${target.name}.svg`);
    $link.style.display = "none";
    document.body.appendChild($link);
    $link.click();

    document.body.removeChild($link);
  };

  const handleRemoveAll = () => {
    if (confirm("Will remove all SVGs. Are you sure to continue?")) {
      updateAppState.removeAll();
    }
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(code()).catch(console.error);
  };

  const handleRenameSVG = (idx: number, e: any) => {
    const name = e.target.textContent;
    if (!name) {
      e.target.innerHTML = appState.svgList[idx].name;
      return;
    }
    updateAppState.renameSVG(idx, name);
  };

  const handleRenameSVGConfirm = (e: any) => {
    if (e.which === 13) {
      e.preventDefault();
      e.target.blur();
    }
  };

  return (
    <div class={css.page} classList={{ [css.hasSVGs]: hasSVGs() }}>
      <main class={css.main}>
        <div class={css.main__container}>
          <div class={css.main__hgroup}>
            <h1>SVG in CSS</h1>
            <p>URL encoding SVGs</p>
          </div>

          <Show
            when={hasSVGs()}
            fallback={
              <div class={css.main__buttonGroup}>
                <label class={css.button}>
                  <input type="file" accept=".json" onChange={handleUploadConfigJSON} />
                  <span>Upload config.json</span>
                </label>
                <label class={css.button}>
                  <input type="file" multiple={true} accept=".svg" onChange={handleUploadSVGs} />
                  <span>Upload SVGs</span>
                </label>
              </div>
            }
          >
            <div class={css.main__buttonGroup}>
              <button
                class={[css.button, css.settingsButton].join(" ")}
                classList={{ [css.show]: isModalOpen() }}
                onMouseDown={() => setIsModalOpen(true)}
              >
                Settings
              </button>
              <button class={[css.button, css.copyButton].join(" ")} onClick={handleCopyToClipboard}>
                Copy snippets
              </button>
            </div>
            <pre class={css.code} innerHTML={codeHTML()} />
          </Show>

          <div class={css.settingsModal} classList={{ [css.show]: isModalOpen() }}>
            <dl class={css.settingsModal__box} ref={(el) => ($modal = el)}>
              <dt>Prefix</dt>
              <dd>
                <input
                  type="text"
                  value={appState.prefix}
                  onInput={(e: any) => updateAppState.updatePrefix(e.target.value)}
                  class={css.prefixInput}
                />
              </dd>
              <dt>Enable SVGO</dt>
              <dd>
                <Toggle
                  isActive={appState.enableSVGO}
                  onClick={() => updateAppState.updateEnableSVGO(!appState.enableSVGO)}
                />
              </dd>
              <dt>Current Color</dt>
              <dd>
                <Toggle
                  isActive={appState.outputBackground}
                  onClick={() => updateAppState.updateOutputBackground(!appState.outputBackground)}
                />
              </dd>
              <dt>Webkit Prefix</dt>
              <dd>
                <Toggle
                  isActive={appState.outputWebkitPrefix}
                  onClick={() => updateAppState.updateOutputWebkitPrefix(!appState.outputWebkitPrefix)}
                />
              </dd>
            </dl>
          </div>

          <footer class={css.main__footer}>Version: {version}</footer>
        </div>
      </main>
      <aside class={css.sidebar}>
        <div class={css.sidebar__buttonGroup}>
          <label>
            <input type="file" multiple={true} accept=".svg" onChange={handleUploadSVGs} />
            <span class={css.button}>Upload more SVGs</span>
          </label>
          <button class={css.button} onClick={updateAppState.sortAlphabetically}>
            Sort alphabetically
          </button>
          <button class={css.button} onClick={handleDownloadConfigJSON}>
            Download config.json
          </button>
          <button class={css.button} onClick={handleRemoveAll}>
            Remove all SVGs
          </button>
        </div>
        <div class={css.sidebar__svgList}>
          <For each={appState.svgList}>
            {(i, idx) => (
              <div class={css.sidebarEntry}>
                <img
                  class={css.sidebarEntry__image}
                  src={`data:image/svg+xml;utf8,${appState.enableSVGO ? i.optimizedSVG : i.originalSVG}`}
                />
                <span class={css.sidebarEntry__filename}>
                  <span
                    class={css.sidebarEntry__input}
                    contentEditable
                    onKeyPress={handleRenameSVGConfirm}
                    onBlur={(e) => handleRenameSVG(idx(), e)}
                  >
                    {i.name}
                  </span>
                  .svg
                </span>
                <button class={css.sidebarEntry__download} onClick={() => handleDownloadSVG(idx())} />
                <button class={css.sidebarEntry__remove} onClick={() => updateAppState.removeSVG(idx())} />
              </div>
            )}
          </For>
        </div>
      </aside>
    </div>
  );
};

export default App;
