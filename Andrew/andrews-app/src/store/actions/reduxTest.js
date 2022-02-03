import { createAction } from "typesafe-actions";

/** @type { ActionCreator<'SET_REDUX_TEST_NUMBER'> } */
export const setReduxTestNumber = createAction("SET_REDUX_TEST_NUMBER")();

/** @type { ActionCreator<'SET_REDUX_TEST_STRING'> } */
export const setReduxTestString = createAction("SET_REDUX_TEST_STRING")();

/** @type { ActionCreator<'SET_REDUX_TEST_BOOL'> } */
export const setReduxTestBool = createAction("SET_REDUX_TEST_BOOL")();

/** @type { ActionCreator<'SET_REDUX_TEST_OBJECT'> } */
export const setReduxTestObject = createAction("SET_REDUX_TEST_OBJECT")();
