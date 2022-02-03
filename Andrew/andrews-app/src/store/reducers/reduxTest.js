import { createReducer } from "typesafe-actions";
import {
  setReduxTestNumber,
  setReduxTestString,
  setReduxTestBool,
  setReduxTestObject,
} from "../actions";

export const REDUX_TEST_DEFAULTS = {
  number: 0,
  string: "Hello World!",
  bool: false,
  object: { number: 0, string: "Hello World!", bool: false },
};

const DEFAULT_STATE = { ...REDUX_TEST_DEFAULTS };

const reduxTest = createReducer(DEFAULT_STATE)
  .handleAction(setReduxTestNumber, (state, { payload }) => {
    return { ...state, number: payload };
  })
  .handleAction(setReduxTestString, (state, { payload }) => {
    return { ...state, string: payload };
  })
  .handleAction(setReduxTestBool, (state, { payload }) => {
    return { ...state, bool: payload };
  })
  .handleAction(setReduxTestObject, (state, { payload }) => {
    return { ...state, object: payload };
  });

export default reduxTest;
