import { all, spawn } from "redux-saga/effects";

// eslint-disable-next-line no-unused-vars
import reduxTest from "./reduxTest"; // TODO: Hide behind dev mode
// eslint-disable-next-line no-unused-vars
import bluetooth from "./bluetooth";
import pages from "./pages";

const sagaMap = [pages];

export default function* sagas() {
  yield all(sagaMap.map((saga) => spawn(saga)));
}
