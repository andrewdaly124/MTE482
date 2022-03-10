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

/** @type { ActionCreator<'SET_CURRENT_PRESET_NUMBER'> } */
export const setCurrentPresetNumber = createAction(
  "SET_CURRENT_PRESET_NUMBER"
)();

/** @type { ActionCreator<'SET_PRESET_FILE'> } */
export const setPresetFile = createAction("SET_PRESET_FILE")();

/** @type { ActionCreator<'SET_PRESET_NAME'> } */
export const setPresetName = createAction("SET_PRESET_NAME")();

/** @type { ActionCreator<'SET_PRESET_DESCRIPTION'> } */
export const setPresetDescription = createAction("SET_PRESET_DESCRIPTION")();

/** @type { ActionCreator<'SET_PRESET_COLOR'> } */
export const setPresetColor = createAction("SET_PRESET_COLOR")();

/** @type { ActionCreator<'SET_POT_NAME'> } */
export const setPotName = createAction("SET_POT_NAME")();

// add page editing actions
