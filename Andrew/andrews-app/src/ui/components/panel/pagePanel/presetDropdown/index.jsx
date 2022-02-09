import React from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

import { ReactComponent as ChevronSVG } from "../../../../assets/chevron-down.svg";

const cx = classNames.bind(styles);

// dropdown for preset editor in pages panel
export default function PresetDropdown({ number, name }) {
  return (
    <div
      className={cx({
        [styles.presetDropdown]: true,
      })}
    >
      <div className={styles.number}>{number}</div>
      <div className={styles.name}>{name}</div>
      <div className={styles.chevron}>
        <ChevronSVG />
      </div>
    </div>
  );
}

PresetDropdown.propTypes = {
  number: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};
