import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

const cx = classNames.bind(styles);

export default function Button({ inner, size, onClick }) {
  const ref = useRef(null);
  const [sizeStyles, setSizeStyles] = useState({});

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
  }, []);

  return (
    <div
      className={cx({
        [styles.button]: true,
        [sizeStyles]: true,
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
  inner: PropTypes.object.isRequired,
  // color: PropTypes.string.isRequired, // oneOf plz
  size: PropTypes.string.isRequired, // oneOf plz
  onClick: PropTypes.func.isRequired,
};
