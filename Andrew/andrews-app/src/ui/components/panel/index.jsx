import React from "react";

import styles from "./index.module.scss";
import PagePanel from "./pagePanel";

// const TITLES = ["Home", "Pages", "Deploy"];

// main panel wrapper
export default function Panel() {
  return (
    <div className={styles.panel}>
      <div className={styles.panelInner}>
        <PagePanel />
      </div>
    </div>
  );
}
