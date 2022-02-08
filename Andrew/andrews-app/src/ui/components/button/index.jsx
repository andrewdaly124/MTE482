import React, { useRef } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

const cx = classNames.bind(styles);

export default function Button({ inner, size, onClick }) {
  const ref = useRef(null);

  let sizeStyles;

  function selectSize() {
    // size styles select
    switch (size) {
      case "pages":
        sizeStyles = styles.panelSize;
        break;
      case "normal":
        sizeStyles = styles.normal;
        break;
      case "large":
        sizeStyles = styles.large;
        break;
      default:
        sizeStyles = styles.normal;
    }
    console.log(sizeStyles);
    return sizeStyles;
  }

  return (
    <div
      className={cx({
        [styles.button]: true,
        [selectSize()]: true,
      })}
      onClick={onClick}
      ref={ref}
    >
      <div className={styles.hoverContainer}>
        <div className={styles.inner}>{inner}</div>
      </div>
    </div>
  );
}

Button.propTypes = {
  inner: PropTypes.string.isRequired,
  // color: PropTypes.string.isRequired, // oneOf plz
  size: PropTypes.string.isRequired, // oneOf plz
  onClick: PropTypes.func.isRequired,
};
