import React from "react";

import styles from "./index.module.scss";

export default function BackgroundAnimation() {
  return (
    <div className={styles.firstGradient}>
      <div className={styles.secondGradient}>
        <div className={styles.thirdGradient} />
      </div>
    </div>
  );
}
