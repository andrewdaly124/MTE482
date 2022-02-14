import React, { useRef, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import classNames from "classnames/bind";

import { getCurrentAppState } from "../../../store/selectors";

import styles from "./index.module.scss";
import PagePanel from "./pagePanel";
import HomePanel from "./homePanel";
import DeployPanel from "./deployPanel";

const cx = classNames.bind(styles);

// main panel wrapper
export default function Panel() {
  const panelRef = useRef();
  const [panelDims, setPanelDims] = useState({});
  const [turnaryStyle, setTurnaryStyle] = useState({});
  // eslint-disable-next-line no-unused-vars
  const [overlayStyle, setOverlayStyle] = useState({});
  const currentAppState = useSelector(getCurrentAppState);

  const INNERWIDTH = 300; // see css

  // this effect doesn't seem to work
  useEffect(() => {
    if (panelRef?.current) {
      setPanelDims(panelRef.current.getBoundingClientRect());
    }
  }, [panelRef]);

  useEffect(() => {
    let left;
    switch (currentAppState) {
      case 0:
        left = INNERWIDTH;
        break;
      case 1:
        left = 0;
        break;
      case 2:
        left = -INNERWIDTH;
        break;
      default:
        left = INNERWIDTH;
    }
    setTurnaryStyle({ left: `${left}px` });
  }, [currentAppState, panelDims]);

  useEffect(() => {
    setOverlayStyle({
      left: `${-panelDims.width / 2}px`,
      top: `${-panelDims.height}px`,
      width: `${panelDims.width}px`,
      height: `${panelDims.height}px`,
    });
  }, [panelDims]);

  return (
    <div className={styles.panel} ref={panelRef}>
      <div className={styles.turnaryContainer} style={turnaryStyle}>
        <div className={styles.panelInner}>
          <HomePanel />
        </div>
        <div
          className={cx({
            [styles.panelInner]: true,
            [styles.pages]: true,
          })}
        >
          <PagePanel />
        </div>
        <div className={styles.panelInner}>
          <DeployPanel />
        </div>
      </div>
      {/*
      <div className={styles.gradientOverlayContainer}>
        <div className={styles.gradientOverlayVert} style={overlayStyle}>
          <div className={styles.gradientOverlayHorz} style={overlayStyle} />
        </div>
      </div>
      */}
    </div>
  );
}
