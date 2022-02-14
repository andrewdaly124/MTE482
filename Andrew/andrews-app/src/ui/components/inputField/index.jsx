import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

const cx = classNames.bind(styles);

export default function InputField({
  value,
  onChange,
  size,
  type = "input",
  placeholder = "",
  autofocus = false,
}) {
  const [sizeStyles, setSizeStyles] = useState({});
  const inputRef = useRef(null);

  // init stuff
  useEffect(() => {
    // size styles select
    switch (size) {
      case "small":
        setSizeStyles(styles.small);
        break;
      case "normal":
        setSizeStyles(styles.normal);
        break;
      case "large":
        setSizeStyles(styles.large);
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
        {type === "input" ? (
          <input
            type="text"
            onChange={onChange}
            value={value}
            placeholder={placeholder}
            ref={inputRef}
          />
        ) : (
          <textarea
            type="text"
            onChange={onChange}
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
  size: PropTypes.string.isRequired,
  type: PropTypes.string.isRequired,
  placeholder: PropTypes.string,
  autofocus: PropTypes.bool,
};
