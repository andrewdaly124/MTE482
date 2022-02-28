import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { KeyDownHandler, KeyUpHandler } from '../utils/input_handler';
import { getIsColorPickerOpen } from '../store/selectors';

import MainMenu from './components/mainMenu';
import Panel from './components/panel';
import PresetEdit from './components/dialogs/presetEdit';
import BackgroundAnimation from './components/backgroundAnimation';
import ColorPickerDialog from './components/dialogs/colorPickerDialog';

import styles from './index.module.scss';

// Root UI component
export default function Ui() {
  // useRefs
  const leftStackRef = useRef(null);
  const colorPickerRef = useRef(null);

  // useSelectors
  const isColorPickerOpen = useSelector(getIsColorPickerOpen);

  // useStates
  const [colorPickerStyle, setColorPickerStyle] = useState({});

  // useEffect
  useEffect(() => {
    if (colorPickerRef?.current) {
      const dims = colorPickerRef.current.getBoundingClientRect();
      console.log(colorPickerStyle);
      if (isColorPickerOpen) {
        setColorPickerStyle({
          ...colorPickerStyle,
          top: `${8 /** margin */}px`,
        });
      } else {
        setColorPickerStyle({ ...colorPickerStyle, top: `${-dims.height}px` });
      }
    }
    // eslint-disable-next-line array-bracket-spacing
  }, [
    isColorPickerOpen,
    leftStackRef,
    colorPickerRef /** again refs wont update */,
  ]);

  // Initialize input handlers - Nothing rn
  document.addEventListener('keydown', KeyDownHandler);
  document.addEventListener('keyup', KeyUpHandler);

  return (
    <div className={styles.ui}>
      <BackgroundAnimation />
      <div className={styles.leftStack} ref={leftStackRef}>
        <div className={styles.stack}>
          <MainMenu />
        </div>
        <Panel />
      </div>
      <div className={styles.rightStack}>
        <div className={styles.stack}>
          <PresetEdit />
        </div>
      </div>
      <div
        className={styles.colorPickerDialog}
        ref={colorPickerRef}
        style={{
          ...colorPickerStyle,
          left: `${
            leftStackRef?.current?.getBoundingClientRect().right /** sucks */
          }px`,
        }}
      >
        <ColorPickerDialog />
      </div>
    </div>
  );
}
