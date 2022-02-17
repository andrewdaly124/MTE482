import { createAction } from 'typesafe-actions';

/**
 *  TODO:
 *  - Add payload types
 */

/** @type { ActionCreator<'SET_CURRENT_APP_STATE'> } */
export const setCurrentAppState = createAction('SET_CURRENT_APP_STATE')();

/** @type { ActionCreator<'SET_COLOR_IN_HISTORY'> } */
export const setColorInHistory = createAction('SET_COLOR_IN_HISTORY')();
