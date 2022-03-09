import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { KeyDownHandler, KeyUpHandler } from "../utils/input_handler";
import {
  getIsColorPickerOpen,
  getCurrentPageColor,
  getCurrentAppState,
} from "../store/selectors";
import { APP_STATES } from "../store/reducers/appState";

import MainMenu from "./components/mainMenu";
import Panel from "./components/panel";
import PresetEdit from "./components/dialogs/presetEdit";
import BackgroundAnimation from "./components/backgroundAnimation";
import ColorPickerPagesDialog from "./components/dialogs/colorPickerPagesDialog";

import styles from "./index.module.scss";

// Root UI component
export default function Ui() {
  // useRefs
  const leftStackRef = useRef(null);
  const colorPickerRef = useRef(null);

  // useSelectors
  const isColorPickerOpen = useSelector(getIsColorPickerOpen);
  const currentPageColor = useSelector(getCurrentPageColor);
  const currentAppState = useSelector(getCurrentAppState);

  // useStates
  const [colorPickerStyle, setColorPickerStyle] = useState({});

  // useEffect
  useEffect(() => {
    if (colorPickerRef?.current) {
      const dims = colorPickerRef.current.getBoundingClientRect();
      if (currentAppState === APP_STATES.pages && isColorPickerOpen) {
        setColorPickerStyle({
          ...colorPickerStyle,
          top: `${8 /** margin */}px`,
        });
      } else {
        setColorPickerStyle({ ...colorPickerStyle, top: `${-dims.height}px` });
      }
    }
    // eslint-disable-next-line array-bracket-spacing
  }, [
    isColorPickerOpen,
    leftStackRef,
    colorPickerRef /** again refs wont update */,
    currentAppState,
  ]);

  // Initialize input handlers - Nothing rn
  document.addEventListener("keydown", KeyDownHandler);
  document.addEventListener("keyup", KeyUpHandler);

  return (
    <div
      className={styles.ui}
      style={{ backgroundColor: `#${currentPageColor}` }}
    >
      <BackgroundAnimation />
      <div className={styles.leftStack} ref={leftStackRef}>
        <div className={styles.stack}>
          <MainMenu />
        </div>
        <Panel />
      </div>
      <div className={styles.rightStack}>
        <div className={styles.stack}>
          <PresetEdit />
        </div>
      </div>
      <div
        className={styles.colorPickerPagesDialog}
        ref={colorPickerRef}
        style={{
          ...colorPickerStyle,
          left: `${
            leftStackRef?.current?.getBoundingClientRect().right /** sucks */
          }px`,
        }}
      >
        <ColorPickerPagesDialog />
      </div>
    </div>
  );
}
