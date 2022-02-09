import { useSelector } from "react-redux";
import {
  getCurrentPage,
  getCurrentPageNumber,
} from "../../../../store/selectors";

import styles from "./index.module.scss";

import PageScroll from "./pageScroll";
import PagePreview from "./pagePreview";
import PresetDropdown from "./presetDropdown";

// pages panel inner
export default function PagePanel() {
  const currentPage = useSelector(getCurrentPage);
  const currentPageNumber = useSelector(getCurrentPageNumber);

  return (
    <div className={styles.pagePanelScrollContianer}>
      <div className={styles.pagePanel}>
        <div className={styles.title}>Pages</div>
        <div className={styles.scrollbar}>
          <PageScroll />
        </div>
        <div className={styles.preview}>
          <PagePreview />
        </div>
        <div className={styles.presets}>
          {currentPage.presets.map((preset, i) => {
            return (
              <div className={styles.preset} key={currentPageNumber * 10 + i}>
                <PresetDropdown
                  number={i + 1}
                  name={preset.name || `Preset ${i + 1}`}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
