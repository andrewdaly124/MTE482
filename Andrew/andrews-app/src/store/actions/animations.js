import { createAction } from "typesafe-actions";

/**
 *  TODO:
 *  - Add payload types
 */

/** @type { ActionCreator<'SET_ENCODER_ROTATION'> } */
export const setEncoderRotation = createAction("SET_ENCODER_ROTATION")();

/** @type { ActionCreator<'SET_DEVICE_ROTATION'> } */
export const setDeviceRotation = createAction("SET_DEVICE_ROTATION")();

/** @type { ActionCreator<'TRIGGER_DEVICE_SHAKE'> } */
export const triggerDeviceShake = createAction("TRIGGER_DEVICE_SHAKE")();
