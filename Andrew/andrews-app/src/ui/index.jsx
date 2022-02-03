import React from "react";
import { useSelector } from "react-redux";
import { KeyDownHandler, KeyUpHandler } from "../utils/input_handler";
import { getReduxTestNumber } from "../store/selectors";
import BTDeviceList from "./components/btDeviceList";
import SelectFile from "./components/selectFile";

import styles from "./index.module.scss";

// Root UI component
export default function Ui() {
  // Initialize input handlers - Nothing rn
  document.addEventListener("keydown", KeyDownHandler);
  document.addEventListener("keyup", KeyUpHandler);
  const reduxTestNumber = useSelector(getReduxTestNumber);

  return (
    <div className={styles.ui}>
      test
      <BTDeviceList />
      <SelectFile />
      <label>"{reduxTestNumber}"</label>
    </div>
  );
}
