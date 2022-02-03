import React from "react";
import { KeyDownHandler, KeyUpHandler } from "../utils/input_handler";

import MainMenu from "./components/mainMenu";

import styles from "./index.module.scss";

// Root UI component
export default function Ui() {
  // Initialize input handlers - Nothing rn
  document.addEventListener("keydown", KeyDownHandler);
  document.addEventListener("keyup", KeyUpHandler);

  return (
    <div className={styles.ui}>
      <div className={styles.upperLeftStack}>
        <div className={styles.mainMenu}>
          <MainMenu />
        </div>
      </div>
    </div>
  );
}
