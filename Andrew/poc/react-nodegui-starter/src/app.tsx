import {
  Text,
  Window,
  hot,
  View,
  LineEdit,
  useEventHandler,
  Button,
} from "@nodegui/react-nodegui";
import { QLineEditSignals, QPushButtonSignals } from "@nodegui/nodegui";
import React from "react";
import { QIcon } from "@nodegui/nodegui";
import nodeguiIcon from "../assets/nodegui.jpg";
import { handlePagesInput, saveNewProfile, initiateFtp } from "./ftpModule";

const minSize = { width: 200, height: 150 };
const winIcon = new QIcon(nodeguiIcon);

export function App() {
  const inputHandler = useEventHandler<QLineEditSignals>(
    {
      textChanged: (e: string) => handlePagesInput(e),
    },
    []
  );

  const saveProfileHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => saveNewProfile(),
    },
    []
  );

  const ftpHandler = useEventHandler<QPushButtonSignals>(
    {
      clicked: () => initiateFtp(),
    },
    []
  );

  return (
    <Window
      windowIcon={winIcon}
      windowTitle="Corda Middleware"
      minSize={minSize}
      styleSheet={styleSheet}
    >
      <View style={containerStyle}>
        <Text id="header">Welcome to Corda File Transfer!</Text>
        <Text id="description">Paste your profile to the below field!</Text>
        <LineEdit on={inputHandler} />
        <Text id="description">
          Click the below button to save your profile to a json config file
        </Text>
        <Button on={saveProfileHandler} text="Save Profile" />
        <Text id="description">
          Click the below button to transfer your profile down to Corda
        </Text>
        <Button on={ftpHandler} text="Transfer Files" />
      </View>
    </Window>
  );
}

const containerStyle = `
  flex: 1; 
`;

const styleSheet = `
  #header {
    font-size: 24px;
    padding-top: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }

  #description {
    font-size: 14px;
    padding-top: 10px;
    padding-horizontal: 20px;
    qproperty-alignment: 'AlignHCenter';
    font-family: 'sans-serif';
  }
`;

export default hot(App);
