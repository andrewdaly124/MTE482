import store from "../store";
import { getPages } from "../store/selectors";

export function importJson(e) {
  if (e?.target?.files) {
    console.log(e?.target?.files);

    const reader = new FileReader();

    reader.onload = function () {
      const pagesRead = JSON.parse(reader.result);
      console.log(pagesRead);
    };

    reader.readAsBinaryString(e?.target?.files[0]);
  }
}

// Can only get name
export function importHex(e) {
  if (e?.target?.files) {
    if (e?.target?.files[0]) {
      console.log(e?.target?.files[0].name);
      return e?.target?.files[0].name;
    }
  }
  return undefined; // honestly not bad
}

export function exportProfile() {
  const pages = getPages(store.getState());
  console.log(pages);
  // const json = JSON.stringify(pages);
  // fs.writeFile("myjsonfile.json", json);
}
