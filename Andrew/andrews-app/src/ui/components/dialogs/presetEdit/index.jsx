import React from "react";

import styles from "./index.module.scss";

import InputField from "../../inputField";
import ColorPicker from "../../colorPicker";

export default function PresetEdit() {
  return (
    <div className={styles.presetEdit}>
      <div className={styles.backgroundContainer}>
        <div className={styles.horizontalLayout}>
          <div className={styles.presetProperties}>
            <div className={styles.filePicker}>
              <InputField label="File Select" />
            </div>
            <div className={styles.name}>
              <InputField label="Name" />
            </div>
            <div className={styles.description}>
              <InputField label="Description" size="infinite" />
            </div>
          </div>
          <div className={styles.colorPickerContainer}>
            <ColorPicker />
          </div>
        </div>
      </div>
    </div>
  );
}
