import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

const cx = classNames.bind(styles);

// main menu item to be stacked in menu
export default function MainMenuItem({ active, icon, label, onClick }) {
  return (
    <div
      className={cx({
        [styles.mainMenuItem]: true,
        [styles.active]: active,
      })}
      onClick={onClick}
    >
      <div className={styles.hoverContainer}>
        <div className={styles.icon}>{icon}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </div>
  );
}

MainMenuItem.propTypes = {
  active: PropTypes.bool.isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,
};
