import { setReduxTestNumber } from "../store/actions";
import { getReduxTestNumber } from "../store/selectors";
import store from "../store";

/*
obviously very primitive and useless atm
*/

export function KeyDownHandler(e) {
  // eslint-disable-next-line default-case
  switch (e.key) {
    case "Enter":
      // eslint-disable-next-line no-case-declarations
      const reduxTestNumber = getReduxTestNumber(store.getState());
      store.dispatch(setReduxTestNumber(reduxTestNumber + 1));
      break;
  }
}

export function KeyUpHandler(e) {
  // eslint-disable-next-line default-case
  switch (e.key) {
    case "Enter":
      // eslint-disable-next-line no-case-declarations
      const reduxTestNumber = getReduxTestNumber(store.getState());
      store.dispatch(setReduxTestNumber(reduxTestNumber + 1000));
      break;
  }
}
