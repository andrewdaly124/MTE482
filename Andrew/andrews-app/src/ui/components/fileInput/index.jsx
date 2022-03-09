import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import { getNewUid } from "../../../utils/getNewUid";

import styles from "./index.module.scss";

export default function FileInput({ inner, onChange, accept }) {
  const [uid, setUid] = useState(0);

  useEffect(() => {
    setUid(getNewUid());
  }, []);

  return (
    <div className={styles.button}>
      <div className={styles.hoverContainer}>
        <label htmlFor={`file-input-${uid}`}>{inner}</label>
        <input
          id={`file-input-${uid}`}
          type="file"
          accept={accept}
          onChange={onChange}
        />
      </div>
    </div>
  );
}

FileInput.propTypes = {
  inner: PropTypes.oneOfType([PropTypes.object, PropTypes.string]).isRequired,
  onChange: PropTypes.func.isRequired,
  accept: PropTypes.string.isRequired,
};
