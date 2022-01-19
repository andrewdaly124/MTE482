import { setCurrentPageState } from "../store/actions";

import store from "../store";

/*
obviously very primitive and useless atm
*/

export function KeyDownHandler(e) {
  // eslint-disable-next-line default-case
  switch (e.key) {
    case "Enter":
      store.dispatch(setCurrentPageState(0));
      break;
  }
}

export function KeyUpHandler(e) {
  // eslint-disable-next-line default-case
  switch (e.key) {
    case "ArrowUp":
      store.dispatch(setCurrentPageState(0));
      break;
  }
}
