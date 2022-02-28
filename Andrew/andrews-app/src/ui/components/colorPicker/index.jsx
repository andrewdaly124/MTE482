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
   *
   * btttwwwww the reason this is needed is cause window hooks don't update
   * with React useStates... this flag doesn't require knowledge of
   * React updates soooo we good
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

      const rgb = hslToHex(hue, sat, lev).substring(1, 7).toUpperCase();
      onSave(rgb);
    },
    [currHue, currSaturation, currLevel]
  );

  const onStateCallback = useCallback(
    (h, s, l) => {
      const hue = h ?? currHue;
      const sat = s ?? currSaturation;
      const lev = l ?? currLevel;

      setCurrHue(hue);
      setCurrSaturation(sat);
      setCurrLevel(lev);
    },
    [currHue, currSaturation, currLevel]
  );

  // Updates UI and sets state if a hex color is selected
  const updateOnExplicitColorSelect = useCallback(
    (color, dontSave = false) => {
      if (!color) {
        if (!dontSave) {
          onSaveCallback();
        }
        onStateCallback();
      } else {
        const hsl = hexToHsl(color);
        const rgb = hexToRgb(color);
        // Don't want shades to select red hue
        if (rgb.red === rgb.green && rgb.green === rgb.blue) {
          hsl[0] = null;
        }
        if (!dontSave) {
          onSaveCallback(...hsl);
        }
        onStateCallback(...hsl);
      }
    },
    [onSaveCallback, onStateCallback]
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
  useEffect(() => {
    if (initialColor) {
      // initial color styles
      updateOnExplicitColorSelect(initialColor, true);
      setHexInput(initialColor.toUpperCase());
    } else {
      setHexInput(colorHistory[0]);
    }
  }, [
    initialColor,
    /** initialColor dependancy is important for page color picker dialog */
  ]);

  // Extremely desperate event
  useEffect(() => {
    if (badUpdateFlag > 0) {
      /** EW */ onSaveCallback();
      onStateCallback();
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

  function onHexInputChange(val) {
    // https://stackoverflow.com/a/5317339
    const hex = /^[0-9A-Fa-f]+$/g; // only hex characters
    const extras = /[#\s]+/g;
    const newHex = val.replace(extras, "");
    if (hex.test(newHex) || newHex.length === 0) {
      setHexInput(newHex);
      if (newHex.length === 6) {
        updateOnExplicitColorSelect(newHex);
      }
    }
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
        <div className={styles.input}>
          <InputField
            value={`# ${hexInput.toUpperCase()}`}
            onChange={onHexInputChange}
            characterLimit={8 /** hex + 2 for hex marker */}
          />
        </div>
        <div
          className={styles.colorPreview}
          style={{
            background: `hsl(${currHue}, ${currSaturation}%, ${currLevel}%)`,
          }}
        />
      </div>
    </div>
  );
}

ColorPicker.propTypes = {
  initialColor: PropTypes.string,
  onSave: PropTypes.func.isRequired,
};
