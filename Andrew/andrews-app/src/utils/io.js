import store from "../store";
import { getPages } from "../store/selectors";

// const fs = require("fs");
// const path = window.require("path");

export function uploadHex(e) {
  if (e?.target?.files) {
    console.log(e?.target?.files);

    const reader = new FileReader();

    reader.onload = function () {
      console.log(reader.result);
    };

    reader.readAsBinaryString(e?.target?.files[0]);
  }
}

export function exportProfile() {
  const pages = getPages(store.getState());
  const json = JSON.stringify(pages);
  // fs.writeFile("myjsonfile.json", json);
}
