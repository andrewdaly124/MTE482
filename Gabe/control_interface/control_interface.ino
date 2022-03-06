//Includes
#include <Wire.h>
#include <pgmspace.h>
#include <Adafruit_GFX.h>
#include <Adafruit_SSD1305.h>
#include "WiFi.h"
#include "esp_now.h"

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

//Other
int input;
int loopCount = 0;

int effectCounter = 1;

// ESP-NOW shit
// put in the processor MAC address here
// uint8_t broadcastMACAddress[] = {0x0C, 0xDC, 0x7E, 0x3D, 0xA1, 0x1C};
uint8_t broadcastMACAddress[] = {0x34, 0x94, 0x54, 0x00, 0x41, 0xF4};

// Define the variables that will store the data that is to be sent
char effectName[32] = "FROM INTERFACE";
uint8_t effectValue;
char effectType[32];

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
struct_message myReadings;
struct_message incomingReadings;
esp_now_peer_info_t peerInfo;

// Callback function for when the data is sent
void OnDataSent(const uint8_t *mac_addr, esp_now_send_status_t status) {
  Serial.print("\r\nLast Packet Send Status:\t");
  Serial.println(status == ESP_NOW_SEND_SUCCESS ? "Delivery Succeded" : "Delivery Failed");
  if (status == 0) {
    success = "Delivery Succeded";
  } else {
    success = "Delivery Failed";
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

  if (!display.begin(0x3C))
  {
     Serial.println("Unable to initialize OLED");
  }
  
  //Measure battery voltage
  printThreeLinesText("Battery voltage: ", String(measureVoltage()), " ");

  delay(1000);

  Serial.print("Battery voltage: ");
  Serial.println(measureVoltage());

  // Set the device as a wifi station
  WiFi.mode(WIFI_MODE_STA);
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

  toggleLed();

  Wire.begin();
  Wire.setClock(400000); //Most EEPROMs can run 400kHz and higher
}

void loop() {
  if (Serial.available())
  {
    input = Serial.parseInt();
    Serial.println(input);
  }
  /* if (loopCount >= 50000)
  {
    toggleLed(); 
    loopCount = 0; 
  } */

  //toggleLed();

  /*if (digitalRead(btn0) == 0)
  {
    while (digitalRead(btn0) == 0)
    {
      delay(100); 
      Serial.println("BUTTON 0!");
      printThreeLinesText("Button 0:", "Pressed!", " ");
    }
    printThreeLinesText("Button 0:", "Released!", " ");
    
    sendReading();
  }*/
  printDisplay();
  ifButtonPressed();
  GarbageEncoderCheck();
  // loopCount ++;

  delay(100);
}

void sendReading() {
  // getData();
  
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

void getData() {
  effectValue = effectCounter * 3;
  effectCounter++;
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
  display.fillRoundRect(8, 10, counter, 8, 2, WHITE);
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

void GarbageEncoderCheck()
{
  //This garbage function doesn't use interrupts or any debounding therefor it BAD!
  
  // Read the current state of encA
   currentStateEncA = digitalRead(encA);   
    
   // If the previous and the current state of the encA are different then a pulse has occured
   if (currentStateEncA != previousStateEncA){ 
       
     // If the encB state is different than the encA state then 
     // the encoder is rotating counterclockwise
     if (digitalRead(encB) != currentStateEncA) { 
       counter -= 5;
       
     } else {
       // Encoder is rotating clockwise
       counter += 5;
       
     }
     Serial.print("Encoder Value: ");
     Serial.println(counter);

     effectValue = counter;
     strcpy(effectType, "POT");
     sendReading();

     // printThreeLinesText("Encoder Value: ", String(counter), " ");
   } 
   // Update previousStateEncA with the current state
   previousStateEncA = currentStateEncA; 
}

void ifButtonPressed()
{
  if (digitalRead(btn0) == 0)
  {
    while (digitalRead(btn0) == 0)
    {
      delay(50); 
      Serial.println("BUTTON 0!");
      // printThreeLinesText("Button 0:", "Pressed!", " ");
    }
    // printThreeLinesText("Button 0:", "Released!", " ");
    
    pressedButtons[0] = true;
    effectValue = 0;
    strcpy(effectType, "EFFECT");
    sendReading();
  }
  else if (digitalRead(btn1) == 0)
  {
    while (digitalRead(btn1) == 0)
    {
      delay(50); 
      Serial.println("BUTTON 1!");
      // printThreeLinesText("Button 1:", "Pressed!", " ");
    }
   // printThreeLinesText("Button 1:", "Released!", " ");

    effectValue = 1;
    strcpy(effectType, "EFFECT");
    sendReading();
  }
  else if (digitalRead(btn2) == 0)
  {
    while (digitalRead(btn2) == 0)
    {
      delay(50); 
      Serial.println("BUTTON 2!");
      // printThreeLinesText("Button 2:", "Pressed!", " ");
    }
    // printThreeLinesText("Button 2:", "Released!", " ");

    effectValue = 2;
    strcpy(effectType, "EFFECT");
    sendReading();
  }
  else if (digitalRead(btn3) == 0)
  {
    while (digitalRead(btn3) == 0)
    {
      delay(50); 
      Serial.println("BUTTON 3!");
      // printThreeLinesText("Button 3:", "Pressed!", " ");
    }
    // printThreeLinesText("Button 3:", "Released!", " ");

    effectValue = 3;
    strcpy(effectType, "EFFECT");
    sendReading();
  }
  else if (digitalRead(encS) == 0)
  {
    while (digitalRead(encS) == 0)
    {
      delay(50); 
      Serial.println("ENCODER SWITCH!");
      // printThreeLinesText("Encoder:", "Pressed!", " ");
    }
    // printThreeLinesText("Encoder:", "Released!", " ");

    effectValue = 0;
    strcpy(effectType, "SWITCH");
    sendReading();
  }
}
