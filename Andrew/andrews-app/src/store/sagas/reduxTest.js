import { takeEvery } from "redux-saga/effects";
import { setCurrentPageState } from "../actions";

// eslint-disable-next-line no-unused-vars
function logSetVarInstance({ payload }) {
  // eslint-disable-next-line no-console
  console.log("SAGA", "set page state", payload);
}

export default function* test() {
  yield takeEvery(setCurrentPageState, logSetVarInstance);
}
