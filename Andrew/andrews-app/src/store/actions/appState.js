import { createAction } from "typesafe-actions";

/**
 *  TODO:
 *  - Add payload types
 */

/** @type { ActionCreator<'SET_CURRENT_APP_STATE'> } */
export const setCurrentAppState = createAction("SET_CURRENT_APP_STATE")();

/** @type { ActionCreator<'SET_COLOR_IN_HISTORY'> } */
export const setColorInHistory = createAction("SET_COLOR_IN_HISTORY")();

/** @type { ActionCreator<'OPEN_COLOR_PICKER'> } */
export const openColorPicker = createAction("OPEN_COLOR_PICKER")();

/** @type { ActionCreator<'OPEN_PRESET_EDITOR'> } */
export const openPresetEditor = createAction("OPEN_PRESET_EDITOR")();

/** @type { ActionCreator<'RESHUFFLE_UID'> } */
export const reshuffleUid = createAction("RESHUFFLE_UID")();
