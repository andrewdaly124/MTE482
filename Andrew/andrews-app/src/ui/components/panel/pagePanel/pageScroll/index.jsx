import React, { useState, useEffect, useRef } from "react";

import styles from "./index.module.scss";

import { ReactComponent as ChevRightSVG } from "../../../../assets/chevron-right.svg";
import { ReactComponent as ChevLeftSVG } from "../../../../assets/chevron-left.svg";

import Button from "../../../button";

export default function PageScroll() {
  const NUMPAGES = 20; // standardize this
  const barRef = useRef(null);
  const [barDims, setBarDims] = useState({});
  const [handleStyles, setHandleStyles] = useState({
    transform: "translate(-8px, -8px)",
  });

  function onMouseMove(e) {
    function computeHandlePosition() {
      const stepSize = barDims.width / (NUMPAGES - 1);
      const ADJUSTMENT = 12;

      const adjustedClientX = e.clientX - ADJUSTMENT;

      let posX = adjustedClientX;

      if (posX < barDims.left - ADJUSTMENT) {
        posX = barDims.left - ADJUSTMENT;
      } else if (posX > barDims.right - ADJUSTMENT) {
        posX = barDims.right - ADJUSTMENT;
      }
      console.log(e.clientX, posX);
      return posX;
    }

    setHandleStyles({
      transform: `translate(${computeHandlePosition()}px, -8px)`,
    });
  }

  function onPointerUp() {
    // remove the mousemove event listener
    window.removeEventListener("mousemove", onMouseMove);
  }

  function onClickScrollHandle() {
    // add pointer up handle and add
    window.addEventListener("pointerup", onPointerUp);
    window.addEventListener("mousemove", onMouseMove);
  }

  useEffect(() => {
    if (barRef?.current) {
      setBarDims(barRef.current.getBoundingClientRect());
      console.log(barRef.current.getBoundingClientRect());
    }
  }, [barRef]);

  return (
    <div className={styles.pageScroll}>
      <Button inner={<ChevLeftSVG />} size="pages" onClick={() => {}} />
      <div className={styles.scrollbar} ref={barRef}>
        <div
          className={styles.scrollHandle}
          style={handleStyles}
          onPointerDown={onClickScrollHandle}
        />
      </div>
      <Button inner={<ChevRightSVG />} size="pages" onClick={() => {}} />
    </div>
  );
}
