import { takeEvery } from "redux-saga/effects";
import { setCurrentAppState } from "../actions";

// eslint-disable-next-line no-unused-vars
function logSetVarInstance({ payload }) {
  // eslint-disable-next-line no-console
  console.log("SAGA", "set app state", payload);
}

export default function* test() {
  yield takeEvery(setCurrentAppState, logSetVarInstance);
}
