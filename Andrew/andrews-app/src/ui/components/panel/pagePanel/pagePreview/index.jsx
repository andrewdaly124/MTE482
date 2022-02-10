import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  getCurrentPageNumber,
  getCurrentPage,
} from '../../../../../store/selectors';

import styles from './index.module.scss';

import Button from '../../../button';
import InputField from '../../../inputField';
import { ReactComponent as RenameSVG } from '../../../../assets/rename.svg';

// page preview, need edit/save
export default function PagePreview() {
  const currentPageNumber = useSelector(getCurrentPageNumber);
  const currentPage = useSelector(getCurrentPage);

  const [isEditMode, setIsEditMode] = useState(false);
  const [editName, setEditName] = useState(currentPage.name);
  const [editDescription, setEditDescription] = useState(
    currentPage.description,
  );

  let onEnter;

  function toggleEditMode(explicitFlag) {
    const isEditOverride = explicitFlag ?? isEditMode;
    console.log('toggling edit mode', isEditOverride);

    if (isEditOverride) {
      // save and push to state
      window.removeEventListener('keydown', onEnter);
      console.log('remove event listener');
    } else {
      window.addEventListener('keydown', onEnter);
      console.log('add event listener');
    }

    setIsEditMode(!isEditOverride);
    setEditName(currentPage.name);
    setEditDescription(currentPage.description);
  }

  onEnter = (e) => {
    console.log(e.code);
    if (e.code === 'Enter') {
      toggleEditMode(true);
    }
  };

  function onInputFieldChange(e, setter) {
    setter(e.target.value);
  }

  return (
    <div className={styles.pagePreview}>
      <div className={styles.header}>
        {isEditMode ? (
          <InputField
            value={editName}
            onChange={(e) => onInputFieldChange(e, setEditName)}
          />
        ) : (
          <div className={styles.title}>
            {currentPage.name || `Page ${currentPageNumber}`}
          </div>
        )}
        <div className={styles.button}>
          <Button
            inner={<RenameSVG />}
            onClick={() => toggleEditMode()}
            size="normal"
          />
        </div>
      </div>

      {isEditMode ? (
        <div className={styles.body}>
          <InputField
            value={editDescription}
            onChange={(e) => onInputFieldChange(e, setEditDescription)}
          />
        </div>
      ) : /* currentPage.description */ true ? ( // obv remove this
        <div className={styles.body}>
          <div className={styles.description}>
            {currentPage.description ||
              `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. ${currentPageNumber}`}
          </div>
        </div>
      ) : null}
    </div>
  );
}
