//Includes
#include <Wire.h>
#include <pgmspace.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1305.h>
// #include <Adafruit_SSD1306.h>
#include <WiFi.h>
#include <esp_now.h>
#include <esp_wifi.h>

#include "Rotary.h"
#include "Button.h"


//Define connections
int led = 27;
int vSense = 32;
int encA = 25;
int encB = 14;
int encS = 26;
int btn0 = 16;
int btn1 = 17;
int btn2 = 2;
int btn3 = 15;
int OLED_RESET = 19;
int VOLED_EN = 13;
int sda = 21;
int scl = 22;

//OLED Setup
Adafruit_SSD1305 display(128, 32, &Wire, OLED_RESET);

// WiFi settings
// char ssid[] = "Cloudwifi-704-P";
// char ssid[] = "REAL Gamers Only 2.4GHz";
char ssid[] = "CLICK HERE !! -> ts.b34pnt.co?hr";

int currentPage = 0; //0-3
int totalPages = 0;
bool useInternalEffects = true;
int currentPot = 0;
char* displayNames[] = {"Chorus", "Reverb", "Tremolo", "Pitch Shift", "Chorus/Echoes/Flange", "Echo with Repeats", "Flanger", "Phaser", "Wah", "Phaser with Wah", "Pitch-Echo", "Tremolo-Reverb", "Reverb 1", "Chorus-Reverb", "Flange-Reverb", "Reverb 2"};
int roundRectX[] = {5, 41, 77, 113};
int numEffectsLoaded = 0;

//Used to toggle the LED
bool ledMode = 0;  

bool pressedButtons[5] = {false, false, false, false, false};

//Encoder test variables
int counter = 0; 
int currentStateEncA;
int previousStateEncA; 

//Voltage monitoring variables
int adcValue;
float voltage;

//Memory definitions
#define ESP_EEPROM_ADDR 0x57
#define MAX_LENGTH 128
#define READ_LENGTH 16
#define WRITE_LENGTH 16

// Define the 5 buttons
Button button0(btn0, btn1, 50);
Button button1(btn1, btn0, 50);
Button button2(btn2, btn3, 50);
Button button3(btn3, btn2, 50);
Button encoder_button(encS, 0, 50);

bool flag0_1 = 0;
bool flag2_3 = 0;
bool pairButtonPressed = false;

// Define the encoder
Rotary rotary = Rotary(encA, encB);
bool encoderFlag = false;
int8_t currentEncoderValues[] = {0, 0, 0};

//Other
int input;
int loopCount = 0;

// ESP-NOW shit
// put in the processor MAC address here
// Noisy Board
// uint8_t broadcastMACAddress[] = {0x0C, 0xDC, 0x7E, 0x3D, 0xA1, 0x1C};

// Original Interface Board
// uint8_t broadcastMACAddress[] = {0x34, 0x94, 0x54, 0x00, 0x41, 0xF4};

// Second Good Board (w/ Reset Button Problem)
uint8_t broadcastMACAddress[] = {0x34, 0x94, 0x54, 0x00, 0x27, 0xD0};

// Define the variables that will store the data that is to be sent
// char effectName[32] = "FROM INTERFACE";
// uint8_t effectValue = 0;
// char effectType[32] = "TEST";

int8_t currentEffectNumber = -1;
char currentEffectName[31];
uint8_t currentEffectNameLength;
// char* currentPotNames[3];
char currentPotOneName[31];
char currentPotTwoName[31];
char currentPotThreeName[31];
uint8_t currentPotValues[3];
uint8_t currentPotNameLengths[3];

// Define the variables that will store the incoming data
// char incomingName[32];
// uint8_t incomingValue;
// char incomingType[32];

int8_t incomingEffectNumber;
char incomingEffectName[31];
uint8_t incomingEffectNameLength;
// char* incomingPotNames[3];
char incomingPotOneName[31];
char incomingPotTwoName[31];
char incomingPotThreeName[31];
uint8_t incomingPotValues[3];
uint8_t incomingPotNameLengths[3];

// make sure this is the same structure on the other side
/*typedef struct struct_message {
  char effectName[32];
  uint8_t effectValue;
  char effectType[32];
} struct_message;*/

typedef struct effect_message {
  int8_t effectNumber;
  char effectName[31];
  uint8_t effectNameLength;
  // char* potNames[3];
  char potOneName[31];
  char potTwoName[31];
  char potThreeName[31];
  uint8_t potValues[3];
  uint8_t potNameLengths[3];
} effect_message;

int8_t effectNumbers[128];
char* effectNames[128];
char* potOneNames[128];
char* potTwoNames[128];
char* potThreeNames[128];
uint8_t allPotValues[384];

byte effect[128];

String success;
bool connectivityStatus = false;
// struct_message myReadings;
// struct_message incomingReadings;
effect_message currentEffect;
effect_message incomingEffect;
esp_now_peer_info_t peerInfo;

// Callback function for when the data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status);
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Succeded" : "Delivery Failed");
  if (status == 0) {
    success = "Delivery Succeded";
    connectivityStatus = true;
  } else {
    success = "Delivery Failed";
    connectivityStatus = false;
  }
}

// Callback function for when the data is received
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  memcpy(&incomingEffect, incomingData, sizeof(incomingEffect));
  
  Serial.print("Bytes received: ");
  Serial.println(len);

  incomingEffectNumber = incomingEffect.effectNumber;
  memcpy(incomingEffectName, incomingEffect.effectName, sizeof(incomingEffect.effectName));
  incomingEffectNameLength = incomingEffect.effectNameLength;
  memcpy(incomingPotOneName, incomingEffect.potOneName, sizeof(incomingEffect.potOneName));
  memcpy(incomingPotTwoName, incomingEffect.potTwoName, sizeof(incomingEffect.potTwoName));
  memcpy(incomingPotThreeName, incomingEffect.potThreeName, sizeof(incomingEffect.potThreeName));
  // memcpy(incomingPotNames, incomingEffect.potNames, sizeof(incomingEffect.potNames));
  memcpy(incomingPotValues, incomingEffect.potValues, sizeof(incomingEffect.potValues));
  memcpy(incomingPotNameLengths, incomingEffect.potNameLengths, sizeof(incomingEffect.potNameLengths));

  Serial.println("Incoming Data");
  Serial.print("Effect Number: ");
  Serial.println(incomingEffectNumber);
  Serial.print("Effect Name: ");
  for(int i = 0; i < sizeof(incomingEffectName); i++) {
    Serial.print(incomingEffectName[i]);
  }
  Serial.println();
  for(char c : incomingEffectName) {
    Serial.print(c);
  }
  Serial.println();
  Serial.println(incomingEffectName);
  Serial.print("Effect Name Length: ");
  Serial.println(incomingEffectNameLength);
  Serial.print("Pot Names: ");
  for(int i = 0; i < sizeof(incomingPotOneName); i++) {
    Serial.print(incomingPotOneName[i]);
  }
  Serial.println();
  for(char c : incomingPotOneName) {
    Serial.print(c);
  }
  Serial.print(", ");
  for(int i = 0; i < sizeof(incomingPotTwoName); i++) {
    Serial.print(incomingPotTwoName[i]);
  }
  for(char c : incomingPotTwoName) {
    Serial.print(c);
  }
  Serial.print(", ");  
  for(int i = 0; i < sizeof(incomingPotThreeName); i++) {
    Serial.print(incomingPotThreeName[i]);
  }
  for(char c : incomingPotThreeName) {
    Serial.print(c);
  }
  Serial.println();
  Serial.print(incomingPotOneName);
  Serial.print(sizeof(incomingPotOneName));
  Serial.print(", ");
  Serial.print(incomingPotTwoName);
  Serial.print(sizeof(incomingPotTwoName));
  Serial.print(", ");
  Serial.print(incomingPotThreeName);
  Serial.print(sizeof(incomingPotThreeName));
  Serial.println();
  Serial.print("Pot Values: ");
  for (const byte b : incomingPotValues) {
    Serial.print(b);
    Serial.print(", ");
  }
  Serial.println();
  Serial.print("Pot Name Lengths: ");
  for (const byte b : incomingPotNameLengths) {
    Serial.print(b);
    Serial.print(", ");
  }
  Serial.println();
  //Serial.println("SOMETHING ABOUT READING POT NAMES TO ESP EEPROM");

  // TO-DO: Write these effect names, pot names and pot values to ESP EEPROM
  /*effect_message temp;
  temp.effectNumber = incomingEffectNumber;
  strcpy(temp.effectName, incomingEffectName);
  strcpy(temp.potOneName, incomingPotOneName);
  strcpy(temp.potTwoName, incomingPotTwoName);
  strcpy(temp.potThreeName, incomingPotThreeName);*/

  /*effectNumbers[numEffectsLoaded] = incomingEffectNumber;
  strcpy(effectNames[numEffectsLoaded], incomingEffectName);
  strcpy(potOneNames[numEffectsLoaded], incomingPotOneName);
  strcpy(potTwoNames[numEffectsLoaded], incomingPotTwoName);
  strcpy(potThreeNames[numEffectsLoaded], incomingPotThreeName);
  memcpy(&allPotValues[numEffectsLoaded*3], incomingPotValues, sizeof(incomingPotValues));*/

  byte totalBytesElapsed = 0;

  effect[0] = incomingEffectNumber;
  totalBytesElapsed++;

  //memcpy(&effect[totalBytesElapsed], incomingEffectName, sizeof(incomingEffectName));
  for(int i = 0; i < sizeof(incomingEffectName) - incomingEffectNameLength; i++) {
    effect[totalBytesElapsed+i] = (byte) incomingEffectName[i];
  }

  totalBytesElapsed += (sizeof(incomingEffectName)-incomingEffectNameLength);

  for(int i = 0; i < incomingEffectNameLength; i++) {
    effect[totalBytesElapsed+i] = 0;
  }
  totalBytesElapsed += incomingEffectNameLength;
  
  //memcpy(&effect[totalBytesElapsed], incomingPotOneName, sizeof(incomingPotOneName));
  for(int i = 0; i < incomingPotNameLengths[0]; i++) {
    effect[totalBytesElapsed+i] = (byte) incomingPotOneName[i];
  }
  totalBytesElapsed += incomingPotNameLengths[0];
  
  for(int i = 0; i < sizeof(incomingPotOneName)-incomingPotNameLengths[0]; i++) {
    effect[totalBytesElapsed+i] = 0;
  }

  totalBytesElapsed += (sizeof(incomingPotOneName)-incomingPotNameLengths[0]);
  //memcpy(&effect[totalBytesElapsed], incomingPotTwoName, sizeof(incomingPotTwoName));

  for(int i = 0; i < incomingPotNameLengths[1]; i++) {
    effect[totalBytesElapsed+i] = (byte) incomingPotTwoName[i];
  }
  totalBytesElapsed += incomingPotNameLengths[1];
  
  for(int i = 0; i < sizeof(incomingPotTwoName)-incomingPotNameLengths[1]; i++) {
    effect[totalBytesElapsed+i] = 0;
  }

  totalBytesElapsed += (sizeof(incomingPotTwoName)-incomingPotNameLengths[1]);
  
  //memcpy(&effect[totalBytesElapsed], incomingPotThreeName, sizeof(incomingPotThreeName));
  for(int i = 0; i < incomingPotNameLengths[2]; i++) {
    effect[totalBytesElapsed+i] = (byte) incomingPotThreeName[i];
  }
  totalBytesElapsed += incomingPotNameLengths[2];
  
  for(int i = 0; i < sizeof(incomingPotThreeName)-incomingPotNameLengths[2]; i++) {
    effect[totalBytesElapsed+i] = 0;
  }

  totalBytesElapsed += (sizeof(incomingPotThreeName)-incomingPotNameLengths[2]);

  byte temp = 0;
  for(const byte b: incomingPotValues) {
    effect[totalBytesElapsed+temp] = incomingPotValues[temp];
    temp++;
  }

  for(int i = 0; i < sizeof(effect); i++) {
    Serial.print(effect[i]);
    Serial.print("|");
  }
  delay(10);
  Serial.println();
  int numWriteCycles = MAX_LENGTH / WRITE_LENGTH;
  Serial.println(numWriteCycles);
  Serial.println("WRITING");
  for(int i = 0; i < numWriteCycles; i++) {
    i2c_eeprom_write_page(ESP_EEPROM_ADDR, (numEffectsLoaded*MAX_LENGTH) + (i*WRITE_LENGTH), effect, i*WRITE_LENGTH);
  }
  delay(10);
  
  
  Serial.println();
  Serial.println("READING");
  /*for(int i = 0; i < MAX_LENGTH; i += READ_LENGTH) {
    byte readBuffer[READ_LENGTH];
    i2c_eeprom_read_buffer(ESP_EEPROM_ADDR, i+numEffectsLoaded*MAX_LENGTH, readBuffer, READ_LENGTH);

    for(int j = 0; j < sizeof(readBuffer); j++) {
      Serial.print(readBuffer[j]);
      Serial.print("|");
    }
    delay(10);
  }*/
  
  /*byte ncomingEffectNumber[] = {incomingEffectNumber};
  // Serial.println(sizeof(ncomingEffectNumber));
  i2c_eeprom_write_page(ESP_EEPROM_ADDR, (numEffectsLoaded*MAX_LENGTH), ncomingEffectNumber, 0);

  byte ncomingEffectName[sizeof(incomingEffectName)];
  Serial.println(sizeof(incomingEffectName));
  memcpy(ncomingEffectName, incomingEffectName, sizeof(incomingEffectName));

  for(int i = 0; i < sizeof(ncomingEffectName); i++) {
    Serial.print((char) ncomingEffectName[i]);
    //Serial.print(" ");
  }
  // i2c_eeprom_write_page(ESP_EEPROM_ADDR, (numEffectsLoaded*MAX_LENGTH)+ sizeof(ncomingEffectNumber), ncomingEffectName, sizeof(ncomingEffectNumber));
  Serial.println();*/
  numEffectsLoaded++;
}

/*
void OnDataRecv(const uint8_t * mac, const uint8_t *incomingData, int len) {
  memcpy(&incomingReadings, incomingData, sizeof(incomingReadings));
  
  Serial.print("Bytes received: ");
  Serial.println(len);

  incomingEffectNumber = incomingReadings.effectNumber;  
  memcpy(incomingEffectName, incomingReadings.effectName, sizeof(incomingReadings.effectName));
  memcpy(incomingPotValues, incomingReadings.potValues, sizeof(incomingReadings.potValues));

  // write the name and pot values to ESP EEPROM based on incomingEffectNumber
}
*/

//Measure the battery voltage
float measureVoltage()
{
  adcValue = analogRead(vSense);
  voltage = adcValue * 0.00153511 + 0.448983;
  return voltage;
}

int32_t getWiFiChannel(const char *ssid) {
  if (int32_t n = WiFi.scanNetworks()) {
      for (uint8_t i=0; i<n; i++) {
          if (!strcmp(ssid, WiFi.SSID(i).c_str())) {
              return WiFi.channel(i);
          }
      }
  }
  return 0;
}

void setup() {
  //Setup serial monitor
  Serial.begin(115200);
  Serial.println("Start of interface program!");
  
  //Set pinmodes
  pinMode(led, OUTPUT);
  pinMode(vSense, INPUT);
  pinMode(encA, INPUT_PULLUP);
  pinMode(encB, INPUT_PULLUP);
  pinMode(encS, INPUT_PULLUP);
  pinMode(btn0, INPUT_PULLUP);
  pinMode(btn1, INPUT_PULLUP);
  pinMode(btn2, INPUT_PULLUP);
  pinMode(btn3, INPUT_PULLUP);
  pinMode(OLED_RESET, OUTPUT);
  pinMode(VOLED_EN, OUTPUT);

  digitalWrite(VOLED_EN, HIGH);

  // Attach interrupts to the buttons
  attachInterrupt(digitalPinToInterrupt(btn0), button_change_0, CHANGE);
  attachInterrupt(digitalPinToInterrupt(btn1), button_change_1, CHANGE);
  attachInterrupt(digitalPinToInterrupt(btn2), button_change_2, CHANGE);
  attachInterrupt(digitalPinToInterrupt(btn3), button_change_3, CHANGE);
  attachInterrupt(digitalPinToInterrupt(encS), button_change_enc, CHANGE);

  // Attach interrupts to the encoder
  attachInterrupt(encA, update_encoder, CHANGE);
  attachInterrupt(encB, update_encoder, CHANGE);  

  if (!display.begin(0x3C))
  {
     Serial.println("Unable to initialize OLED");
  }
  
  //Measure battery voltage
  printThreeLinesText("Battery voltage: ", String(measureVoltage()), " ");

  delay(1000);

  Serial.print("Battery voltage: ");
  Serial.println(measureVoltage());

  // Set the device as a wifi station and access point
  WiFi.mode(WIFI_STA);
  Serial.print("MAC Address: ");
  Serial.println(WiFi.macAddress());

  int32_t channel = getWiFiChannel(ssid);

  // WiFi.printDiag(Serial);
  esp_wifi_set_promiscuous(true);
  esp_wifi_set_channel(channel, WIFI_SECOND_CHAN_NONE);
  esp_wifi_set_promiscuous(false);
  // WiFi.printDiag(Serial);

  Serial.print("Wi-Fi Channel: ");
  Serial.println(WiFi.channel());

  // Initialize ESP-NOW 
  if (esp_now_init() != ESP_OK) {
    Serial.println("Error initializing ESP-NOW");
    return;
  }
  else { Serial.println("ESP-NOW initialized!"); }

  // Once the ESP-NOW is initialized, register the send callback
  // function that will be called to get the status of a transmitted packet
  esp_now_register_send_cb(OnDataSent);

  // Register the peer device
  memcpy(peerInfo.peer_addr, broadcastMACAddress, 6);
  peerInfo.channel = 0;  
  peerInfo.encrypt = false;

  // Add the peer device        
  if (esp_now_add_peer(&peerInfo) != ESP_OK)
  {
    Serial.println("Failed to add peer device");
    return;
  }
  else { Serial.println("Added peer device through ESP-NOW!"); }
  
  // Register the callback function that will be called when new data is received
  esp_now_register_recv_cb(OnDataRecv);

  sendReading();

  toggleLed();

  Wire.begin();
  Wire.setClock(400000); //Most EEPROMs can run 400kHz and higher
}

void loop() {
  /*
  if (Serial.available())
  {
    input = Serial.parseInt();
    Serial.println(input);
  }*/

  //printButtonStatus();
  //printDebug();
  printUI();
  checkButtonStatus();
  checkEncoderStatus();
  
  
  // printUI();
  // printDisplay();
  // ifButtonPressed();
  // GarbageEncoderCheck();
  // loopCount ++;

  delay(100);
}

void printDebug() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  printConnectivitySignal();
  printBatterySymbol(112, 3, 4);
  centreText(String(counter), 0);
  centreText(String(currentEffectNumber), 12);
  display.display();
}

void printUI() {
  display.clearDisplay();
  display.setTextWrap(false);
  display.setTextSize(1);
  display.setTextColor(WHITE);
  printConnectivitySignal();
  printBatterySymbol(112, 3, 7);
  String title = String("Page #") + (currentPage+1);
  centreText(title, 0);

  display.drawRoundRect(8, 18, 112, 3, 1, WHITE);
  display.fillRoundRect(8, 18, min(currentPotValues[currentPot]/2, 112), 3, 1, WHITE);
  
  if(currentEffectNumber == -1) {
    centreText("PASS THROUGH", 10);
  }
  else {
    String middle = String(displayNames[currentEffectNumber]) + String(", Pot #") + (currentPot+1);
    centreText(middle, 10);
  }
  display.setCursor(6,23);
  if(currentEffectNumber != -1) {
    display.fillRoundRect(roundRectX[currentEffectNumber%4], 22, 7, 9, 2, WHITE);
  }

  // 36 apart

  for(int i = 0; i < 4; i++) {
    display.setTextColor(WHITE);
    display.setCursor(i*36+6, 23);
    
    if(currentEffectNumber%4 == i) {
      display.setTextColor(BLACK);
      display.print(String(i+1));
    }
    else {
      display.print(String(i+1));
    }
  }
  
  /*display.setTextColor(BLACK);
  display.print("1");
  display.setTextColor(WHITE);
  display.setCursor(42, 23);
  display.print("2");
  display.setCursor(78, 23);
  display.print("3");
  display.setCursor(114, 23);
  display.print("4");*/
  /*display.drawRoundRect(8, 10, 112, 8, 2, WHITE);
  display.fillRoundRect(8, 10, min(counter/2, 112), 8, 2, WHITE);*/
  display.display();
}

void update_encoder()
{
  unsigned char result = rotary.process();

  if (result == DIR_CW) {
    currentPotValues[currentPot] = min(currentPotValues[currentPot] + 5, 255);
    // counter = min(counter + 5, 255);
    // counter += 5;
    Serial.println(currentPotValues[currentPot]);
    encoderFlag = true;
  } else if (result == DIR_CCW) {
    currentPotValues[currentPot] = max(currentPotValues[currentPot] - 5, 0);
    //counter = max(counter - 5, 0);
    // counter -= 5;
    Serial.println(currentPotValues[currentPot]);
    encoderFlag = true;
  }
}

void checkEncoderStatus()
{
  
  if(encoderFlag) {
    // To-DO:
    // change this to re-write the pot value in the ESP EEPROM
    // based on currentEffectNumber and currentPotNumber
    
    // char currentPot_str[32];
    // itoa(currentPot, currentPot_str, 10);
    // strcpy(currentEffectName, currentPot_str);
    // effectValue = counter;
    // strcpy(effectType, "POT");
    //memcpy(currentPotValues, currentEncoderValues, sizeof(currentEncoderValues));
    sendReading();
    
    encoderFlag = false;
  }
}

void checkButtonStatus()
{
  // effectNumber = currentPage * 4 + (0,3)
  // grab the name and pot values from EEPROM
  // send them over to the processor

  if(button0.flag | button1.flag | button2.flag | button3.flag | encoder_button.flag | flag0_1 | flag2_3) {
    if(button0.flag) {
      // effectValue = currentPage*4+0;
      if (currentEffectNumber == (currentPage*4+0)) {
        currentEffectNumber = -1;
      }
      else {
        currentEffectNumber = (currentPage * 4) + 0;
      }
      Serial.print("Current Effect Number: ");
      Serial.println(currentEffectNumber);
      currentPotValues[0] = 0;
      currentPotValues[1] = 0;
      currentPotValues[2] = 0;
      // strcpy(effectType, "EFFECT");
      sendReading();
      button0.flag = false;
    }
    if(button1.flag) {
      // effectValue = currentPage*4+1;
      if (currentEffectNumber == (currentPage*4+1)) {
        currentEffectNumber = -1;
      }
      else {
        currentEffectNumber = (currentPage * 4) + 1;
      }
      Serial.print("Current Effect Number: ");
      Serial.println(currentEffectNumber);
      currentPotValues[0] = 0;
      currentPotValues[1] = 0;
      currentPotValues[2] = 0;
      // strcpy(effectType, "EFFECT");
      sendReading();
      button1.flag = false;
    }
    if(button2.flag) {
      // effectValue = currentPage*4+2;
      if (currentEffectNumber == (currentPage*4) + 2) {
        currentEffectNumber = -1;
      }
      else {
        currentEffectNumber = (currentPage * 4) + 2;
      }
      Serial.print("Current Effect Number: ");
      Serial.println(currentEffectNumber);
      currentPotValues[0] = 0;
      currentPotValues[1] = 0;
      currentPotValues[2] = 0;
      // strcpy(effectType, "EFFECT");
      sendReading();
      button2.flag = false;
    }
    if(button3.flag) {
      // effectValue = currentPage*4+3;
      if (currentEffectNumber == (currentPage*4) + 3) {
        currentEffectNumber = -1;
      }
      else {
        currentEffectNumber = (currentPage * 4) + 3;
      }
      Serial.print("Current Effect Number: ");
      Serial.println(currentEffectNumber);
      currentPotValues[0] = 0;
      currentPotValues[1] = 0;
      currentPotValues[2] = 0;
      // strcpy(effectType, "EFFECT");
      sendReading();
      button3.flag = false;
    }
    if(encoder_button.flag) {
      currentPot = (currentPot + 1) % 3;
      Serial.print("Current Pot: ");
      Serial.println(currentPot);
      // counter = currentEncoderValues[currentPot];
      //strcpy(effectName, "POT");
      //effectValue = currentPot;
      //strcpy(effectType, "SWITCH");
      //sendReading();
      encoder_button.flag = false;
    }
    if(flag0_1) {
      currentPage = max(currentPage-1, 0);
      Serial.println("PREV PAGE");
      flag0_1 = false;
      /*if(currentPage == 0) {
        currentPage = 1;
        Serial.print("Current Page: ");
        Serial.println(currentPage);
        // strcpy(effectType, "SWITCH");
        // sendReading();
        flag0_1 = false;
      }
      else {
        currentPage = 0;
        Serial.print("Current Page: ");
        Serial.println(currentPage);
        flag0_1 = false;
      }*/
      /*strcpy(effectName, "PREV");
      effectValue = 0;
      strcpy(effectType, "PAGE");
      sendReading();
      */
    }
    if(flag2_3) {
      currentPage = min(currentPage+1, 3);
      Serial.println("NEXT PAGE");
      flag2_3 = false;
      /*if(currentPage == 1) {
        currentPage = 0;
        Serial.print("Current Page: ");
        Serial.println(currentPage);
        // strcpy(effectType, "SWITCH");
        // sendReading();
        flag2_3 = false;
      }
      else {
        currentPage = 1;
        Serial.print("Current Page: ");
        Serial.println(currentPage);
        flag2_3 = false;
      }*/
      /*strcpy(effectName, "NEXT");
      effectValue = 0;
      strcpy(effectType, "PAGE");
      sendReading();
      */
    }
  }
}

void sendReading() {
  // strcpy(myReadings.effectName, effectName);
  // myReadings.effectValue = effectValue;
  // strcpy(myReadings.effectType, effectType);

  currentEffect.effectNumber = currentEffectNumber;
  strcpy(currentEffect.effectName, currentEffectName);
  currentEffect.effectNameLength = currentEffectNameLength;
  strcpy(currentEffect.potOneName, currentPotOneName);
  strcpy(currentEffect.potTwoName, currentPotTwoName);
  strcpy(currentEffect.potThreeName, currentPotThreeName);
  // memcpy(currentEffect.potNames, currentPotNames, sizeof(currentPotNames));
  memcpy(currentEffect.potValues, currentPotValues, sizeof(currentPotValues));
  memcpy(currentEffect.potNameLengths, currentPotNameLengths, sizeof(currentPotNameLengths));
 
  // Send the data via ESP-NOW
  //esp_err_t result = esp_now_send(broadcastMACAddress, (uint8_t *) &myReadings, sizeof(myReadings));
  esp_err_t result = esp_now_send(broadcastMACAddress, (uint8_t *) &currentEffect, sizeof(currentEffect));
     
  if (result == ESP_OK) {
    Serial.println("Sent with success");
  } else {
    Serial.println("Error sending the data");
  }
}

void printThreeLinesText(String line1, String line2, String line3)
{
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(0,0);
  display.println(line1);
  display.setCursor(0,12);
  display.println(line2);
  display.setCursor(0,24);
  display.println(line3);
  display.display();
}

// 21 letters across
// resolution is 128px x 32px
void printDisplay()
{
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  display.setCursor(42,0);
  display.println("EFFECTS");
  display.drawRoundRect(8, 10, 112, 8, 2, WHITE);
  display.fillRoundRect(8, 10, min(counter/2, 112), 8, 2, WHITE);
  display.setCursor(7,24);
  display.print("1");
  display.setCursor(42, 24);
  display.print("2");
  display.setCursor(78, 24);
  display.print("3");
  display.setCursor(114, 24);
  display.print("4");
  display.display();
}

void printUITest()
{
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  printConnectivitySignal();
  printBatterySymbol(112, 3, 4);
  centreText("SET NAME", 0);
  centreText("EFFECT NAME #1", 12);
  display.setCursor(6,23);
  display.fillRoundRect(4, 22, 7, 9, 2, WHITE);
  display.setTextColor(BLACK);
  display.print("1");
  display.setTextColor(WHITE);
  display.setCursor(42, 23);
  display.print("2");
  display.setCursor(78, 23);
  display.print("3");
  display.setCursor(114, 23);
  display.print("4");
  display.display();
}

void printButtonStatus()
{
  display.clearDisplay();
  
  if(button0.flag) {
    display.setCursor(6,23);
    display.setTextColor(WHITE);
    display.print("1");
  }
  if(button1.flag) {
    display.setCursor(30, 23);
    display.print("2");
  }
  if(button2.flag) {
    display.setCursor(50, 23);
    display.print("3");
  }
  if(button3.flag) {
    display.setCursor(75, 23);
    display.print("4");
  }
  if(encoder_button.flag) {
    display.setCursor(100, 23);
    display.print("5");
  }
  if(flag0_1) {
    display.setCursor(25, 0);
    display.print("0_1");
  }
  if(flag2_3) {
    display.setCursor(75, 0);
    display.print("2_3");
  }

  display.display();
}

void printConnectivitySignal()
{
  if (connectivityStatus){
    // Checkmark symbol
    display.drawLine(2, 5, 3, 6, WHITE);
    display.drawLine(3, 6, 7, 2, WHITE);
  }
  else {
    // X symbol
    display.drawLine(2, 2, 6, 6, WHITE);
    display.drawLine(2, 6, 6, 2, WHITE);
  }
}

void printBatterySymbol(int x, int y, int level)
{
  display.drawLine(x, y, x, y+1, WHITE);
  display.drawRoundRect(x+1, y-2, 10, 6, 1, WHITE);
  display.fillRect(x+10-level, y-1, level, 4, WHITE); 
}

void centreText(String words, int height)
{
  int l = words.length();

  display.setCursor((126-(l*6))/2+1, height);
  display.println(words);
}

void toggleLed()
{
  ledMode = !ledMode;
  digitalWrite(led, ledMode);
}

// data can be maximum of about 30 bytes, because the Wire library has a buffer of 32 bytes
void i2c_eeprom_write_page( int deviceaddress, unsigned int eeaddresspage, byte* data, unsigned int page ) {
    Wire.beginTransmission(deviceaddress);
    Wire.write((int)(eeaddresspage >> 8)); // MSB
    Wire.write((int)(eeaddresspage & 0xFF)); // LSB

    for ( int c = page; c < page+16; c++) {
      Serial.print(pgm_read_byte(data+c));
      Serial.print("|");
      Wire.write(pgm_read_byte(data+c));
    }
    // Serial.println();
    Wire.endTransmission();
}

byte i2c_eeprom_read_byte( int deviceaddress, unsigned int eeaddress ) {
    byte rdata = 0xFF;
    Wire.beginTransmission(deviceaddress);
    Wire.write((int)(eeaddress >> 8)); // MSB
    Wire.write((int)(eeaddress & 0xFF)); // LSB
    Wire.endTransmission();
    Wire.requestFrom(deviceaddress,1);
    if (Wire.available()) rdata = Wire.read();
    return rdata;
}

void i2c_eeprom_read_buffer(int deviceaddress, unsigned int eeaddress, byte *buffer, int length ) {
  Wire.beginTransmission(deviceaddress);
  Wire.write((int)(eeaddress >> 8)); // MSB
  Wire.write((int)(eeaddress & 0xFF)); // LSB
  Wire.endTransmission();
  Wire.requestFrom(deviceaddress, length);

  for (int c = 0; c < length; c++ ) {
    if (Wire.available()) buffer[c] = Wire.read();    
  }
}

//These silly functions are needed to pass the button objects properly
void button_change_0(){
  button_change(button0);
}

void button_change_1(){
  button_change(button1);
}

void button_change_2(){
  button_change(button2);
}

void button_change_3(){
  button_change(button3);
}

void button_change_enc(){
  button_change(encoder_button);
}

//This function is called through the above functions when a button changes state
void button_change(Button &button) {
  if (digitalRead(button.pin) == LOW) {
    button.lastDebounceTime = millis();
  }
  else {
    if ((millis() - button.lastDebounceTime) >= button.debounceDelay) {
      if ((button.pairedPin != 0) && (digitalRead(button.pairedPin) == LOW)) {
        if (button.pin == btn0 || button.pin == btn1){
          flag0_1 = true;
        }
        else{
          flag2_3 = true;
        }
        pairButtonPressed = true;
      }
      else if ((button.pairedPin == 0) || (pairButtonPressed == false)) {
        button.flag = true;
      }
      else {
        pairButtonPressed = false;
      }
    }
  }
}
/*
void i2c_eeprom_write_page(int deviceaddress, unsigned int eeaddresspage, byte* data, unsigned int page ) {
    Wire.beginTransmission(deviceaddress);
    Wire.write((int)(eeaddresspage >> 8)); // MSB
    Wire.write((int)(eeaddresspage & 0xFF)); // LSB

    for ( int c = page; c < page+WRITE_LENGTH; c++) {
      // Serial.print("-->");
      // Serial.println(pgm_read_byte_near(data+c));
      Wire.write(pgm_read_byte_near(data+c));
    }
    Wire.endTransmission();
}

byte i2c_eeprom_read_byte(int deviceaddress, unsigned int eeaddress ) {
    byte rdata = 0xFF;
    Wire.beginTransmission(deviceaddress);
    Wire.write((int)(eeaddress >> 8)); // MSB
    Wire.write((int)(eeaddress & 0xFF)); // LSB
    Wire.endTransmission();
    Wire.requestFrom(deviceaddress, 1);
    if (Wire.available()) rdata = Wire.read();
    return rdata;
}
*/
