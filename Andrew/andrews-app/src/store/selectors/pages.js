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
