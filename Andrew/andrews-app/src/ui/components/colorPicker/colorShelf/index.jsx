import React from "react";
import PropTypes from "prop-types";
import { useSelector } from "react-redux";
import { getColorHistory } from "../../../../store/selectors";

import styles from "./index.module.scss";

import Button from "../../button";

export default function ColorShelf({ onClick }) {
  const colorHistory = useSelector(getColorHistory);

  return (
    <div className={styles.colorShelf}>
      {colorHistory.map((color, index) => {
        return (
          <div className={styles.button} key={index}>
            <Button
              color={color}
              size="color"
              onClick={() => {
                onClick(color);
              }}
              noPadding
            />
          </div>
        );
      })}
    </div>
  );
}

ColorShelf.propTypes = {
  onClick: PropTypes.func.isRequired,
};
