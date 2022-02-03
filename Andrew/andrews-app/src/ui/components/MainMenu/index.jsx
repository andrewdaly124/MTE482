import React from "react";
import { useSelector } from "react-redux";
import { getCurrentPageState } from "../../../store/selectors";
import MainMenuItem from "./mainMenuItem";
import { PAGE_STATES } from "../../../store/reducers/pageState";
import HomeSVG from "../../assets/home.svg";

import styles from "./index.module.scss";

// main menu component that has the list of things to do. ATM PLANS:
// - Home
// - Page Config
// - Bluetooth
export default function MainMenu() {
  const currentPageState = useSelector(getCurrentPageState);

  return (
    <div className={styles.mainMenu}>
      <MainMenuItem
        active={currentPageState === PAGE_STATES.home}
        icon={<HomeSVG />}
        label="Home"
      />
    </div>
  );
}
