// Sample Arduino Json Web Client
// Downloads and parse http://jsonplaceholder.typicode.com/users/1
//
// Copyright Benoit Blanchon 2014-2016
// MIT License
//
// Arduino JSON library
// https://github.com/bblanchon/ArduinoJson
// If you like this project, please add a star!

#include <ArduinoJson.h> //importa biblioteca Json
#include <SPI.h>         //importa biblioteca de ação
#include <Ethernet.h>    //importa biblioteca de Ethernet 
//valvula
#define sensor1 A0
int valvula= 3;//porta logica do sensor de agua
int valorsensor1=0 ;//valor do sensor 1
//vazao de agua
float vazao; //Variável para armazenar o valor em L/min
float media=0; //Variável para tirar a média a cada 1 minuto
int contaPulso; //Variável para a quantidade de pulsos
int i=0; //Variável para contagem
//
EthernetClient client; //cria atributo da placa de rede
IPAddress ip(10,0,0,2);//defini um ip a ser usado no atributo client
//localhost:3000/analise?umidade1=10&umidade2=20&umidade3=30&umidade4=40&valvula=off&consumo=0&serial=ioneusjt

const char* server = "10.0.0.3";  // server's address    
const char* textosensor1 = "/analise?umidade1=";                    // metodo analise sensor 1
const char* textosensor2 = "&umidade2=20";                          // metodo analise sensor 2
const char* textosensor3 = "&umidade3=30";                          // metodo analise sensor 3
const char* textosensor4 = "&umidade4=40";                          // metodo analise sensor 4
const char* textovalvula = "&valvula=off";                          // metodo analise sensor 4
const char* textoconsumo = "&consumo=0";                          // metodo analise sensor 4
const char* serial = "&serial=ioneusjt";                            // FIM do GET colocando serial

String arduino;
const unsigned long BAUD_RATE = 9600;                 // velocidade serial de cnexão
const unsigned long HTTP_TIMEOUT = 10000;  // maximo tempo de resposta do servidor
const size_t MAX_CONTENT_SIZE = 512;       // Tamanho maximo da resposta



//tipo de dados estraido da pagina HTML (JSON)
struct UserData {
  char acao[32];
};
// ARDUINO entry point #1: runs once when you press reset or power the board


void setup() {
  //valvula
  
  pinMode(sensor1, INPUT); //Instancia o pino do sensor1 e o tipo de dados (entrada)
  pinMode(valvula, OUTPUT);      //Instancia o pino da valvula e o tipo de dados (saida)
  
  initSerial();         //instancia a comunicação serial
  initEthernet();       //instancia a placa de rede
//consumo
   pinMode(2, INPUT);
  attachInterrupt(0, incpulso, RISING); //Configura o pino 2(Interrupção 0) para trabalhar como interrupção
  Serial.println("\n\nInicio\n\n"); //Imprime Inicio na serial

  
}

// ARDUINO entry point #2: runs over and over again forever
void loop() {

   //inicia conexão  
  if (connect(server)) {
    //inicia o GET
    if (sendRequest(server, textosensor1,textosensor2) && skipResponseHeaders()) {
      char response[MAX_CONTENT_SIZE];
      readReponseContent(response, sizeof(response));
     //imprimi e atribui o GET 
      UserData userData;
      if (parseUserData(response, &userData)) {
        printUserData(&userData);
      }
    }
    //disconecta servidor
    disconnect();    
  }
  //aqui abre a valvula conforme a resposta
  while(true){
    if ( arduino == "50"){
      Serial.println("Abre Valvula em 50%");
      digitalWrite(valvula, HIGH);   // turn the Valvula on (HIGH is the voltage level)
      delay(30000);     
      Serial.println("Fecha Valvula");
      digitalWrite(valvula, LOW);
      arduino="";
     //consumo de agua
      contaPulso = 0;   //Zera a variável para contar os giros por segundos
      sei();      //Habilita interrupção
      delay (1000); //Aguarda 1 segundo
      cli();      //Desabilita interrupção
  
      vazao = contaPulso / 5.5; //Converte para L/min
      media=media+vazao; //Soma a vazão para o calculo da media
      i++;
  
      Serial.print(vazao); //Imprime na serial o valor da vazão
      Serial.print(" L/min - "); //Imprime L/min
      Serial.print(i); //Imprime a contagem i (segundos)
      Serial.println("s"); //Imprime s indicando que está em segundos
  
        if(i==60)
        {
          media = media/60; //Tira a media dividindo por 60
          Serial.print("\nMedia por minuto = "); //Imprime a frase Media por minuto =
          Serial.print(media); //Imprime o valor da media
          Serial.println(" L/min - "); //Imprime L/min
          media = 0; //Zera a variável media para uma nova contagem
          i=0; //Zera a variável i para uma nova contagem
          Serial.println("\n\nInicio\n\n"); //Imprime Inicio indicando que a contagem iniciou
        }



      
      break;
    }
    if ( arduino == "70"){
      Serial.println("Abre Valvula em 70%");
      digitalWrite(valvula, HIGH);   // turn the valvula on (HIGH is the voltage level)
      delay(45000);     
      Serial.println("Fecha Valvula");
      digitalWrite(valvula, LOW);
      arduino="";
      break;
    }
    if ( arduino == "100"){
      Serial.println("Abre Valvula em 100%");
      digitalWrite(valvula, HIGH);   // turn the valvula on (HIGH is the voltage level)
      delay(60000);     
      Serial.println("Fecha Valvula");
      digitalWrite(valvula, LOW);
      arduino="";
      break;
    }


break;

   

    
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


  Serial.print("GET ");
  Serial.println(textosensor1);
  //valorsensor1 =  analogRead(sensor1); //defini valor do sensor1
  valorsensor1 =  100; //defini valor do sensor1
  Serial.println(valorsensor1);
  Serial.println(textosensor2);
  //Serial.println(valorsensor2);
  Serial.println(textosensor3);
  //Serial.println(valorsensor3);
  Serial.println(textosensor4);
  Serial.println(textovalvula);
  Serial.println(textoconsumo);
  Serial.println(serial);
  
  client.print("GET ");
  client.print(textosensor1);
  client.print(valorsensor1);
  
  client.print(textosensor2);
  //client.print(valorsensor2);
  client.print(textosensor3);
  //client.print(valorsensor3);
  client.print(textosensor4);
  client.print(textovalvula);
  client.print(textoconsumo);
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
  arduino = (String)userData->acao;
      
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

void incpulso ()
{ 
  contaPulso++; //Incrementa a variável de contagem dos pulsos
} 

// Pause for a 1 minute
void wait() {
  Serial.println("Wait 60 seconds");
  delay(30000);
}