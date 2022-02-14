import React from 'react';

import styles from './index.module.scss';

export default function PresetEdit() {
  return (
    <div className={styles.presetEdit}>
      <div className={styles.backgroundContainer}>
        <div className={styles.horizontalLayout}>
          <div className={styles.presetProperties}>props</div>
          <div className={styles.colorPickerContainer}>color picker</div>
        </div>
      </div>
    </div>
  );
}
