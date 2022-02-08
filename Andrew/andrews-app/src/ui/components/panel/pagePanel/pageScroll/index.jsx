import React from "react";

import styles from "./index.module.scss";

import Button from "../../../button";

export default function PageScroll() {
  return (
    <div className={styles.pageScroll}>
      <Button inner="H" size="pages" onClick={() => {}} />
      <div className={styles.scrollbar}>test</div>
      <Button inner="H" size="pages" onClick={() => {}} />
    </div>
  );
}
