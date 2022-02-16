import React, { useEffect, useState, useRef, useCallback } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

const cx = classNames.bind(styles);

export default function InputField({
  value,
  onChange,
  size = "normal",
  placeholder = "",
  autofocus = false,
  characterLimit = 248,
  label,
}) {
  const [sizeStyles, setSizeStyles] = useState({});
  const inputRef = useRef(null);
  const onChangeCallback = useCallback(
    (e) => {
      if (e?.target) {
        onChange(e.target.value.substring(0, characterLimit));
      }
    },
    [onChange]
  );

  // init stuff
  useEffect(() => {
    // size styles select
    switch (size) {
      case "small":
        setSizeStyles(styles.small);
        break;
      case "smaller":
        setSizeStyles(styles.smaller);
        break;
      case "normal":
        setSizeStyles(styles.normal);
        break;
      case "large":
        setSizeStyles(styles.large);
        break;
      case "paragraphNormal":
        setSizeStyles(styles.paragraphNormal);
        break;
      case "infinite":
        setSizeStyles(styles.infinite);
        break;
      default:
        setSizeStyles(styles.normal);
    }

    // autoselect if applicable
    if (autofocus && inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div className={styles.inputField}>
      {label && <div className={styles.label}>{label}</div>}
      <div
        className={cx({
          [styles.inputContainer]: true,
          [sizeStyles]: true,
        })}
      >
        <div className={styles.hoverContainer}>
          {size !== "paragraphNormal" && size !== "infinite" ? (
            <input
              type="text"
              onChange={onChangeCallback}
              value={value}
              placeholder={placeholder}
              ref={inputRef}
            />
          ) : (
            <textarea
              type="text"
              onChange={onChangeCallback}
              value={value}
              placeholder={placeholder}
              ref={inputRef}
            />
          )}
        </div>
      </div>
    </div>
  );
}

InputField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.string, // oneof
  placeholder: PropTypes.string,
  autofocus: PropTypes.bool,
  characterLimit: PropTypes.number,
  label: PropTypes.string,
};
