import { createReducer } from "typesafe-actions";
import { setEncoderRotation, setDeviceRotation } from "../actions";

export const REDUX_TEST_DEFAULTS = {
  encoderRotation: 0,
  deviceRotation: 0,
};

const DEFAULT_STATE = { ...REDUX_TEST_DEFAULTS };

const animations = createReducer(DEFAULT_STATE)
  .handleAction(setEncoderRotation, (state, { payload }) => {
    return { ...state, encoderRotation: payload };
  })
  .handleAction(setDeviceRotation, (state, { payload }) => {
    return { ...state, deviceRotation: payload };
  });

export default animations;
