import React, { useState } from "react";
import PropTypes from "prop-types";

import styles from "./index.module.scss";

export default function HueSlider({ onChange }) {
  const [currHue, setCurrHue] = useState(0);
  const MINHUE = 0;
  const MAXHUE = 360;

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
