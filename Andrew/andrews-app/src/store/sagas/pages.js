import { takeEvery, put } from "redux-saga/effects";
import {
  openPresetEditor,
  setCurrentPageNumber,
  setCurrentPresetNumber,
} from "../actions";

function* resetPresetState() {
  console.log("should call");
  yield put(setCurrentPresetNumber(1));
  yield put(openPresetEditor(false));
}

export default function* pages() {
  yield takeEvery(setCurrentPageNumber, resetPresetState);
}
