import { combineReducers } from "redux";

import reduxTest from "./reduxTest"; // TODO: Hide behind dev mode
import appState from "./appState";
import pages from "./pages";
import animations from "./animations";

const reducers = combineReducers({ reduxTest, appState, pages, animations });

export default reducers;
