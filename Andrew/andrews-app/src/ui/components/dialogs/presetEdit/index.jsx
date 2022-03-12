import React, { useState, useCallback, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { importHex } from "../../../../utils/io";
import {
  MAX_NAME_LENGTH,
  MAX_DESCRIPTION_LENGTH,
} from "../../../../store/reducers/pages";
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
  setPotName,
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
  const [inputPots, setInputPots] = useState([
    { name: "" },
    { name: "" },
    { name: "" },
  ]);
  const [fileName, setFileName] = useState("");
  const [initColor, setInitColor] = useState("");

  // useCallbacks
  const onSaveColor = useCallback(
    (color) => {
      dispatch(setPresetColor(color));
    },
    [setPresetColor]
  );

  const onChangeInputName = useCallback(
    (val) => {
      setInputName(val);
      dispatch(setPresetName(val));
    },
    [inputName]
  );

  const onChangeInputDescription = useCallback(
    (val) => {
      setInputDescription(val);
      dispatch(setPresetDescription(val));
    },
    [inputDescription]
  );

  const onChangeInputPots = useCallback(
    (index, val) => {
      const newPots = [...inputPots];
      newPots[index].name = val;
      setInputPots(newPots);
      dispatch(setPotName({ name: val, index }));
    },
    [inputPots]
  );

  const onSelectFile = useCallback(
    (e) => {
      const val = importHex(e);
      setFileName(val);
      dispatch(setPresetFile(val));
    },
    [fileName]
  );

  // useEffects
  useEffect(() => {
    const newPreset = currentPage.presets[currentPresetNumber - 1];
    setFileName(newPreset.file || "");
    setInputName(newPreset.name || "");
    setInputDescription(newPreset.description || "");
    setInitColor(newPreset.color || "FFFFFF");
    setInputPots(newPreset.pots || [{ name: "" }, { name: "" }, { name: "" }]);
  }, [currentPageNumber, currentPage, currentPresetNumber]);

  return (
    <div className={styles.presetEdit}>
      <div className={styles.backgroundContainer}>
        <div className={styles.horizontalLayout}>
          <div className={styles.presetProperties}>
            <div className={styles.filePicker}>
              <FileInput
                inner={fileName || "Click to Import Effect File"}
                onChange={onSelectFile}
                accept=".h"
              />
            </div>
            <div className={styles.name}>
              <InputField
                label="Name"
                value={inputName}
                onChange={onChangeInputName}
                placeholder={`Preset ${currentPresetNumber} Name`}
                characterLimit={MAX_NAME_LENGTH}
              />
            </div>
            <div className={styles.description}>
              <InputField
                label="Description"
                size="infinite"
                placeholder="Preset Description"
                value={inputDescription}
                onChange={onChangeInputDescription}
                characterLimit={MAX_DESCRIPTION_LENGTH}
              />
            </div>
            <div className={styles.pots}>
              <InputField
                label="Potentiometer 1"
                value={inputPots[0].name}
                onChange={(val) => onChangeInputPots(0, val)}
                characterLimit={MAX_NAME_LENGTH}
              />
              <InputField
                label="Potentiometer 2"
                value={inputPots[1].name}
                onChange={(val) => onChangeInputPots(1, val)}
                characterLimit={MAX_NAME_LENGTH}
              />
              <InputField
                label="Potentiometer 3"
                value={inputPots[2].name}
                onChange={(val) => onChangeInputPots(2, val)}
                characterLimit={MAX_NAME_LENGTH}
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
