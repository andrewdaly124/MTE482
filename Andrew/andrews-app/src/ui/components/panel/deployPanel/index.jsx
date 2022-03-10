import React from "react";
import { exportProfile } from "../../../../utils/io";

import styles from "./index.module.scss";

import Button from "../../button";

// home panel inner
export default function DeployPanel() {
  return (
    <div className={styles.deployPanel}>
      <div className={styles.title}>Deploy</div>
      <div className={styles.inner}>
        File transfer is currently under development! For now, click the button
        below to copy the current profile to your clipboard, and then run the
        middleman software to transfer this profile to your Corda effects
        console.
      </div>
      <div className={styles.importButton}>
        <Button inner="Copy Profile to Clipboard" onClick={exportProfile} />
      </div>
    </div>
  );
}
