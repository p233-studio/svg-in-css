import { createSignal, createMemo, Show, For } from "solid-js";
import Prism from "prismjs";
import store from "~/store";
import { generateCSS, generateSassVariables } from "~/utils/generateCode";
import css from "~/styles/styles.module.scss";
import type { Component } from "solid-js";

const scssGrammar = Prism.languages.extend("css", {
  property: {
    pattern: /(?:[-\w]|\$[-\w]|#\{\$[-\w]+\})+(?=\s*:)/,
    inside: {
      variable: /\$[-\w]+|#\{\$[-\w]+\}/
    }
  }
});

const App: Component = () => {
  const { appStore } = store;
  const [isOutputCSS, setIsOutputCSS] = createSignal(true);

  const code = createMemo(() => {
    return isOutputCSS()
      ? generateCSS(appStore.prefix, appStore.list)
      : generateSassVariables(appStore.prefix, appStore.list);
  });
  const codeHTML = createMemo(() => {
    return Prism.highlight(code(), scssGrammar, "scss");
  });
  const hasSVGs = createMemo(() => {
    return !!appStore.list.length;
  });

  const handleUploadSVGs = (e: any) => {
    Array.from(e.target.files).forEach((i: any) => {
      const reader = new FileReader();
      reader.readAsText(i);
      reader.onload = (e: any) => {
        appStore.addSVG({
          filename: i.name,
          name: i.name.replace(/\.svg$/, ""),
          svg: e.target.result
        });
      };
    });
  };

  const handleUploadJSON = (e: any) => {
    if (!e.target.files.length) return;

    const reader = new FileReader();
    reader.readAsText(e.target.files[0]);
    reader.onload = (e: any) => {
      const config = JSON.parse(e.target.result);
      appStore.resetConfig(config);
    };
  };

  const handleDownloadJSON = () => {
    const text = JSON.stringify({ prefix: appStore.prefix, list: appStore.list }, null, 2);

    const $link = document.createElement("a");
    $link.setAttribute("href", "data:text/plain;charset=utf-8," + encodeURIComponent(text));
    $link.setAttribute("download", "svg-in-css.config.json");
    $link.style.display = "none";
    document.body.appendChild($link);
    $link.click();

    document.body.removeChild($link);
  };

  const handleCopyToClipboard = () => {
    navigator.clipboard
      .writeText(code())
      .then(() => {
        console.log("success");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div class={css.page}>
      <main class={css.main}>
        <div class={css.container}>
          <div class={css.hgroup}>
            <h1>SVG in CSS</h1>
            <p>URL encoding SVGs</p>
            <Show
              when={hasSVGs()}
              fallback={
                <div>
                  <label>
                    <input type="file" multiple={true} accept=".svg" onChange={handleUploadSVGs} />
                    <span>Upload SVGs</span>
                  </label>
                  <label>
                    <input type="file" accept=".json" onChange={handleUploadJSON} />
                    <span>Upload Config JSON</span>
                  </label>
                </div>
              }
            >
              <div>
                <input
                  type="text"
                  value={appStore.prefix}
                  onInput={(e: any) => appStore.updatePrefix(e.target.value)}
                />
                <label>
                  <input type="radio" name="format" checked={isOutputCSS()} onChange={() => setIsOutputCSS(true)} />
                  <span>CSS</span>
                </label>
                <label>
                  <input type="radio" name="format" checked={!isOutputCSS()} onChange={() => setIsOutputCSS(false)} />
                  <span>SCSS variable</span>
                </label>
                <button onClick={handleCopyToClipboard}>Copy to clipboard</button>
              </div>
              <pre class={css.code} innerHTML={codeHTML()} />
            </Show>
          </div>
        </div>
      </main>
      <aside class={css.sidebar}>
        <div>
          <label>
            <input type="file" multiple={true} accept=".svg" onChange={handleUploadSVGs} />
            <span>Upload SVGs</span>
          </label>
          <label>
            <input type="file" accept=".json" onChange={handleUploadJSON} />
            <span>Upload Config JSON</span>
          </label>
          <Show when={hasSVGs()}>
            <button onClick={appStore.clearAll}>Clear all</button>
            <button onClick={handleDownloadJSON}>Download config.json</button>
          </Show>
        </div>
        <div>
          <For each={appStore.list}>
            {(i, idx) => (
              <div>
                <img src={`data:image/svg+xml;utf8,${i.svg}`} />
                <span>{i.filename}</span>
                <button onClick={() => appStore.removeSVG(idx())}>X</button>
              </div>
            )}
          </For>
        </div>
      </aside>
    </div>
  );
};

export default App;
