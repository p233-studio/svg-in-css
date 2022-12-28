import { createEffect } from "solid-js";
import { createStore, SetStoreFunction, Store } from "solid-js/store";

export default function createLocalStore<T extends object>(init: T): [Store<T>, SetStoreFunction<T>] {
  const localState = localStorage.getItem("APP_STORE");
  const [state, setState] = createStore<T>(localState ? JSON.parse(localState) : init);
  createEffect(() => localStorage.setItem("APP_STORE", JSON.stringify(state)));
  return [state, setState];
}
