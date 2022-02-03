import React from "react";

import styles from "./index.module.scss";

// List of bluetooth devices
export default function BTDeviceList() {
  const testList = [
    "andrewuuid1",
    "gabeuuid2",
    "craiguuid3",
    "jpuuid4",
    "andrewuuid10",
    "gabeuuid20",
    "craiguuid30",
    "jpuuid40",
  ];

  function renderDeviceList(list) {
    return list?.map((element) => {
      return (
        <div key={element} className={styles.element}>
          {element}
        </div>
      );
    });
  }

  return (
    <div className={styles.btDeviceList}>
      <div className={styles.title}>Device UUIDs</div>{" "}
      <div className={styles.list}>{renderDeviceList(testList)}</div>
    </div>
  );
}
