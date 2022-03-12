//Includes
#include <Wire.h>
#include <pgmspace.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1305.h>
#include "WiFi.h"
#include "esp_now.h"
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

// enum UIState { EFFECT_SELECTION, POT_SELECTION };

typedef struct effect {
  uint8_t number;
  uint8_t value;
} effect;

effect internalEffects[8];
effect externalEffects[8];
// effect effectArray[16];
int currentPage = 0; //0-1
bool useInternalEffects = true;
int currentEffect = -1;
int currentPot = 0;

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
#define MAX_LENGTH 512

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

//Other
int input;
int loopCount = 0;

// ESP-NOW shit
// put in the processor MAC address here
// uint8_t broadcastMACAddress[] = {0x0C, 0xDC, 0x7E, 0x3D, 0xA1, 0x1C};
uint8_t broadcastMACAddress[] = {0x34, 0x94, 0x54, 0x00, 0x41, 0xF4};

// Define the variables that will store the data that is to be sent
char effectName[32] = "FROM INTERFACE";
uint8_t effectValue = 0;
char effectType[32] = "TEST";

// Define the variables that will store the incoming data
char incomingName[32];
uint8_t incomingValue;
char incomingType[32];

// make sure this is the same structure on the other side
typedef struct struct_message {
  char effectName[32];
  uint8_t effectValue;
  char effectType[32];
} struct_message;

String success;
bool connectivityStatus = false;
struct_message myReadings;
struct_message incomingReadings;
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
  memcpy(&incomingReadings, incomingData, sizeof(incomingReadings));
  
  Serial.print("Bytes received: ");
  Serial.println(len);
  
  memcpy(incomingName, incomingReadings.effectName, sizeof(incomingReadings.effectName));
  incomingValue = incomingReadings.effectValue;
  memcpy(incomingType, incomingReadings.effectType, sizeof(incomingReadings.effectType));

  Serial.print("Effect Name: ");
  Serial.println(incomingReadings.effectName);
  Serial.print("Effect Value: ");
  Serial.println(incomingReadings.effectValue);
  Serial.print("Effect Type: ");
  Serial.println(incomingReadings.effectType);

  printThreeLinesText(String(incomingReadings.effectName),
            String(incomingReadings.effectValue),
            String(incomingReadings.effectType));
}

//Measure the battery voltage
float measureVoltage()
{
  adcValue = analogRead(vSense);
  voltage = adcValue * 0.00153511 + 0.448983;
  return voltage;
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
  WiFi.mode(WIFI_AP_STA);
  Serial.print("MAC Address: ");
  Serial.println(WiFi.macAddress());

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
  initializeEffects();
  Serial.println("Initialized Effects.");

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

void initializeEffects() {
  for(int i = 0; i < 8; i++) {
    internalEffects[i].number = i;
    internalEffects[i].value = 0;

    externalEffects[i].number = i;
    externalEffects[i].value = 0;
  }
}

void printDebug() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  printConnectivitySignal();
  printBatterySymbol(112, 3, 4);
  centreText(String(counter), 0);
  centreText(String(currentEffect), 12);
  display.display();
}

void printUI() {
  display.clearDisplay();
  display.setTextSize(1);
  display.setTextColor(WHITE);
  printConnectivitySignal();
  printBatterySymbol(112, 3, 7);
  display.drawRoundRect(8, 10, 112, 8, 2, WHITE);
  display.fillRoundRect(8, 10, min(counter/2, 112), 8, 2, WHITE);
  display.display();
}

void update_encoder()
{
  unsigned char result = rotary.process();

  if (result == DIR_CW) {
    counter = min(counter + 5, 255);
    // counter += 5;
    Serial.println(counter);
    encoderFlag = true;
  } else if (result == DIR_CCW) {
    counter = max(counter - 5, 0);
    // counter -= 5;
    Serial.println(counter);
    encoderFlag = true;
  }
}

void checkEncoderStatus()
{
  if(encoderFlag) {
    char currentPot_str[32];
    itoa(currentPot, currentPot_str, 10);
    strcpy(effectName, currentPot_str);
    effectValue = counter;
    strcpy(effectType, "POT");
    sendReading();
    encoderFlag = false;
  }
}

void checkButtonStatus()
{
  if(button0.flag | button1.flag | button2.flag | button3.flag | encoder_button.flag | flag0_1 | flag2_3) {
    if(button0.flag) {
      effectValue = currentPage*4+0;
      currentEffect = (currentPage * 4) + 0;
      strcpy(effectType, "EFFECT");
      sendReading();
      button0.flag = false;
    }
    if(button1.flag) {
      effectValue = currentPage*4+1;
      currentEffect = (currentPage * 4) + 1;
      strcpy(effectType, "EFFECT");
      sendReading();
      button1.flag = false;
    }
    if(button2.flag) {
      effectValue = currentPage*4+2;
      currentEffect = (currentPage * 4) + 2;
      strcpy(effectType, "EFFECT");
      sendReading();
      button2.flag = false;
    }
    if(button3.flag) {
      effectValue = currentPage*4+3;
      currentEffect = (currentPage * 4) + 3;
      strcpy(effectType, "EFFECT");
      sendReading();
      button3.flag = false;
    }
    if(encoder_button.flag) {
      currentPot = (currentPot + 1) % 3;
      //strcpy(effectName, "POT");
      //effectValue = currentPot;
      //strcpy(effectType, "SWITCH");
      //sendReading();
      encoder_button.flag = false;
    }
    if(flag0_1) {
      if(currentPage == 0) {
        currentPage = 1;
        strcpy(effectType, "SWITCH");
        sendReading();
        flag0_1 = false;
      }
      else {
        currentPage = 0;
        flag0_1 = false;
      }
      /*strcpy(effectName, "PREV");
      effectValue = 0;
      strcpy(effectType, "PAGE");
      sendReading();
      flag0_1 = false;*/
    }
    if(flag2_3) {
      if(currentPage == 1) {
        currentPage = 0;
        strcpy(effectType, "SWITCH");
        sendReading();
        flag2_3 = false;
      }
      else {
        currentPage = 1;
        flag2_3 = false;
      }
      /*strcpy(effectName, "NEXT");
      effectValue = 0;
      strcpy(effectType, "PAGE");
      sendReading();
      flag2_3 = false;*/
    }
  }
}

void sendReading() {
  strcpy(myReadings.effectName, effectName);
  myReadings.effectValue = effectValue;
  strcpy(myReadings.effectType, effectType);
  
  // Send the data via ESP-NOW
  esp_err_t result = esp_now_send(broadcastMACAddress, (uint8_t *) &myReadings, sizeof(myReadings));
     
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
      //Serial.print("-->");
      //Serial.println(pgm_read_byte_near(data+c));
      Wire.write(pgm_read_byte_near(data+c));
    }
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
