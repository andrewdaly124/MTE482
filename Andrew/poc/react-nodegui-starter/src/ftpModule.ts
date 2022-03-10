import fs from "fs";
import Client from "ftp";

let pages: any;
const PATH: string = "../../profile/";
const CREDS: any = {
  host: "192.168.0.101",
  port: 21,
  user: "user",
  password: "password",
};

function readExistingProfile() {
  fs.readFile(PATH + "profile.json", (err, data) => {
    if (err) throw err;
    pages = JSON.parse(data.toString());
    console.log("Successfully Read profile.json");
  });
}

export function handlePagesInput(e: string) {
  pages = JSON.parse(e);
}

export function saveNewProfile() {
  const pagesJson = JSON.stringify(pages);
  fs.writeFile(PATH + "profile.json", pagesJson, () => {});
}

function verifyPage(page: any) {
  const presets = page.presets;

  for (let i = 0; i < presets.length; i++) {
    if (presets[i].file === "") {
      return false;
    }
  }
  return true;
}

function buildPageForEsp(page: any, index: number) {
  const newPage: any = {};

  newPage.name = page.name || `Page ${index + 1}`;

  const newPresets = [];

  let fileNum = 0 + 4 * index;

  for (let i = 0; i < page.presets.length; i++) {
    const newPreset: any = {};

    newPreset.file = page.presets[i].file;
    newPreset.tfFile = "effect" + fileNum + ".h";
    newPreset.name = page.presets[i].name || `Preset ${i + 1}`;

    fileNum++;

    const newPots = [];

    for (let j = 0; j < page.presets[i].pots.length; j++) {
      const newPot: any = {};

      newPot.name = page.presets[i].pots[j].name || `Potentiometer ${j + 1}`;
      newPot.value = 0;
      newPots.push(newPot);
    }
    newPreset.pots = newPots;
    newPresets.push(newPreset);
  }

  newPage.presets = newPresets;

  return newPage;
}

export function initiateFtp() {
  const pagesToSend = [];

  let index = 0;
  for (let i = 0; i < pages.length; i++) {
    if (verifyPage(pages[i])) {
      pagesToSend.push(buildPageForEsp(pages[i], index));
      index++;
    }
  }

  console.log(pagesToSend);

  const transferJson = JSON.stringify(pagesToSend);
  fs.writeFile(PATH + "transferProfile.json", transferJson, () => {});

  console.log("Beginning Transfer!");
  ftpUploadProfile(); //upload profile json

  for (let i = 0; i < pagesToSend.length; i++) {
    const presets = pagesToSend[i].presets;

    for (let j = 0; j < presets.length; j++) {
      ftpUploadPreset(presets[j]);
    }
  }

  console.log("Done!");
}

function ftpUploadProfile() {
  var c = new Client();
  c.on("ready", function () {
    c.put(PATH + "transferProfile.json", "profile.json", function (err) {
      if (err) throw err;
      c.end();
      console.log("profile transfered");
    });
  });
  c.connect(CREDS);
}

function ftpUploadPreset(preset: any) {
  var c = new Client();
  c.on("ready", function () {
    c.put(PATH + preset.file, preset.tfFile, function (err) {
      if (err) throw err;
      c.end();
      console.log("Transferred " + preset.file + " as " + preset.tfFile);
    });
  });
  c.connect(CREDS);
}

readExistingProfile();
