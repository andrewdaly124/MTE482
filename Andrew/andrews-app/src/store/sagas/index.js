import { all, spawn } from "redux-saga/effects";

import reduxTest from "./reduxTest"; // TODO: Hide behind dev mode

const sagaMap = [reduxTest];

export default function* sagas() {
  yield all(sagaMap.map((saga) => spawn(saga)));
}
