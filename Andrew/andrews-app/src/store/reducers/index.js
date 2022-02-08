import { combineReducers } from "redux";

import reduxTest from "./reduxTest"; // TODO: Hide behind dev mode
import appState from "./appState";
import pages from "./pages";

const reducers = combineReducers({ reduxTest, appState, pages });

export default reducers;
