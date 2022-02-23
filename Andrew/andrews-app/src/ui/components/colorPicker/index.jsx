import React, {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
} from "react";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";
import hexToHsl from "hex-to-hsl";
import hexToRgb from "hex-rgb";
import hslToHex from "hsl-to-hex";
import { getColorHistory } from "../../../store/selectors";

import HueSlider from "./hueSlider";
import ColorShelf from "./colorShelf";
import InputField from "../inputField";

import styles from "./index.module.scss";

export default function ColorPicker({ initialColor, onSave }) {
  // redux
  const colorHistory = useSelector(getColorHistory);

  // refs
  const canvasRef = useRef(null); // not setting up an effect for this. fuck that noise

  // useStates
  const [currHue, setCurrHue] = useState(0);
  const [currSaturation, setCurrSaturation] = useState(100);
  const [currLevel, setCurrLevel] = useState(100);
  const [hexInput, setHexInput] = useState("");
  /**
   * This SUCKS but we're running out of time and this is the final iteration of this component
   *
   * Employers if you see this this is not representative of me or my brand
   */
  const [badUpdateFlag, setBadUpdateFlag] = useState(0);

  // useMemos
  const canvasThumbStyle = useMemo(() => {
    if (canvasRef?.current) {
      const dims = canvasRef.current.getBoundingClientRect();
      // Update cursor positions
      // derived from simplifying eqns from onPointerMoveCanvas
      const y =
        dims.top +
        dims.height -
        (dims.height * currLevel) / (100 - currSaturation / 2);
      const x = dims.left + (dims.width * currSaturation) / 100;
      return {
        left: `${Math.max(0, Math.min(dims.width, x - dims.left))}px`,
        top: `${Math.max(0, Math.min(dims.height, y - dims.top))}px`,
        background: `hsl(${currHue}, ${currSaturation}%, ${currLevel}%)`,
      };
    }
    return {
      background: `hsl(${currHue}, ${currSaturation}%, ${currLevel}%)`,
    };
  }, [currHue, currSaturation, currLevel]);

  // Canvas style updates
  const hueBackdropStyle = useMemo(() => {
    return {
      background: `linear-gradient(90deg, rgba(255, 255, 255, 1), hsl(${currHue}, 100%, 50%))`,
    };
  }, [currHue]);

  // uneCallbacks
  const onSaveCallback = useCallback(
    (h, s, l) => {
      const hue = h ?? currHue;
      const sat = s ?? currSaturation;
      const lev = l ?? currLevel;

      setCurrHue(hue);
      setCurrSaturation(sat);
      setCurrLevel(lev);

      const rgb = hslToHex(hue, sat, lev).substring(1, 7).toUpperCase();
      onSave(rgb);
    },
    [currHue, currSaturation, currLevel]
  );

  // Updates UI and sets state if a hex color is selected
  const updateOnExplicitColorSelect = useCallback(
    (color) => {
      if (!color) {
        onSaveCallback();
      } else {
        const rgb = hexToRgb(color);
        // Don't want onWhite to select red hue
        if (rgb.red === 255 && rgb.green === 255 && rgb.blue === 255) {
          onSaveCallback(null, 0, 100);
        } else {
          const hsl = hexToHsl(color);
          onSaveCallback(...hsl);
        }
      }
    },
    [onSaveCallback]
  );

  // hex Input explicit from hsl
  const updateHexInput = useCallback(
    (h, s, l) => {
      const hue = h ?? currHue;
      const sat = s ?? currSaturation;
      const lev = l ?? currLevel;

      const rgb = hslToHex(hue, sat, lev).substring(1, 7).toUpperCase();
      setHexInput(rgb);
    },
    [currHue, currSaturation, currLevel]
  );

  // useEffects
  useEffect(
    () => {
      if (initialColor) {
        // initial color styles
        updateOnExplicitColorSelect(initialColor);
        setHexInput(initialColor.toUpperCase());
      } else {
        setHexInput(colorHistory[0]);
      }
    },
    [
      /** run on start */
    ]
  );

  // Extremely desperate event
  useEffect(() => {
    if (badUpdateFlag > 0) {
      /** EW */ onSaveCallback();
    }
  }, [badUpdateFlag]);

  function onPointerMoveCanvas(e) {
    if (canvasRef?.current) {
      const dims = canvasRef.current.getBoundingClientRect();
      const horizontalPercent = Math.max(
        0,
        Math.min(100, ((e.clientX - dims.left) / dims.width) * 100)
      );
      const verticalPercent = Math.max(
        0,
        Math.min(100, ((e.clientY - dims.top) / dims.height) * 100)
      );

      const newSaturation = Math.round(horizontalPercent);
      const newLevel = Math.round(
        (100 - verticalPercent) * ((100 - horizontalPercent / 2) / 100)
      );

      // setters
      setCurrSaturation(newSaturation);
      setCurrLevel(newLevel);
      updateHexInput(null, newSaturation, newLevel);
    }
  }

  // eslint-disable-next-line no-unused-vars
  function onPointerUpCanvas(e) {
    // remove event listeners
    window.removeEventListener("pointermove", onPointerMoveCanvas);
    window.removeEventListener("pointerup", onPointerUpCanvas);
    // set color
    setBadUpdateFlag(badUpdateFlag + 1);
  }

  function onPointerDownCanvas(e) {
    onPointerMoveCanvas(e); // init thumb position
    // add event listeners
    window.addEventListener("pointermove", onPointerMoveCanvas);
    window.addEventListener("pointerup", onPointerUpCanvas);
  }

  function onHueSliderChange(e) {
    setCurrHue(e.target.value);
    updateHexInput();
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
        <HueSlider
          onChange={onHueSliderChange}
          value={parseInt(currHue, 10)}
          onPointerUp={() => {
            setBadUpdateFlag(badUpdateFlag + 1);
          }}
        />
      </div>
      <div className={styles.colorHistory}>
        <ColorShelf
          onClick={(color) => {
            updateOnExplicitColorSelect(color);
            setHexInput(color);
          }}
        />
      </div>
      <div className={styles.hexInput}>
        <div className={styles.colorPreview} />
        <div className={styles.input}>
          <InputField value={`# ${hexInput.toUpperCase()}`} />
        </div>
      </div>
    </div>
  );
}

ColorPicker.propTypes = {
  initialColor: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};
