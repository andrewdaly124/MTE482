import React from "react";
import { importJson } from "../../../../utils/io";

import FileInput from "../../fileInput";

// import { ReactComponent as LogoSvg } from "../../../assets/logo_bare.svg";
import { ReactComponent as LogoSvg } from "../../../assets/logo.svg";

import styles from "./index.module.scss";

// home panel inner
export default function HomePanel() {
  const ALLOW_LOGO = true;
  return (
    <div className={styles.homePanel}>
      <div className={styles.inner}>
        {ALLOW_LOGO && (
          <div className={styles.logo}>
            <LogoSvg />
          </div>
        )}
        <div className={styles.header}>Welcome to Corda!</div>
        <div className={styles.intro}>
          From choosing effects, to plugging them in and playing live, Corda
          offers an all-in-one platform for guitar effect processing.
          <br />
          <br /> Start from scratch or by importing an existing configuration.
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
