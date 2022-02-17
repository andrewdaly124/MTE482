import React, { useState } from 'react';
import PropTypes from 'prop-types';

import styles from './index.module.scss';

export const MINHUE = 0;
export const MAXHUE = 360;

export default function HueSlider({ onChange }) {
  const [currHue, setCurrHue] = useState(0);

  function onChangeInner(e) {
    setCurrHue(e.target.value);
    onChange(e);
  }

  return (
    <div className={styles.hueSlider}>
      <input
        type="range"
        min={MINHUE}
        max={MAXHUE}
        onChange={onChangeInner}
        value={currHue}
      />
    </div>
  );
}

HueSlider.propTypes = {
  onChange: PropTypes.func.isRequired,
};
