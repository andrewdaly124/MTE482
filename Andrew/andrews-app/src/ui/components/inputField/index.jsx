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
      default:
        setSizeStyles(styles.normal);
    }

    // autoselect if applicable
    if (autofocus && inputRef?.current) {
      inputRef.current.focus();
    }
  }, []);

  return (
    <div
      className={cx({
        [styles.inputField]: true,
        [sizeStyles]: true,
      })}
    >
      <div className={styles.hoverContainer}>
        {size !== "paragraphNormal" ? (
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
  );
}

InputField.propTypes = {
  value: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired,
  size: PropTypes.string, // oneof
  placeholder: PropTypes.string,
  autofocus: PropTypes.bool,
  characterLimit: PropTypes.number,
};
