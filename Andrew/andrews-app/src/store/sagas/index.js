import { all, spawn } from "redux-saga/effects";

import reduxTest from "./reduxTest"; // TODO: Hide behind dev mode
import bluetooth from "./bluetooth";

const sagaMap = [reduxTest, bluetooth];

export default function* sagas() {
  yield all(sagaMap.map((saga) => spawn(saga)));
}
