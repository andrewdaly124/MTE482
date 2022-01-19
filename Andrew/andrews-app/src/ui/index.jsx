import React from "react";
import { useSelector } from "react-redux";
import { KeyDownHandler, KeyUpHandler } from "../utils/input_handler";
import { getCurrentPageState } from "../store/selectors";

import styles from "./index.module.scss";

// Root UI component
export default function Ui() {
  // Initialize input handlers - Nothing rn
  document.addEventListener("keydown", KeyDownHandler);
  document.addEventListener("keyup", KeyUpHandler);
  const currentPageState = useSelector(getCurrentPageState);

  return (
    <div className={styles.ui}>
      test
      <label>"{currentPageState}"</label>
    </div>
  );
}
