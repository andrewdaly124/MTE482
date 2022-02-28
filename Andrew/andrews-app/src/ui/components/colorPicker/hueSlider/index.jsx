import React, { useState } from "react";
import PropTypes from "prop-types";

import styles from "./index.module.scss";

export const MINHUE = 0;
export const MAXHUE = 360;

export default function HueSlider({ onChange, value, onPointerUp }) {
  const [currHue, setCurrHue] = useState(0);

  function onChangeInner(e) {
    setCurrHue(e.target.value);
    onChange(e);
  }

  function onPointerUpWrapper(e) {
    // remove event listeners
    window.removeEventListener("pointerup", onPointerUpWrapper);
    // set color
    onPointerUp(e);
  }

  // eslint-disable-next-line no-unused-vars
  function onPointerDownWrapper(e) {
    // add event listeners
    window.addEventListener("pointerup", onPointerUpWrapper);
  }

  return (
    <div className={styles.hueSlider} onPointerDown={onPointerDownWrapper}>
      <input
        type="range"
        min={MINHUE}
        max={MAXHUE}
        onChange={onChangeInner}
        value={value ?? currHue}
      />
    </div>
  );
}

HueSlider.propTypes = {
  onChange: PropTypes.func.isRequired,
  onPointerUp: PropTypes.func,
  value: PropTypes.number,
};
