import React from 'react';
import PropTypes from 'prop-types';

import ColorPicker from '../../colorPicker';

import styles from './index.module.scss';

export default function ColorPickerDialog({ onSave }) {
  function onSaveHook(color) {
    console.log(color);
    onSave?.();
  }

  return (
    <div className={styles.colorPickerDialog}>
      <div className={styles.backgroundContainer}>
        <div className={styles.pickerContainer}>
          <ColorPicker initialColor={'123456'} onSave={onSaveHook} />
        </div>
      </div>
    </div>
  );
}

ColorPickerDialog.propTypes = {
  onSave: PropTypes.func.isRequired,
};
