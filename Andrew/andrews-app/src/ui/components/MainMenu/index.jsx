import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentAppState } from "../../../store/selectors";
import { setCurrentAppState } from "../../../store/actions";

import MainMenuItem from "./mainMenuItem";
import { APP_STATES } from "../../../store/reducers/appState";
import { ReactComponent as HomeSVG } from "../../assets/home.svg";
import { ReactComponent as PagesSVG } from "../../assets/pages.svg";
import { ReactComponent as ExportSVG } from "../../assets/export.svg";

import styles from "./index.module.scss";

// const { remote } = require("electron");

// main menu component that has the list of things to do. ATM PLANS:
// - Home
// - Page Config
// - Bluetooth
export default function MainMenu() {
  const dispatch = useDispatch();
  const currentAppState = useSelector(getCurrentAppState);

  function onClickItem(selection) {
    // remote.BrowserWindow.getFocusedWindow().minimize();
    dispatch(setCurrentAppState(selection));
  }

  return (
    <div className={styles.mainMenu}>
      <MainMenuItem
        active={currentAppState === APP_STATES.home}
        icon={<HomeSVG />}
        label="Home"
        onClick={() => onClickItem(APP_STATES.home)}
      />
      <MainMenuItem
        active={currentAppState === APP_STATES.pages}
        icon={<PagesSVG />}
        label="Pages"
        onClick={() => onClickItem(APP_STATES.pages)}
      />
      <MainMenuItem
        active={currentAppState === APP_STATES.bluetooth}
        icon={<ExportSVG />}
        label="Deploy"
        onClick={() => onClickItem(APP_STATES.bluetooth)}
      />
    </div>
  );
}
