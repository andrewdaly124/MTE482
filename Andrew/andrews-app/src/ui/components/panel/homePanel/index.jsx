import React from "react";
import { importJson } from "../../../../utils/io";

import FileInput from "../../fileInput";

import { ReactComponent as GoogleSVG } from "../../../assets/google.svg";

import styles from "./index.module.scss";

// home panel inner
export default function HomePanel() {
  return (
    <div className={styles.homePanel}>
      <div className={styles.inner}>
        <div className={styles.logo}>
          <GoogleSVG />
        </div>
        <div className={styles.header}>Welcome to Corda!</div>
        <div className={styles.intro}>
          From choosing effects, to plugging them in and playing live, Corda
          offers an all-in-one platform for guitar effect processing.
          <br />
          <br /> Start from scratch or by importing a current configuration.
        </div>
        <div className={styles.importButton}>
          <FileInput
            inner="Import Existing Configuration"
            onChange={importJson}
            accept=".json"
          />
        </div>
      </div>
    </div>
  );
}
