import { createReducer } from "typesafe-actions";
import { setCurrentPageState } from "../actions";

export const PAGE_STATES = { home: 0, pages: 1, bluetooth: 2 };

const DEFAULT_STATE = {
  currentPageState: PAGE_STATES.home,
};

const pageState = createReducer(DEFAULT_STATE).handleAction(
  setCurrentPageState,
  (state, { payload }) => {
    return { ...state, currentPageState: payload };
  }
);

export default pageState;
