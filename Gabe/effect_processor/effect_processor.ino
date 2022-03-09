//Includes
#include <Wire.h>
#include <pgmspace.h>
#include "ROM1.h"
#include "ROM2.h"
#include "ROM3.h"
#include "ROM4.h"
#include "ROM5.h"
#include "ROM6.h"
#include "ROM7.h"
#include "ROM8.h"
#include "WiFi.h"
#include "esp_now.h"

//Define connections for the ESP32
int t0 = 13; // FV1_T0 - 0: use internal ROM programs, 1: use programs from external EEPROM
int s0 = 14; // FV1_S0 - Program select LSB
int s1 = 18; // FV1_S1 - Program select
int s2 = 19; // FV1_S2 - Program select MSB
int pot0 = 25; // FV1_P0 - Potentiometer 0 Analog Input
int pot1 = 26; // FV1_P1 - Potentiometer 1 Analog Input
int pot2 = 4; // FV1_P2 - Potentiometer 2 Analog Input
int sda = 21; // SDA - EEPROM data (internal pull up)
int scl = 22; // SCL - EEPROM clock (internal pull up)

//Memory definitions
#define FV1_EEPROM_ADDR 0x50
#define ESP_EEPROM_ADDR 0x57
#define MAX_LENGTH 512

byte* prog_addr[] = {(byte *)ROM_00, (byte *)ROM_01, (byte *)ROM_02, (byte *)ROM_03, (byte *)ROM_04,  (byte *)ROM_05, (byte *)ROM_06, (byte *)ROM_07 };

String input;

// Define LED connections, channels and toggles
int ledMode = 0; 
int ledR = GPIO_NUM_12;
int ledG = GPIO_NUM_27;
int ledB = GPIO_NUM_33;
const int ledRChannel = 1;
const int ledGChannel = 2;
const int ledBChannel = 3;

//Set PWM properties
const int freq = 30000; //keep this above human hearing frequency
const int resolution = 8; // for 0-255 values for RGB

const int pot2Channel = 0;

int effectCounter = 1;

// ESP-NOW shit
// put in the interface MAC address here
uint8_t broadcastMACAddress[] = {0x34, 0x94, 0x54, 0x00, 0x3B, 0x78};
// uint8_t broadcastMACAddress[] = {0x34, 0x94, 0x54, 0x00, 0x45, 0xE4};

// Define the variables that will store the data that is to be sent
char effectName[32] = "FROM PROCESSOR";
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
  if (status == 0)
  {
    success = "Delivery Succeded";
  }
  else
  {
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

  Serial.println("Incoming Data");
  Serial.print("Effect Name: ");
  Serial.println(incomingReadings.effectName);
  Serial.print("Effect Value: ");
  Serial.println(incomingReadings.effectValue);
  Serial.print("Effect Type: ");
  Serial.println(incomingReadings.effectType);

  if (String(incomingReadings.effectType) == "EFFECT") {
    selectEffect(String(incomingReadings.effectValue));
  }
  else if (String(incomingReadings.effectType) == "SWITCH") {
    if (digitalRead(t0) == LOW) {
      selectEffect("e");
    }
    else {
      selectEffect("i");
    }
  }
  else if (String(incomingReadings.effectType) == "POT") {
    setPots(incomingReadings.effectValue, 128, 128);
  }
}

void setup() {
  Serial.begin(115200);
  delay(10);
  Serial.println("Hello! Enter effect from 0-7: ");

  // Sets the device as a wifi station
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

  //Setup PWM for pot2
  ledcAttachPin(pot2, pot2Channel);
  ledcSetup(pot2Channel, freq, resolution);

  // attach the channels to the GPIOs to be controlled
  ledcAttachPin(ledR, ledRChannel);
  ledcAttachPin(ledG, ledGChannel);
  ledcAttachPin(ledB, ledBChannel);

  // configure the LED PWM functionalities
  ledcSetup(ledRChannel, freq, resolution);
  ledcSetup(ledGChannel, freq, resolution);
  ledcSetup(ledBChannel, freq, resolution);

  //Set pinmodes
  pinMode(ledR, OUTPUT);
  pinMode(ledG, OUTPUT);
  pinMode(ledB, OUTPUT);
  pinMode(t0, OUTPUT);
  pinMode(s0, OUTPUT);
  pinMode(s1, OUTPUT);
  pinMode(s2, OUTPUT);

  //Set bypass on
  selectEffect("5");
  setPots(128,128,128);

  Wire.begin();
  Wire.setClock(400000); //Most EEPROMs can run 400kHz and higher

  int addr = 0; //first address
  delay(10);
    while (addr < 512) {
      for (int program = 0; program < 8; program++) {
        Serial.print(addr + program * 512);
        Serial.print(":");
       
        Serial.print(i2c_eeprom_read_byte(FV1_EEPROM_ADDR, addr+program*512), HEX); 
        Serial.print(" ");
        Serial.print(i2c_eeprom_read_byte(FV1_EEPROM_ADDR, addr+program*512+1), HEX);
        Serial.print(" ");
        Serial.print(i2c_eeprom_read_byte(FV1_EEPROM_ADDR, addr+program*512+2), HEX);
        Serial.print(" ");
        Serial.print(i2c_eeprom_read_byte(FV1_EEPROM_ADDR, addr+program*512+3), HEX);
        Serial.print("|  ");
      }
      addr+=4; 
      Serial.println();
      delay(10);
  }
  Serial.println("-----------------");


  for (int program = 0; program<8; program++) {
    Serial.print("Writing program ");
    Serial.println(program);
    for (int page=0; page<MAX_LENGTH; page+=16) {
        // write 16 bytes at a time to not stress out Wire buffer
        //Serial.print((int)prog_addr[program]);
        //Serial.print(" ");
        //Serial.println(page+program*512);
      i2c_eeprom_write_page(FV1_EEPROM_ADDR, page+program*512, prog_addr[program], page); // write to EEPROM 
      delay(10); //add a small delay
      toggleLED();
    }
  }
  Serial.println("Memory written");

}

void loop() {
  /* if(readStringUntil(input, '\n'))
  {
    Serial.print("Final Input: ");
    Serial.println(input);
    input = "";

    selectEffect(input);
  } */
  
  if (Serial.available() > 0)
  {
    input = Serial.readStringUntil('\n');
    Serial.print("Input: ");
    Serial.println(input);
    selectEffect(input);
  }
  // sendReading();
  delay(3000); 
  toggleLED();
}

void getData() {
  effectValue = effectCounter * 5;
  effectCounter++;
}

bool readStringUntil(String& input, char end_char)
{
  while(Serial.available())
  {
    char c = Serial.read();
    input += c;

    if(c == end_char) return true;
  }

  return false;
}

void toggleLED()
{
  if (ledMode == 0)
  {
    setLED(255,0,0); 
    ledMode = 1;   
  }
  else if (ledMode == 1)
  {
    setLED(0,255,0);
    ledMode = 2;
  }
  else if (ledMode == 2)
  {
    setLED(0,0,255);
    ledMode = 3;
  }
  else
  {
    setLED(255,255,255);
    ledMode = 0;
  }
}

void setLED(int brightness_R, int brightness_G, int brightness_B)
{
  ledcWrite(ledRChannel, constrain(255-brightness_R,0, 255));
  ledcWrite(ledGChannel, constrain(255-brightness_G,0, 255));
  ledcWrite(ledBChannel, constrain(255-brightness_B,0, 255));
}

void sendReading() {
  getData();
  
  strcpy(myReadings.effectName, effectName);
  myReadings.effectValue = effectValue;
  strcpy(myReadings.effectType, effectType);
  
  // Send the data via ESP-NOW
  esp_err_t result = esp_now_send(broadcastMACAddress, (uint8_t *) &myReadings, sizeof(myReadings));
   
  if (result == ESP_OK) {
    Serial.println("Sent with success");
  }
  else {
    Serial.println("Error sending the data");
  }
}

void selectEffect(String input)
{
  if (input == "e")
  {
    digitalWrite(t0, HIGH);
    Serial.println("SWITCHING TO EXTERNAL"); 
  }
  else if (input == "i")
  {
    digitalWrite(t0, LOW); 
    Serial.println("SWITCHING TO INTERNAL"); 
  }
  else if (input == "send")
  {
    sendReading();
  }
  else if (input.length() == 12)
  {
    int value0 = (input.substring(0,3)).toInt();
    int value1 = (input.substring(4,7)).toInt();
    int value2 = (input.substring(8)).toInt();
    Serial.println(value0);
    Serial.println(value1);
    Serial.println(value2);
  }
  else
  {
    int effectNumber = input.toInt();
    Serial.println("hit the else");
    if (effectNumber >= 0 && effectNumber <= 7)
    {
      Serial.print("chosen effect #");
      Serial.println(effectNumber);
      digitalWrite(s0, bitRead(effectNumber, 0)); 
      digitalWrite(s1, bitRead(effectNumber, 1)); 
      digitalWrite(s2, bitRead(effectNumber, 2)); 
    }
  } 
}

void setPots(int pot0Value, int pot1Value, int pot2Value)
{
  dacWrite(pot0, constrain(pot0Value, 0, 255));
  dacWrite(pot1, constrain(pot1Value, 0, 255));
  ledcWrite(pot2Channel, constrain(pot2Value, 0, 255));
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
    Wire.requestFrom(deviceaddress, 1);
    if (Wire.available()) rdata = Wire.read();
    return rdata;
}

/*
Write pot0 or pot1 with eg:
dacWrite(pot1, 0);

Write pot2 with eg:
ledcWrite(pot2Channel, 0);

Prog |  Description     |     POT0      |     POT1     |     POT2    |
  0  |  Chorus-reverb   | Reverb mix    | Chorus rate  | Chorus mix  |
  1  |  Flange-reverb   | Reverb mix    | Flange rate  | Flange mix  |
  2  |  Tremolo-reverb  | Reverb mix    | Tremolo rate | Tremolo mix |
  3  |  Pitch shift     | Pitch +/-4    |       -      |     -       |
  4  |  Pitch-echo      | Pitch shift   | Echo delay   | Echo mix    |
  5  |  Test            |       -       |       -      |     -       |
  6  |  Reverb 1        | Reverb time   | HF filter    | LF filter   |
  7  |  Reverb 2        | Reverb time   | HF filter    | LF filter   |

 */
