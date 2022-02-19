import React from "react";
import { useSelector } from "react-redux";
import { getColorHistory } from "../../../../store/selectors";

import styles from "./index.module.scss";

import Button from "../../button";

export default function ColorShelf() {
  const colorHistory = useSelector(getColorHistory);
  return (
    <div className={styles.colorShelf}>
      {colorHistory.map((color, index) => {
        console.log(index, color);
        return (
          <div className={styles.button} key={index}>
            <Button color={color} size="color" />
          </div>
        );
      })}
    </div>
  );
}
