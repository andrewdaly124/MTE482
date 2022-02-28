import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PropTypes from "prop-types";

import { setPageColor } from "../../../../store/actions";
import {
  getCurrentPageNumber,
  getCurrentPage,
  getCurrentPageColor,
} from "../../../../store/selectors";

import ColorPicker from "../../colorPicker";

import styles from "./index.module.scss";

// this dialog only exists for page stuff. gonna have to be generalized if we wanna change that
export default function ColorPickerDialog({ onSave }) {
  const dispatch = useDispatch();
  const currentPageNumber = useSelector(getCurrentPageNumber);
  const currentPageColor = useSelector(getCurrentPageColor);
  const currentPage = useSelector(getCurrentPage);
  const [initColor, setInitColor] = useState("FFFFFF");

  const onSaveHook = useCallback(
    (color) => {
      dispatch(setPageColor({ index: currentPage.number, newColor: color }));
      onSave?.();
    },
    [currentPage]
  );

  useEffect(() => {
    setInitColor(currentPageColor);
  }, [currentPageNumber]);

  return (
    <div className={styles.colorPickerDialog}>
      <div className={styles.backgroundContainer}>
        <div className={styles.pickerContainer}>
          <ColorPicker
            initialColor={
              initColor
              /** only updates on page change (ref to page object does not change) */
            }
            onSave={onSaveHook}
          />
        </div>
      </div>
    </div>
  );
}

ColorPickerDialog.propTypes = {
  onSave: PropTypes.func.isRequired,
};
