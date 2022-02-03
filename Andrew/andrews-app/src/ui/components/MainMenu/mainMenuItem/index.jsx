import React from "react";
import PropTypes from "prop-types";

import styles from "./index.module.scss";

// main menu item too be stacked in menu
export default function MainMenuItem({ active, icon, label }) {
  return (
    <div className={styles.mainMenuItem} active={active}>
      <div className={styles.icon}>{icon}</div>
      <div className={styles.label}>{label}</div>
    </div>
  );
}

MainMenuItem.propTypes = {
  active: PropTypes.bool.isRequired,
  icon: PropTypes.element.isRequired,
  label: PropTypes.string.isRequired,
};
