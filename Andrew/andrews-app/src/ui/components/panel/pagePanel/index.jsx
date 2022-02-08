import React from "react";

import styles from "./index.module.scss";

import PageScroll from "./pageScroll";

// pages panel inner
export default function PagePanel() {
  return (
    <div className={styles.pagePanel}>
      <div className={styles.title}>Pages</div>
      <div className={styles.scrollbar}>
        <PageScroll />
      </div>
      <div className={styles.description}>Description Component</div>
      <div className={styles.pages}>Pages Dropdown</div>
    </div>
  );
}
