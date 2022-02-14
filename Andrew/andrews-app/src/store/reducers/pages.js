import { createReducer } from "typesafe-actions";
import {
  setCurrentPageNumber,
  setPageColor,
  setPageName,
  setPageDescription,
} from "../actions";

export const NUMPAGES = 20;
export const NUMPRESETS = 4; // probably won't change

const DEFAULT_STATE = {
  pages: [],
  currentPageNumber: 1,
};

function getDefaultState() {
  // Empty effect preset
  function newEmptyPreset(file, name, description, color) {
    return {
      file: file || {},
      name: name || "",
      description: description || "",
      color: color || "",
    };
  }

  // Empty page preset
  function newEmptyPage(number, name, description) {
    const emptyPresets = [];
    for (let i = 0; i < NUMPRESETS; i++) {
      emptyPresets.push(newEmptyPreset());
    }

    return {
      number: number || 0,
      name: name || "",
      description: description || "",
      presets: emptyPresets,
    };
  }

  const emptyPages = [];
  for (let i = 0; i < NUMPAGES; i++) {
    emptyPages.push(newEmptyPage());
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
  });

export default pages;
