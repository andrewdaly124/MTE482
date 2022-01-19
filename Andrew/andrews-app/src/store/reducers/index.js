import { combineReducers } from "redux";

import reduxTest from "./reduxTest"; // TODO: Hide behind dev mode
import pageState from "./pageState";

const reducers = combineReducers({ reduxTest, pageState });

export default reducers;
