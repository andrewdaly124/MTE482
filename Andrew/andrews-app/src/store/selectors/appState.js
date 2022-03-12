/**
 * TODO:
 * type returns and state
 */

export const getCurrentAppState = (state) => state.appState.currentAppState;

export const getColorHistory = (state) => state.appState.colorHistory;

export const getIsColorPickerOpen = (state) => state.appState.colorPickerOpen;

export const getIsPresetEditorOpen = (state) => state.appState.presetEditorOpen;

export const getCurrUid = (state) => state.appState.uid;
