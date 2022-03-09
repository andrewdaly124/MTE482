import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { importHex } from "../../../../utils/io";
import {
  getCurrentPage,
  getCurrentPageNumber,
  getCurrentPresetNumber,
} from "../../../../store/selectors";

import styles from "./index.module.scss";

import InputField from "../../inputField";
import ColorPicker from "../../colorPicker";
import FileInput from "../../fileInput";
import {
  setPresetColor,
  setPresetDescription,
  setPresetName,
  setPresetFile,
} from "../../../../store/actions";

export default function PresetEdit() {
  // react-redux
  const currentPageNumber = useSelector(getCurrentPageNumber);
  const currentPresetNumber = useSelector(getCurrentPresetNumber);
  const currentPage = useSelector(getCurrentPage);

  const dispatch = useDispatch();

  // useStates
  const [inputName, setInputName] = useState("");
  const [inputDescription, setInputDescription] = useState("");
  const [fileName, setFileName] = useState("");
  const [initColor, setInitColor] = useState("");

  // useCallbacks
  const onSaveColor = useCallback(
    (color) => {
      console.log("presetEdit", color);
      dispatch(setPresetColor(color));
    },
    [setPresetColor]
  );

  const onChangeInputName = useCallback((val) => {
    setInputName(val);
    dispatch(setPresetName(val));
  }, []);

  const onChangeInputDescription = useCallback((val) => {
    setInputDescription(val);
    dispatch(setPresetDescription(val));
  }, []);

  const onSelectFile = useCallback((e) => {
    const val = importHex(e);
    setFileName(val);
    dispatch(setPresetFile(val));
  }, []);

  // useEffects
  useEffect(() => {
    const newPreset = currentPage.presets[currentPresetNumber - 1];
    console.log(newPreset);
    setFileName(newPreset.file || "");
    setInputName(newPreset.name || "");
    setInputDescription(newPreset.description || "");
    setInitColor(newPreset.color);
  }, [currentPageNumber, currentPage, currentPresetNumber]);

  return (
    <div className={styles.presetEdit}>
      <div className={styles.backgroundContainer}>
        <div className={styles.horizontalLayout}>
          <div className={styles.presetProperties}>
            <div className={styles.filePicker}>
              <FileInput
                inner={fileName || "Import Effect"}
                onChange={onSelectFile}
                accept=".hex"
              />
            </div>
            <div className={styles.name}>
              <InputField
                label="Name"
                value={inputName}
                onChange={onChangeInputName}
                placeholder="Preset Name (change plz)"
                characterLimit={248}
              />
            </div>
            <div className={styles.description}>
              <InputField
                label="Description"
                size="infinite"
                placeholder="Preset Description (change plz)"
                value={inputDescription}
                onChange={onChangeInputDescription}
                characterLimit={248}
              />
            </div>
          </div>
          <div className={styles.colorPickerContainer}>
            <ColorPicker initialColor={initColor} onSave={onSaveColor} />
          </div>
        </div>
      </div>
    </div>
  );
}
