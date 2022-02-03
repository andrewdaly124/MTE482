import React from "react";

import styles from "./index.module.scss";

// component where which you click, and a file is returned
export default function SelectFile() {
  return (
    <div className={styles.selectFile}>
      test
      <input type="file" />
    </div>
  );
}
