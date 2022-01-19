import { setCurrentPageState } from "../store/actions";
import { PAGE_STATES } from "../store/reducers/pageState";

import store from "../store";

/*
obviously very primitive and useless atm
*/

export function KeyDownHandler(e) {
  // eslint-disable-next-line default-case
  switch (e.key) {
    case "Enter":
      store.dispatch(setCurrentPageState(PAGE_STATES.home));
      break;
  }
}

export function KeyUpHandler(e) {
  // eslint-disable-next-line default-case
  switch (e.key) {
    case "ArrowUp":
      store.dispatch(setCurrentPageState(PAGE_STATES.home));
      break;
  }
}
