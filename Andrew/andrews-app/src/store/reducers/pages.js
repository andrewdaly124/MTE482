import { createReducer } from "typesafe-actions";
import {
  setCurrentPageNumber,
  setPageColor,
  setPageName,
  setPageDescription,
  setCurrentPresetNumber,
  setPresetFile,
  setPresetColor,
  setPresetDescription,
  setPresetName,
  setPotName,
} from "../actions";
import { DEFAULT_COLOR_HISTORY } from "./appState";

export const NUMPAGES = 20;
export const NUMPRESETS = 4; // probably won't change
export const NUMPOTS = 3;

export const MAX_NAME_LENGTH = 36;
export const MAX_DESCRIPTION_LENGTH = 248;

const DEFAULT_STATE = {
  pages: [],
  currentPageNumber: 1,
  currentPresetNumber: 1,
};

function getDefaultState() {
  // Empty pot
  function newEmptyPot(name) {
    return {
      name: name || "",
    };
  }

  // Empty effect preset
  function newEmptyPreset(file, name, description, color) {
    const emptyPots = [];
    for (let i = 0; i < NUMPOTS; i++) {
      emptyPots.push(newEmptyPot());
    }

    return {
      file: file || "",
      name: name || "",
      description: description || "",
      color: color || "",
      pots: emptyPots,
    };
  }

  // Empty page preset
  function newEmptyPage({ color, number, name, description }) {
    const emptyPresets = [];
    for (let i = 0; i < NUMPRESETS; i++) {
      emptyPresets.push(newEmptyPreset());
    }

    return {
      number,
      name: name ?? "",
      description: description ?? "",
      presets: emptyPresets,
      color:
        color ?? DEFAULT_COLOR_HISTORY[number % DEFAULT_COLOR_HISTORY.length],
    };
  }

  const emptyPages = [];
  for (let i = 0; i < NUMPAGES; i++) {
    emptyPages.push(newEmptyPage({ number: i }));
  }

  return { ...DEFAULT_STATE, pages: emptyPages };
}

const pages = createReducer(getDefaultState())
  .handleAction(setCurrentPageNumber, (state, { payload }) => {
    if (payload >= 1 && payload <= NUMPAGES) {
      return { ...state, currentPageNumber: payload };
    }
    return { ...state };
  })
  .handleAction(setPageName, (state, { payload: { index, newName } }) => {
    const pagesCopy = [...state.pages];
    pagesCopy[index].name = newName;
    return { ...state, pages: pagesCopy };
  })
  .handleAction(
    setPageDescription,
    (state, { payload: { index, newDescription } }) => {
      const pagesCopy = [...state.pages];
      pagesCopy[index].description = newDescription;
      return { ...state, pages: pagesCopy };
    }
  )
  .handleAction(setPageColor, (state, { payload: { index, newColor } }) => {
    const pagesCopy = [...state.pages];
    pagesCopy[index].color = newColor;
    return { ...state, pages: pagesCopy };
  })
  .handleAction(setCurrentPresetNumber, (state, { payload }) => {
    if (payload >= 1 && payload <= NUMPRESETS) {
      return { ...state, currentPresetNumber: payload };
    }
    return { ...state };
  })
  .handleAction(setPresetFile, (state, { payload }) => {
    const pagesCopy = [...state.pages];
    pagesCopy[state.currentPageNumber - 1].presets[
      state.currentPresetNumber - 1
    ].file = payload;
    return { ...state, pages: pagesCopy };
  })
  .handleAction(setPresetName, (state, { payload }) => {
    const pagesCopy = [...state.pages];
    pagesCopy[state.currentPageNumber - 1].presets[
      state.currentPresetNumber - 1
    ].name = payload;
    return { ...state, pages: pagesCopy };
  })
  .handleAction(setPresetDescription, (state, { payload }) => {
    const pagesCopy = [...state.pages];
    pagesCopy[state.currentPageNumber - 1].presets[
      state.currentPresetNumber - 1
    ].description = payload;
    return { ...state, pages: pagesCopy };
  })
  .handleAction(setPresetColor, (state, { payload }) => {
    const pagesCopy = [...state.pages];
    pagesCopy[state.currentPageNumber - 1].presets[
      state.currentPresetNumber - 1
    ].color = payload;
    return { ...state, pages: pagesCopy };
  })
  .handleAction(setPotName, (state, { payload: { name, index } }) => {
    const pagesCopy = [...state.pages];
    pagesCopy[state.currentPageNumber - 1].presets[
      state.currentPresetNumber - 1
    ].pots[index].name = name;
    return { ...state, pages: pagesCopy };
  });

export default pages;
