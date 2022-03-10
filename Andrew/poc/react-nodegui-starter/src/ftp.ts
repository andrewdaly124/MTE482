const fs = require("fs");
const Client = require("ftp");

const NUMPAGES = 20;
const NUMPRESETS = 4; // probably won't change
const DEFAULT_COLOR_HISTORY = [
  "FFFFFF",
  "FF0000",
  "FFBF00",
  "00FF40",
  "00FFFF",
  "0040FF",
  "8000FF",
  "FF00BF",
];

function getPages() {
  // Empty effect preset
  function newEmptyPreset(file, name, description) {
    return {
      file: file || "",
      name: name || "",
      description: description || "",
    };
  }

  // Empty page preset
  function newEmptyPage({ number, name, description }) {
    if (number !== 0) {
      const emptyPresets = [];
      for (let i = 0; i < NUMPRESETS; i++) {
        emptyPresets.push(newEmptyPreset());
      }

      return {
        number,
        name: name ?? "",
        description: description ?? "",
        presets: emptyPresets,
      };
    } else {
      const emptyPresets = [];
      for (let i = 0; i < NUMPRESETS; i++) {
        emptyPresets.push(
          newEmptyPreset(`test${i}.hex`, `Name ${i}`, `Description ${i}`)
        );
      }

      return {
        number,
        name: `Preset Name ${number}`,
        description: `Preset Description ${number}`,
        presets: emptyPresets,
      };
    }
  }

  const emptyPages = [];
  for (let i = 0; i < NUMPAGES; i++) {
    emptyPages.push(newEmptyPage({ number: i }));
  }

  return emptyPages;
}

function tsTest() {
  console.log("Hello World! From Andrew");

  const test = { test: "test", testAgain: 1, random: Math.random() };
  const json = JSON.stringify(test);
  fs.writeFile("myjsonfile.json", json, () => {});

  const pages = getPages();
  const pagesJson = JSON.stringify(pages);
  fs.writeFile("pagesTest.json", pagesJson, () => {});

  return "clicked";
}

function ftpUpload() {
  var c = new Client();
  c.on("ready", function () {
    // c.put("testHexFile.hex", "testHexFile.hex", function (err) {
    c.put("myjsonfile.json", "myJsonTest.json", function (err) {
      if (err) throw err;
      c.end();
    });
  });
  // connect to localhost:21 as anonymous
  c.connect();
}

tsTest();
ftpUpload();
