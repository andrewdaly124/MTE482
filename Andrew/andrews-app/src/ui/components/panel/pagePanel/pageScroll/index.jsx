import React, { useRef, useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentPageNumber } from "../../../../../store/selectors";
import { setCurrentPageNumber } from "../../../../../store/actions";

import styles from "./index.module.scss";

import { ReactComponent as ChevRightSVG } from "../../../../assets/chevron-right.svg";
import { ReactComponent as ChevLeftSVG } from "../../../../assets/chevron-left.svg";

import { NUMPAGES } from "../../../../../store/reducers/pages";

import Button from "../../../button";

export default function PageScroll() {
  const barRef = useRef(null);
  const [barDims, setBarDims] = useState({});
  const [pageNumberHandleStyle, setPageNumberHandleStyle] = useState({});
  const dispatch = useDispatch();
  const currentPageNumber = useSelector(getCurrentPageNumber);

  function updateBarDims(node) {
    setBarDims(node.getBoundingClientRect());
  }

  function onScroll() {
    if (
      barRef?.current &&
      barRef.current.getBoundingClientRect().top !== barDims.top
    ) {
      updateBarDims(barRef.current);
    } else {
      console.log(barRef.current.getBoundingClientRect().top);
    }
  }

  useEffect(() => {
    if (barRef?.current) {
      setBarDims(barRef.current.getBoundingClientRect());
    }
  }, [barRef]);

  // horrible
  useEffect(() => {
    document.addEventListener("wheel", onScroll);
    return () => {
      window.removeEventListener("wheel", onScroll);
    };
  }, []);

  useEffect(() => {
    // hate this
    if (barDims?.left) {
      const THUMBSIZE = 24; // see css
      const LEFTOFFSET = -barDims.width / 2 + 10;
      const RIGHTOFFSET = -8;
      const left =
        barDims.left +
        LEFTOFFSET +
        ((barDims.width - THUMBSIZE + RIGHTOFFSET) / (NUMPAGES - 1)) *
          (currentPageNumber - 1);
      const top = barDims.top;
      setPageNumberHandleStyle({ left, top });
    }
  }, [barDims, currentPageNumber]);

  function onChangePage(e) {
    dispatch(setCurrentPageNumber(parseInt(e.target.value, 10)));
  }

  return (
    <div className={styles.pageScroll} onPointerMove={onScroll /* horrible */}>
      <Button
        inner={<ChevLeftSVG />}
        size="pages"
        onClick={() => {
          dispatch(setCurrentPageNumber(parseInt(currentPageNumber, 10) - 1));
        }}
      />
      <div className={styles.inputContainer} ref={barRef}>
        <input
          type="range"
          min={1}
          max={NUMPAGES}
          onChange={onChangePage}
          value={currentPageNumber}
        />
        <div className={styles.pageNumberHandle} style={pageNumberHandleStyle}>
          {currentPageNumber}
        </div>
      </div>
      <Button
        inner={<ChevRightSVG />}
        size="pages"
        onClick={() => {
          dispatch(setCurrentPageNumber(parseInt(currentPageNumber, 10) + 1));
        }}
      />
    </div>
  );
}
