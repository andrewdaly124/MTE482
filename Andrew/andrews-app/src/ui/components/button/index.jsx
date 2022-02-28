import React, { useEffect, useRef, useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

const cx = classNames.bind(styles);

export default function Button({
  inner,
  size = "normal",
  onClick,
  color,
  noPadding = false,
}) {
  const ref = useRef(null);
  const [explicitStyle, setExplicitStyle] = useState({});

  useEffect(() => {
    if (color) {
      setExplicitStyle({
        backgroundColor: `#${color}`,
        // outline: `2px solid grey`,
      });
    }
  }, [color]);

  return (
    <div
      className={cx({
        [styles.button]: true,
        [styles[size]]: true,
        [styles.noPadding]: noPadding,
      })}
      onClick={onClick}
      ref={ref}
      style={explicitStyle}
    >
      <div className={styles.hoverContainer}>
        <div className={styles.inner}>{inner}</div>
      </div>
    </div>
  );
}

Button.propTypes = {
  inner: PropTypes.object.isRequired,
  size: PropTypes.string.isRequired, // oneOf plz
  onClick: PropTypes.func.isRequired,
  color: PropTypes.string,
  noPadding: PropTypes.bool,
};
