class Button {
  public:
    byte pin;
    byte pairedPin; //set to zero is not paried
    bool flag = 0;
    unsigned long lastDebounceTime = 0;
    int debounceDelay = 50;
    
    Button(byte pin, byte pairedPin, int debounceDelay) {
      this->pin = pin;
      this->pairedPin = pairedPin;
      this->debounceDelay = debounceDelay;
      init();
    }
    void init() {
      pinMode(pin, INPUT_PULLUP);
    }

};
