import { reshuffleUid } from "../store/actions";
import { getCurrUid } from "../store/selectors";
import store from "../store";

export function getNewUid() {
  console.log("test");
  const currUid = getCurrUid(store.getState());
  store.dispatch(reshuffleUid());
  console.log(currUid);
  return currUid;
}
