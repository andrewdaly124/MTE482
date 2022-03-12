/**
 * TODO:
 * type returns and state
 */

export const getCurrentPageNumber = (state) => state.pages.currentPageNumber;

export const getCurrentPage = (state) =>
  state.pages.pages[state.pages.currentPageNumber - 1];

export const getCurrentPageColor = (state) =>
  state.pages.pages[state.pages.currentPageNumber - 1].color;

export const getPages = (state) => state.pages.pages;

export const getCurrentPresetNumber = (state) =>
  state.pages.currentPresetNumber;

export const getCurrentPresetName = (state) =>
  state.pages.pages[state.pages.currentPageNumber - 1].presets[
    state.pages.currentPresetNumber - 1
  ].name;

export const getCurrentPresetDescription = (state) =>
  state.pages.pages[state.pages.currentPageNumber - 1].presets[
    state.pages.currentPresetNumber - 1
  ].description;

export const getCurrentPresetColor = (state) =>
  state.pages.pages[state.pages.currentPageNumber - 1].presets[
    state.pages.currentPresetNumber - 1
  ].color;

export const getCurrentPresetFile = (state) =>
  state.pages.pages[state.pages.currentPageNumber - 1].presets[
    state.pages.currentPresetNumber - 1
  ].file;

export const getCurrentPresetPots = (state) =>
  state.pages.pages[state.pages.currentPageNumber - 1].presets[
    state.pages.currentPresetNumber - 1
  ].pots;
