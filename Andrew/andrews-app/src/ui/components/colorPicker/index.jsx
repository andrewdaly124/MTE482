import React, { useState, useEffect, useRef } from 'react';

import HueSlider, { MAXHUE } from './hueSlider';

import styles from './index.module.scss';

export default function ColorPicker() {
  const canvasRef = useRef(null); // not setting up an effect for this. fuck that noise
  // eslint-disable-next-line no-unused-vars
  const [currHue, setCurrHue] = useState(0);
  // eslint-disable-next-line no-unused-vars
  const [currSaturation, setCurrSaturation] = useState(100);
  // eslint-disable-next-line no-unused-vars
  const [currLevel, setCurrLevel] = useState(100);
  const [hueBackdropStyle, setHueBackdropStyle] = useState({});
  const [canvasThumbStyle, setCanvasThumbStyle] = useState({});

  useEffect(() => {
    setHueBackdropStyle({
      background: `linear-gradient(90deg, rgba(255, 255, 255, 1), hsl(${currHue}, 100%, 50%))`,
    });
    setCanvasThumbStyle({
      ...canvasThumbStyle,
      background: `hsl(${currHue}, ${currSaturation}%, ${currLevel}%)`,
    });
  }, [currHue]);

  function onPointerMoveCanvas(e) {
    if (canvasRef?.current) {
      const dims = canvasRef.current.getBoundingClientRect();
      const horizontalPercent = Math.max(
        0,
        Math.min(100, ((e.clientX - dims.left) / dims.width) * 100),
      );
      const verticalPercent = Math.max(
        0,
        Math.min(100, ((e.clientY - dims.top) / dims.height) * 100),
      );

      const newSaturation = Math.round(horizontalPercent);
      const newLevel = Math.round(
        (100 - verticalPercent) * ((100 - horizontalPercent / 2) / 100),
      );

      // setters
      setCurrSaturation(newSaturation);
      setCurrLevel(newLevel);
      setCanvasThumbStyle({
        ...canvasThumbStyle,
        left: `${Math.max(0, Math.min(dims.width, e.clientX - dims.left))}px`,
        top: `${Math.max(0, Math.min(dims.height, e.clientY - dims.top))}px`,
        background: `hsl(${currHue}, ${newSaturation}%, ${newLevel}%)`,
      });
    }
  }

  // eslint-disable-next-line no-unused-vars
  function onPointerUpCanvas(e) {
    // remove event listeners
    window.removeEventListener('pointermove', onPointerMoveCanvas);
    window.removeEventListener('pointerup', onPointerUpCanvas);
  }

  function onPointerDownCanvas(e) {
    onPointerMoveCanvas(e); // init thumb position
    // add event listeners
    window.addEventListener('pointermove', onPointerMoveCanvas);
    window.addEventListener('pointerup', onPointerUpCanvas);
  }

  function onHueSliderChange(e) {
    setCurrHue(MAXHUE - e.target.value);
  }

  return (
    <div className={styles.colorPicker}>
      <div
        className={styles.pickerCanvas}
        ref={canvasRef}
        onPointerDown={onPointerDownCanvas}
      >
        <div className={styles.canvasThumb} style={canvasThumbStyle} />
        <div className={styles.hueBackdrop} style={hueBackdropStyle}>
          <div className={styles.brightnessForeground} />
        </div>
      </div>
      <div className={styles.hueSlider}>
        <HueSlider onChange={onHueSliderChange} />
      </div>
      <div className={styles.colorHistory}>test</div>
      <div className={styles.hexInput}>test</div>
    </div>
  );
}
