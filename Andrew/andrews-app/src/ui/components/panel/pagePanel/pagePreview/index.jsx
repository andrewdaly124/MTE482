import React from "react";
import { useSelector } from "react-redux";
import {
  getCurrentPageNumber,
  getCurrentPage,
} from "../../../../../store/selectors";

import styles from "./index.module.scss";

// page preview, need edit/save
export default function PagePreview() {
  const currentPageNumber = useSelector(getCurrentPageNumber);
  const currentPage = useSelector(getCurrentPage);

  return (
    <div className={styles.pagePreview}>
      <div className={styles.title}>
        {currentPage.name || `Page ${currentPageNumber}`}
      </div>
      {
        /* currentPage.description */ true ? ( // obv remove this
          <div className={styles.description}>
            {currentPage.description ||
              `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ${currentPageNumber}`}
          </div>
        ) : null
      }
    </div>
  );
}
