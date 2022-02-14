import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

import { ReactComponent as ChevronSVG } from "../../../../assets/chevron-down.svg";

const cx = classNames.bind(styles);

// dropdown for preset editor in pages panel
export default function PresetDropdown({ number, name }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cx({
        [styles.presetDropdown]: true,
      })}
      style={{ height: open ? "200px" : "48px" }}
    >
      <div className={styles.colorFilter}>
        <div
          className={styles.header}
          onClick={() => {
            setOpen(!open);
          }}
        >
          <div className={styles.number}>{number}</div>
          <div className={styles.name}>{name}</div>
          <div className={styles.chevron}>
            <ChevronSVG />
          </div>
        </div>
        <div className={styles.edit}>Edit</div>
      </div>
    </div>
  );
}

PresetDropdown.propTypes = {
  number: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
};
