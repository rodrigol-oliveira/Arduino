// Sample Arduino Json Web Client
// Downloads and parse http://jsonplaceholder.typicode.com/users/1
//
// Copyright Benoit Blanchon 2014-2016
// MIT License
//
// Arduino JSON library
// https://github.com/bblanchon/ArduinoJson
// If you like this project, please add a star!

#include <ArduinoJson.h>
#include <SPI.h>
#include <Ethernet.h>
#define sensor1 A0

int valorsensor1=0 ;
EthernetClient client;
IPAddress ip(10,0,0,2);


const char* server = "10.0.0.3";  // server's address    analize?umidade1=100&umidade2=100&umidade3=100&umidade4=100&serial=ioneusjt
const char* textosensor1 = "/analize?umidade1=";                    // http resource
const char* textosensor2 = "&umidade2=20";                    // http resource
const char* textosensor3 = "&umidade3=30";                    // http resource
const char* textosensor4 = "&umidade4=40";                    // http resource
const char* serial = "&serial=ioneusjt";                    // http resource

const unsigned long BAUD_RATE = 9600;                 // serial connection speed
const unsigned long HTTP_TIMEOUT = 10000;  // max respone time from server
const size_t MAX_CONTENT_SIZE = 512;       // max size of the HTTP response

// The type of data that we want to extract from the page
struct UserData {
  char acao[32];
 // char planta[32];
};
int valor_analogico1;
// ARDUINO entry point #1: runs once when you press reset or power the board
void setup() {
  initSerial();
  initEthernet();
  pinMode(sensor1, INPUT);
  pinMode(13, OUTPUT);
}

// ARDUINO entry point #2: runs over and over again forever
void loop() {

  
  if (connect(server)) {
    if (sendRequest(server, textosensor1,textosensor2) && skipResponseHeaders()) {
      char response[MAX_CONTENT_SIZE];
      readReponseContent(response, sizeof(response));

      UserData userData;
      if (parseUserData(response, &userData)) {
        printUserData(&userData);
      }
    }
    disconnect();
  }
  wait();
}

// Initialize Serial port
void initSerial() {
  Serial.begin(BAUD_RATE);
  while (!Serial) {
    ;  // wait for serial port to initialize
  }
  Serial.println("Serial ready");
}

// Initialize Ethernet library
void initEthernet() {
  byte mac[] = {0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED};
  // start the Ethernet connection:
  if (Ethernet.begin(mac) == 0) {
    Serial.println("Failed to configure Ethernet using DHCP");
    // try to congifure using IP address instead of DHCP:
    Ethernet.begin(mac, ip);
  }
}

// Open connection to the HTTP server
bool connect(const char* hostName) {
  Serial.print("Connect to ");
  Serial.println(hostName);

  bool ok = client.connect(server, 3000);

  Serial.println(ok ? "Connected" : "Connection Failed!");
  return ok;
}

// Send the HTTP GET request to the server
bool sendRequest(const char* host, const char* resource, const char* agua) {

//  valor_analogico1 = analogRead(sensor1);
  //valorsensor1 = (char*)analogRead(sensor1);
  Serial.print("GET ");
  Serial.println(textosensor1);
  valorsensor1 =  analogRead(sensor1);
  Serial.println(valorsensor1);
  Serial.println(textosensor2);
  //Serial.println(valorsensor2);
  Serial.println(textosensor3);
  //Serial.println(valorsensor3);
  Serial.println(textosensor4);
  //Serial.println(valorsensor4);
  Serial.println(serial);
  
  client.print("GET ");
  client.print(textosensor1);
  client.print(analogRead(sensor1));
  
  client.print(textosensor2);
  //client.print(valorsensor2);
  client.print(textosensor3);
  //client.print(valorsensor3);
  client.print(textosensor4);
  //client.print(valorsensor4);
  client.print(serial);
  

  client.println(" HTTP/1.1");
  client.print("Host: ");
  client.println(server);
  client.println("Connection: close");
  client.println();
  
 
  return true;
}

// Skip HTTP headers so that we are at the beginning of the response's body
bool skipResponseHeaders() {
  // HTTP headers end with an empty line
  char endOfHeaders[] = "\r\n\r\n";

  client.setTimeout(HTTP_TIMEOUT);
  bool ok = client.find(endOfHeaders);

  if (!ok) {
    Serial.println("No response or invalid response!");
  }

  return ok;
}

// Read the body of the response from the HTTP server
void readReponseContent(char* content, size_t maxSize) {
  size_t length = client.readBytes(content, maxSize);
  content[length] = 0;
  Serial.println(content);
}


bool parseUserData(char* content, struct UserData* userData) {
  // Compute optimal size of the JSON buffer according to what we need to parse.
  // This is only required if you use StaticJsonBuffer.
  const size_t BUFFER_SIZE =
      JSON_OBJECT_SIZE(8)     // the root object has 8 elements
      + JSON_OBJECT_SIZE(5)   // the "address" object has 5 elements
      + JSON_OBJECT_SIZE(2)   // the "geo" object has 2 elements
      + JSON_OBJECT_SIZE(3);  // the "company" object has 3 elements

  // Allocate a temporary memory pool on the stack
  StaticJsonBuffer<BUFFER_SIZE> jsonBuffer;
  // If the memory pool is too big for the stack, use this instead:
  // DynamicJsonBuffer jsonBuffer;

  JsonObject& root = jsonBuffer.parseObject(content);

  if (!root.success()) {
    Serial.println("JSON parsing failed!");
    return false;
  }

  // Here were copy the strings we're interested in
  strcpy(userData->acao, root["acao"]);
  //strcpy(userData->planta, root["planta"]);
  //strcpy(userData->agua, root["agua"]);
  // It's not mandatory to make a copy, you could just use the pointers
  // Since, they are pointing inside the "content" buffer, so you need to make
  // sure it's still in memory when you read the string

  return true;
}

// Print the data extracted from the JSON
void printUserData(const struct UserData* userData) {
  Serial.print("acao a tomar = ");
  Serial.println(userData->acao);
  /*
  int acao = (int)userData->acao;
 if(acao!=0){
  digitalWrite(valvula, HIGH);
    Serial.println("entrou no IF");
 switch(acao){
  Case 50:
  Serial.println("entrou no 50");
      delay(5000);
      digitalWrite(valvula, LOW);
      delay(1000);
      digitalWrite(valvula, HIGH);
      delay(1000);
      digitalWrite(valvula, LOW);
      break;
      
   Case 70:
   Serial.println("entrou no 70");
      delay(10000);
      digitalWrite(13, LOW);
      break;
      
   Case 100:   
   Serial.println("entrou no 100");
      delay(15000);
      digitalWrite(valvula, LOW);
      break;
  } 
 }*/






int acao = (int)userData->acao;
 while(true){
 
 if ( acao = 50){
 Serial.println("entrou no 50");
 digitalWrite(13, HIGH);   // turn the LED on (HIGH is the voltage level)
  delay(5000);     
 digitalWrite(13, LOW);      
 break;
 }
 Serial.println("nao entrou no if"); 
 break;
 }
  
  //Serial.print("planta = ");
  //Serial.println(userData->planta);
  //Serial.print("agua = ");
  //Serial.println(userData->agua);
}

// Close the connection with the HTTP server
void disconnect() {
  Serial.println("Disconnect");
  client.stop();
}

// Pause for a 1 minute
void wait() {
  Serial.println("Wait 60 seconds");
  delay(30000);
}