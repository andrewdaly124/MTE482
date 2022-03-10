import store from "../store";
import { getPages } from "../store/selectors";
import { setPagesExplicit } from "../store/actions";
import copyToClipboard from "./copyToClipboard";

export function importJson(e) {
  if (e?.target?.files) {
    const reader = new FileReader();

    reader.onload = function () {
      const pagesRead = JSON.parse(reader.result);
      store.dispatch(setPagesExplicit(pagesRead));
    };

    reader.readAsBinaryString(e?.target?.files[0]);
  }
}

// Can only get name
export function importHex(e) {
  if (e?.target?.files) {
    if (e?.target?.files[0]) {
      return e?.target?.files[0].name;
    }
  }
  return undefined; // honestly not bad
}

export function exportProfile() {
  const pages = getPages(store.getState());
  const pagesJson = JSON.stringify(pages);
  copyToClipboard(pagesJson);
}
