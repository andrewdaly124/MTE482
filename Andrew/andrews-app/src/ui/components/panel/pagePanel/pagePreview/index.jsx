import React, { useState, useEffect, useCallback } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  getCurrentPageNumber,
  getCurrentPage,
  getIsColorPickerOpen,
} from "../../../../../store/selectors";

import {
  setPageName,
  setPageDescription,
  openColorPicker,
} from "../../../../../store/actions";

import styles from "./index.module.scss";

import Button from "../../../button";
import InputField from "../../../inputField";
import { ReactComponent as RenameSVG } from "../../../../assets/rename.svg";
import { ReactComponent as ColorPickerSVG } from "../../../../assets/color-picker.svg";

// page preview, need edit/save
export default function PagePreview() {
  const dispatch = useDispatch();
  const currentPageNumber = useSelector(getCurrentPageNumber);
  const currentPage = useSelector(getCurrentPage);
  const isColorPickerOpen = useSelector(getIsColorPickerOpen);
  const [editEvent, setEditEvent] = useState(0);
  const [isEditMode, setIsEditMode] = useState(true); // immediately toggles to false in useEffect
  const [editName, setEditName] = useState(currentPage.name);
  const [editDescription, setEditDescription] = useState(
    currentPage.description
  );
  const onEnter = useCallback((e) => {
    if (e?.code && e.code === "Enter") {
      setEditEvent(editEvent + 3);
    }
  }, []);

  // This math is so stupid lmfao
  function toggleEditMode() {
    setEditEvent(editEvent - 5);
  }

  useEffect(() => {
    if (isEditMode) {
      // save and push to state
      window.removeEventListener("keydown", onEnter);
      dispatch(
        setPageName({ index: currentPageNumber - 1, newName: editName })
      );
      dispatch(
        setPageDescription({
          index: currentPageNumber - 1,
          newDescription: editDescription,
        })
      );
    } else {
      window.addEventListener("keydown", onEnter);
      setEditName(currentPage.name);
      setEditDescription(currentPage.description);
    }

    setIsEditMode(!isEditMode);
  }, [editEvent]);

  useEffect(() => {
    // turn off edit mode without saving if page is changed
    setIsEditMode(false);
  }, [currentPageNumber]);

  useEffect(() => {
    if (!isEditMode) {
      dispatch(openColorPicker(false));
    }
  }, [isEditMode]);

  function openColorPickerHook() {
    dispatch(openColorPicker(!isColorPickerOpen));
  }

  return (
    <div className={styles.pagePreview}>
      <div className={styles.header}>
        {isEditMode ? (
          <InputField
            value={editName}
            onChange={(val) => setEditName(val)}
            placeholder={`Page ${currentPageNumber}`}
            autofocus
            characterLimit={36}
            size="normal"
          />
        ) : (
          <div className={styles.title}>
            {currentPage.name || `Page ${currentPageNumber}`}
          </div>
        )}
        {isEditMode && (
          <div className={styles.button}>
            <Button
              inner={<ColorPickerSVG />}
              onClick={openColorPickerHook}
              size="normal"
              noPadding
            />
          </div>
        )}
        <div className={styles.button}>
          <Button
            inner={<RenameSVG />}
            onClick={toggleEditMode}
            size="normal"
            noPadding
          />
        </div>
      </div>

      {isEditMode ? (
        <div className={styles.body}>
          <InputField
            value={editDescription}
            onChange={(val) => setEditDescription(val)}
            placeholder="Page Description"
            characterLimit={248}
            size="paragraphNormal"
          />
        </div>
      ) : currentPage.description ? (
        <div className={styles.body}>
          <div className={styles.description}>
            {currentPage.description ||
              `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ${currentPageNumber}`}
          </div>
        </div>
      ) : null}
    </div>
  );
}
