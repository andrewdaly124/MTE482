/**
 * TODO:
 * type returns and state
 */

export const getCurrentPageNumber = (state) => state.pages.currentPageNumber;

export const getCurrentPage = (state) =>
  state.pages.pages[state.pages.currentPageNumber - 1];