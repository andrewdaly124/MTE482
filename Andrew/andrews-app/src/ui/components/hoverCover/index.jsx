import React, { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";

import styles from "./index.module.scss";

// pretty much entirely useless. too bad i built this
export default function HoverCover({ containerRef }) {
  const [containerDims, setContainerDims] = useState({});
  const [hoverDims, setHoverDims] = useState({});
  const hoverRef = useRef(null);

  // keeps dimension info updated for container
  useEffect(() => {
    if (containerRef?.current) {
      setContainerDims(containerRef.current.getBoundingClientRect());
    }
  }, [containerRef]);

  // keeps dimension info updated for hover
  useEffect(() => {
    if (hoverRef.current) {
      setHoverDims(hoverRef.current.getBoundingClientRect());
    }
  }, [hoverRef]);

  return (
    <div className={styles.hoverCover} ref={hoverRef}>
      <div
        className={styles.inner}
        style={{
          transform: `translate(${-(
            hoverDims.left - containerDims.left
          )}px, ${-(hoverDims.top - containerDims.top)}px)`,
          width: `${containerDims.width}px`,
          height: `${containerDims.height}px`,
        }}
      />
    </div>
  );
}

HoverCover.propTypes = {
  containerRef: PropTypes.object.isRequired,
};
