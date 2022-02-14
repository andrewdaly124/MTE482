import { createAction } from "typesafe-actions";

/**
 *  TODO:
 *  - Add payload types
 */

/** @type { ActionCreator<'SET_CURRENT_PAGE_NUMBER'> } */
export const setCurrentPageNumber = createAction("SET_CURRENT_PAGE_NUMBER")();

/** @type { ActionCreator<'SET_PAGE_NAME'> } */
export const setPageName = createAction("SET_PAGE_NAME")();

/** @type { ActionCreator<'SET_PAGE_DESCRIPTION'> } */
export const setPageDescription = createAction("SET_PAGE_DESCRIPTION")();

/** @type { ActionCreator<'SET_PAGE_COLOR'> } */
export const setPageColor = createAction("SET_PAGE_COLOR")();

// add page editing actions
