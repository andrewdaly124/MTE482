import { reshuffleUid } from "../store/actions";
import { getCurrUid } from "../store/selectors";
import store from "../store";

export function getNewUid() {
  const currUid = getCurrUid(store.getState());
  store.dispatch(reshuffleUid());
  return currUid;
}
