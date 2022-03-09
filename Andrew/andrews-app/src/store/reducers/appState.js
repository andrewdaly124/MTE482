import { createReducer } from "typesafe-actions";
import {
  setCurrentAppState,
  setColorInHistory,
  openColorPicker,
  reshuffleUid,
} from "../actions";

export const APP_STATES = { home: 0, pages: 1, bluetooth: 2 };
export const DEFAULT_COLOR_HISTORY = [
  "FFFFFF",
  "FF0000",
  "FFBF00",
  "00FF40",
  "00FFFF",
  "0040FF",
  "8000FF",
  "FF00BF",
];

const DEFAULT_STATE = {
  currentAppState: APP_STATES.home,
  colorHistory: DEFAULT_COLOR_HISTORY,
  colorPickerOpen: false,
  uid: 0,
};

const appState = createReducer(DEFAULT_STATE)
  .handleAction(setCurrentAppState, (state, { payload }) => {
    return { ...state, currentAppState: payload };
  })
  // Don't know if this will be used, ever
  .handleAction(setColorInHistory, (state, { payload: { index, color } }) => {
    const newColorHistory = [...state.colorHistory];
    newColorHistory[index] = color;
    return { ...state, colorHistory: newColorHistory };
  })
  .handleAction(openColorPicker, (state, { payload }) => {
    return { ...state, colorPickerOpen: payload };
  })
  .handleAction(reshuffleUid, (state) => {
    const newUid = state.uid + 1;
    return { ...state, uid: newUid };
  });

export default appState;
