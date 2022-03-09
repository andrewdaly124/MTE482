import { takeEvery, put } from "redux-saga/effects";
import { setCurrentPageNumber, setCurrentPresetNumber } from "../actions";

function* resetPresetState() {
  console.log("should call");
  yield put(setCurrentPresetNumber(1));
}

export default function* pages() {
  yield takeEvery(setCurrentPageNumber, resetPresetState);
}
