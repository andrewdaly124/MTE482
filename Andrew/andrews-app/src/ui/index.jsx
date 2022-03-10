import React, { useRef, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { KeyDownHandler, KeyUpHandler } from "../utils/input_handler";
import {
  getIsColorPickerOpen,
  getCurrentPageColor,
  getCurrentAppState,
  getIsPresetEditorOpen,
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
  const presetEditorRef = useRef(null);

  // useSelectors
  const isColorPickerOpen = useSelector(getIsColorPickerOpen);
  const isPresetEditorOpen = useSelector(getIsPresetEditorOpen);
  const currentPageColor = useSelector(getCurrentPageColor);
  const currentAppState = useSelector(getCurrentAppState);

  // useStates
  const [colorPickerStyle, setColorPickerStyle] = useState({});
  const [presetEditorStyle, setPresetEditorStyle] = useState({});

  // useEffect
  // color picker dialog
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

  // preset editor dialog
  useEffect(() => {
    if (presetEditorRef?.current) {
      const dims = presetEditorRef.current.getBoundingClientRect();
      if (currentAppState === APP_STATES.pages && isPresetEditorOpen) {
        setPresetEditorStyle({
          ...presetEditorStyle,
          bottom: `${8 /** margin */}px`,
        });
      } else {
        setPresetEditorStyle({
          ...presetEditorStyle,
          bottom: `${-dims.height}px`,
        });
      }
    }
    // eslint-disable-next-line array-bracket-spacing
  }, [
    isPresetEditorOpen,
    leftStackRef,
    presetEditorRef /** again refs wont update */,
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
      <div
        className={styles.presetEditorDialog}
        ref={presetEditorRef}
        style={{
          ...presetEditorStyle,
          left: `${
            leftStackRef?.current?.getBoundingClientRect().right /** sucks */
          }px`,
        }}
      >
        <PresetEdit />
      </div>
    </div>
  );
}
