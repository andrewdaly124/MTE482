import React, { useState } from "react";
import PropTypes from "prop-types";
import classNames from "classnames/bind";

import styles from "./index.module.scss";

import { ReactComponent as ChevronSVG } from "../../../../assets/chevron-down.svg";
import { ReactComponent as PencilSVG } from "../../../../assets/pencil.svg";

const cx = classNames.bind(styles);

// dropdown for preset editor in pages panel
export default function PresetDropdown({ number, preset }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={cx({
        [styles.presetDropdown]: true,
      })}
      style={{ height: open ? "200px" : "48px" /** change */ }}
    >
      <div className={styles.colorFilter}>
        <div
          className={styles.header}
          onClick={() => {
            if (preset.description) {
              setOpen(!open);
            } else {
              console.log("edit preset", number);
            }
          }}
        >
          <div className={styles.number}>{number}</div>
          <div className={styles.name}>{preset.name || `Preset ${number}`}</div>
          <div className={styles.chevron}>
            {preset.description ? <ChevronSVG /> : <PencilSVG />}
          </div>
        </div>
        <div className={styles.edit}>{preset.description}</div>
      </div>
    </div>
  );
}

PresetDropdown.propTypes = {
  number: PropTypes.number.isRequired,
  preset: PropTypes.object.isRequired,
};
