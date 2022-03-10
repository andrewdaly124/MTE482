import { delay, call, put, takeEvery } from "redux-saga/effects";
import {
  setEncoderRotation,
  triggerDeviceShake,
  setDeviceRotation,
} from "../actions";

function* encoderAnimation() {
  let rotation = 0;
  const rotationDelta = 360; // deg
  const timeDelta = 10000; // ms
  yield delay(1000); // let things render. This is a lot of time

  while (true) {
    rotation += rotationDelta;
    yield put(setEncoderRotation(rotation));
    yield delay(timeDelta);
  }
}

function* deviceShake() {
  const timeDelta = 100; // ms
  const rotationDelta = 1; // deg

  yield put(setDeviceRotation(rotationDelta));
  yield delay(timeDelta);

  yield put(setDeviceRotation(-rotationDelta));
  yield delay(timeDelta);

  yield put(setDeviceRotation(rotationDelta / 2));
  yield delay(timeDelta);

  yield put(setDeviceRotation(-rotationDelta / 2));
  yield delay(timeDelta);

  yield put(setDeviceRotation(0));
}

export default function* animations() {
  yield takeEvery(triggerDeviceShake, deviceShake);
  yield call(encoderAnimation);
}
