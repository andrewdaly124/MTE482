import { call, delay } from "redux-saga/effects";

// eslint-disable-next-line no-unused-vars
function* refreshDevicesEverySec() {
  // let refreshes = 0;
  yield delay(6000);
  // refreshes++;
  console.log(
    yield call(() => {
      console.log(
        navigator.bluetooth.requestDevice({
          acceptAllDevices: true,
        })
      );
    })
  );
  // console.log("SAGA: refreshDevicesEverySec: refreshes:", refreshes, device);
}

export default function* bluetooth() {
  // yield call(refreshDevicesEverySec);
}
