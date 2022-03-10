import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { APP_STATES } from "../../../store/reducers/appState";

import styles from "./index.module.scss";

import {
  getCurrentPage,
  getCurrentPageNumber,
  getCurrentPresetNumber,
  getCurrentPresetColor,
  getIsPresetEditorOpen,
  getCurrentAppState,
  getEncoderRotation,
  getDeviceRotation,
} from "../../../store/selectors";
import {
  openPresetEditor,
  setCurrentPresetNumber,
  setCurrentAppState,
  triggerDeviceShake,
} from "../../../store/actions";

// Had a lot of fun with this lol
export default function Device() {
  // useStates
  const [powerOn, setPowerOn] = useState(true);
  const [showActiveButtonIcon, setShowActiveButtonIcon] = useState(false);

  // react-redux
  const currentPage = useSelector(getCurrentPage);
  const currentPageNumber = useSelector(getCurrentPageNumber);
  const currentPresetNumber = useSelector(getCurrentPresetNumber);
  const currentPresetColor = useSelector(getCurrentPresetColor);
  const isPresetEditorOpen = useSelector(getIsPresetEditorOpen);
  const currentAppState = useSelector(getCurrentAppState);
  const encoderRotation = useSelector(getEncoderRotation);
  const deviceRotation = useSelector(getDeviceRotation);

  const dispatch = useDispatch();

  // useMemos
  const powerSwitchStyle = useMemo(() => {
    const style = { marginBottom: `${powerOn ? 110 : 90}px` };
    return style;
  }, [powerOn]);

  const activeButtonStyle = useMemo(() => {
    let leftMargin = 32;
    switch (currentPresetNumber) {
      case 1:
        leftMargin = 32;
        break;
      case 2:
        leftMargin = 87;
        break;
      case 3:
        leftMargin = 142;
        break;
      case 4:
        leftMargin = 197;
        break;
      default:
        leftMargin = 32;
    }
    const style = {
      marginLeft: `${leftMargin}px`,
      opacity: `${
        showActiveButtonIcon &&
        currentAppState === APP_STATES.pages &&
        isPresetEditorOpen
          ? 1
          : 0
      }`,
    };
    return style;
  }, [
    powerOn,
    isPresetEditorOpen,
    currentPresetNumber,
    showActiveButtonIcon,
    currentAppState,
  ]);

  // useCallbacks
  const onClickButton = useCallback(
    (button) => {
      if (currentAppState !== APP_STATES.pages) {
        dispatch(setCurrentAppState(APP_STATES.pages));
        dispatch(setCurrentPresetNumber(button));
        dispatch(openPresetEditor(true));
      } else {
        let openOrClose;

        if (currentPresetNumber === button) {
          openOrClose = !isPresetEditorOpen;
        } else {
          openOrClose = true;
        }

        dispatch(openPresetEditor(openOrClose));
        setShowActiveButtonIcon(openOrClose);

        if (openOrClose) {
          dispatch(setCurrentPresetNumber(button));
        }
      }
    },
    [
      currentPresetNumber,
      isPresetEditorOpen,
      setShowActiveButtonIcon,
      currentAppState,
    ]
  );

  const buttonStyle = useCallback(
    (preset, button) => {
      const color = preset.color ? { backgroundColor: `#${preset.color}` } : {};
      const outline =
        currentAppState === APP_STATES.pages
          ? isPresetEditorOpen && currentPresetNumber === button
            ? { outline: "2px solid white" }
            : {}
          : {};
      return { ...color, ...outline };
    },
    [
      currentPresetNumber,
      isPresetEditorOpen,
      currentPageNumber,
      currentAppState,
    ]
  );

  const onTriggerShake = useCallback((e) => {
    e.preventDefault();
    if (e.target === e.currentTarget) {
      dispatch(triggerDeviceShake());
    }
  }, []);

  const togglePower = useCallback(() => {
    setPowerOn(!powerOn);
  }, [powerOn, setPowerOn]);

  // useEffects
  useEffect(() => {
    // Just need the component update
  }, [currentPresetNumber, currentPage, currentPageNumber, currentPresetColor]);

  return (
    <div
      className={styles.device}
      style={{
        transform: `rotate(${deviceRotation}deg)`,
      }}
      onClick={onTriggerShake}
    >
      <div
        className={styles.switch}
        onClick={togglePower}
        style={powerSwitchStyle}
      />
      <div className={styles.console}>
        <div className={styles.left} onClick={onTriggerShake}>
          <div className={styles.screenContainer} onClick={onTriggerShake}>
            <div
              className={styles.led}
              style={powerOn ? {} : { backgroundColor: "#FFBF00" }}
              onClick={onTriggerShake}
            />
            <div className={styles.screen}>
              <div
                className={styles.opacityContainer}
                style={{ opacity: `${powerOn ? 1 : 0}` }}
                onClick={onTriggerShake}
              >
                <div className={styles.top} onClick={onTriggerShake}>
                  <div className={styles.first} onClick={onTriggerShake} />
                  <div className={styles.second} onClick={onTriggerShake} />
                </div>
                <div className={styles.middle} onClick={onTriggerShake}>
                  <div className={styles.first} onClick={onTriggerShake} />
                  <div className={styles.second} onClick={onTriggerShake} />
                </div>
                <div className={styles.bottom} onClick={onTriggerShake}>
                  <div
                    className={styles.activeButton}
                    style={activeButtonStyle}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className={styles.buttons} onClick={onTriggerShake}>
            {currentPage.presets.map((preset, index) => (
              <div
                key={index}
                className={styles.button}
                style={buttonStyle(preset, index + 1)}
                onClick={() => onClickButton(index + 1)}
              />
            ))}
          </div>
        </div>
        <div className={styles.right} onClick={onTriggerShake}>
          <div
            className={styles.encoder}
            style={{ transform: `rotate(${encoderRotation}deg)` }}
            onClick={onTriggerShake}
          >
            <div className={styles.tick} />
          </div>
        </div>
      </div>
    </div>
  );
}
