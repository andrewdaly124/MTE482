import { createReducer } from "typesafe-actions";
import { setCurrentAppState } from "../actions";

export const APP_STATES = { home: 0, pages: 1, bluetooth: 2 };

const DEFAULT_STATE = {
  currentAppState: APP_STATES.home,
};

const appState = createReducer(DEFAULT_STATE).handleAction(
  setCurrentAppState,
  (state, { payload }) => {
    return { ...state, currentAppState: payload };
  }
);

export default appState;
