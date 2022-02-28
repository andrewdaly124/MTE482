import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentPageNumber } from "../../../../../store/selectors";
import { setCurrentPageNumber } from "../../../../../store/actions";

import styles from "./index.module.scss";

import { ReactComponent as ChevRightSVG } from "../../../../assets/chevron-right.svg";
import { ReactComponent as ChevLeftSVG } from "../../../../assets/chevron-left.svg";

import { NUMPAGES } from "../../../../../store/reducers/pages";

import Button from "../../../button";

export default function PageScroll() {
  const dispatch = useDispatch();
  const currentPageNumber = useSelector(getCurrentPageNumber);

  function onChangePage(e) {
    dispatch(setCurrentPageNumber(parseInt(e.target.value, 10)));
  }

  return (
    <div className={styles.pageScroll}>
      <Button
        inner={<ChevLeftSVG />}
        size="small"
        onClick={() => {
          dispatch(setCurrentPageNumber(parseInt(currentPageNumber, 10) - 1));
        }}
      />
      <div className={styles.inputContainer}>
        <input
          type="range"
          min={1}
          max={NUMPAGES}
          onChange={onChangePage}
          value={currentPageNumber}
        />
      </div>
      <Button
        inner={<ChevRightSVG />}
        size="small"
        onClick={() => {
          dispatch(setCurrentPageNumber(parseInt(currentPageNumber, 10) + 1));
        }}
      />
    </div>
  );
}
