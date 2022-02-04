import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { getCurrentPageState } from "../../../store/selectors";
import { setCurrentPageState } from "../../../store/actions";

import MainMenuItem from "./mainMenuItem";
import { PAGE_STATES } from "../../../store/reducers/pageState";
import { ReactComponent as HomeSVG } from "../../assets/home.svg";
import { ReactComponent as PagesSVG } from "../../assets/pages.svg";
import { ReactComponent as ExportSVG } from "../../assets/export.svg";

import styles from "./index.module.scss";

//const { remote } = require("electron");

// main menu component that has the list of things to do. ATM PLANS:
// - Home
// - Page Config
// - Bluetooth
export default function MainMenu() {
  const dispatch = useDispatch();
  const currentPageState = useSelector(getCurrentPageState);

  function onClickItem(selection) {
    //remote.BrowserWindow.getFocusedWindow().minimize();
    dispatch(setCurrentPageState(selection));
  }

  return (
    <div className={styles.mainMenu}>
      <MainMenuItem
        active={currentPageState === PAGE_STATES.home}
        icon={<HomeSVG />}
        label="Home"
        onClick={() => onClickItem(PAGE_STATES.home)}
      />
      <MainMenuItem
        active={currentPageState === PAGE_STATES.pages}
        icon={<PagesSVG />}
        label="Pages"
        onClick={() => onClickItem(PAGE_STATES.pages)}
      />
      <MainMenuItem
        active={currentPageState === PAGE_STATES.bluetooth}
        icon={<ExportSVG />}
        label="Deploy"
        onClick={() => onClickItem(PAGE_STATES.bluetooth)}
      />
    </div>
  );
}
