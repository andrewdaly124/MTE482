import { createReducer } from "typesafe-actions";
import { setCurrentPageState } from "../actions";

const PAGE_STATES = { home: 0, bluetooth: 1 };

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
