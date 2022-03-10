import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import PropTypes from "prop-types";
import classNames from "classnames/bind";
import invert from "invert-color";
import { DEFAULT_COLOR_HISTORY } from "../../../../../store/reducers/appState";

import styles from "./index.module.scss";

import Button from "../../../button";
import { ReactComponent as ChevronSVG } from "../../../../assets/chevron-down.svg";
import { ReactComponent as PencilSVG } from "../../../../assets/pencil.svg";
import {
  getCurrentPresetColor,
  getCurrentPresetDescription,
  getCurrentPresetFile,
  getCurrentPresetName,
  getCurrentPresetNumber,
  getIsPresetEditorOpen,
} from "../../../../../store/selectors";
import {
  openPresetEditor,
  setCurrentPresetNumber,
} from "../../../../../store/actions";

const cx = classNames.bind(styles);

// dropdown for preset editor in pages panel
export default function PresetDropdown({ number, preset }) {
  // constants
  const NAME_FIELD_WIDTH = 188;
  const NAME_FIELD_MARGIN = 16;

  // react-redux
  const currPresetNumber = useSelector(getCurrentPresetNumber);
  const currPresetName = useSelector(getCurrentPresetName);
  const currPresetDescription = useSelector(getCurrentPresetDescription);
  const currPresetColor = useSelector(getCurrentPresetColor);
  const currPresetFile = useSelector(getCurrentPresetFile);
  const isPresetEditorOpen = useSelector(getIsPresetEditorOpen);

  const dispatch = useDispatch();

  // useState
  const [open, setOpen] = useState(false);

  // useCallback
  const onEditPreset = useCallback(() => {
    let openOrClose;

    if (currPresetNumber === number) {
      openOrClose = !isPresetEditorOpen;
    } else {
      openOrClose = true;
    }

    dispatch(openPresetEditor(openOrClose));

    if (openOrClose === true) {
      dispatch(setCurrentPresetNumber(number));
    }
  }, [currPresetNumber, isPresetEditorOpen]);

  const onClickHeader = useCallback(() => {
    if (preset.description) {
      setOpen(!open);
    } else {
      onEditPreset();
    }
  }, [open, onEditPreset]);

  useEffect(() => {}, [
    currPresetName,
    currPresetDescription,
    currPresetColor,
    currPresetFile,
  ]);

  return (
    <div
      className={cx({
        [styles.presetDropdown]: true,
      })}
      style={
        preset.color
          ? {
              color: `${invert(`#${preset.color}`)}`,
              fill: `${invert(`#${preset.color}`)}`,
            }
          : {
              color: `#${DEFAULT_COLOR_HISTORY[0]}`,
              fill: `#${DEFAULT_COLOR_HISTORY[0]}`,
            }
      }
    >
      <div
        className={styles.colorFilter}
        style={preset.color ? { backgroundColor: `#${preset.color}` } : {}}
      >
        <div
          className={styles.header}
          onClick={onClickHeader}
          title={preset.name || `Preset ${number}`}
        >
          <div className={styles.number}>{number}</div>
          <div
            className={styles.name}
            style={{
              width: `${
                preset.file
                  ? (NAME_FIELD_WIDTH - 3 * NAME_FIELD_MARGIN) / 2
                  : NAME_FIELD_WIDTH - 2 * NAME_FIELD_MARGIN
              }px`,
            }}
          >
            {preset.name || `Preset ${number}`}
          </div>
          {preset.file && (
            <div
              className={styles.fileName}
              style={{
                width: `${(NAME_FIELD_WIDTH - 3 * NAME_FIELD_MARGIN) / 2}px`,
              }}
            >
              {preset.file}
            </div>
          )}
          <div className={styles.chevron}>
            {preset.description ? <ChevronSVG /> : <PencilSVG />}
          </div>
        </div>
        {open && (
          <div className={styles.edit}>
            {preset.description}
            <div className={styles.button}>
              <Button
                inner={
                  currPresetNumber === number && isPresetEditorOpen
                    ? "Close Editor"
                    : "Edit Preset"
                }
                onClick={onEditPreset}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

PresetDropdown.propTypes = {
  number: PropTypes.number.isRequired,
  preset: PropTypes.object.isRequired,
};
