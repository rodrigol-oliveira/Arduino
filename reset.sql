DROP DATABASE Arduino;

CREATE DATABASE Arduino;

USE Arduino;

CREATE TABLE user (
	id_user BIGINT(10) NOT NULL AUTO_INCREMENT,
	name varchar (50) NOT NULL,
	#email varchar (80) NOT NULL,
	#password varchar (20) NOT NULL,  #Falta tratar a criptografia MD5
	#city_id BIGINT (20) NOT NULL,#conversar sobre tabela contry "PAIS"
	#date_of_birth datetime,
	constraint PK_USER PRIMARY KEY (id_user)
); 

#Criar tabela de estado
#criar tabela de cidade
#criar tabela de pais

CREATE TABLE garden (
	id_garden BIGINT(10) NOT NULL AUTO_INCREMENT,
	name_garden varchar (50) NOT NULL,
	id_user BIGINT(10) NOT NULL,	#Foreign key de user (ligação com a tabela usuario)
	constraint PK_GARDEN PRIMARY KEY(id_garden),
	constraint FK_GARDEN_USER FOREIGN KEY (id_user) references user(id_user)
); 

CREATE TABLE plant (
	id_plant BIGINT(10) NOT NULL AUTO_INCREMENT,
	name_plant varchar(20) NOT NULL,
	tipo_plant varchar(20) NOT NULL,#Tipo de planta (Flores, grama, arvores)
	umidade_minima varchar(50) NOT NULL,	# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)
	umidade_maxima varchar(50) NOT NULL,	# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)
	constraint PK_PLANT PRIMARY KEY(id_plant)
); 

CREATE TABLE sensor (
	id_sensor BIGINT(10) NOT NULL AUTO_INCREMENT,
	name_sensor varchar(20) NOT NULL, #Nome sensor para o usurio (sensor central, sensor do canto norte)
	data_sensor varchar(50) NOT NULL,			#Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)	
	constraint PK_SENSOR PRIMARY KEY(id_sensor)
); 

CREATE TABLE gate (
	id_gate BIGINT(10) NOT NULL AUTO_INCREMENT,
	name_gate varchar(20) NOT NULL, #Nome svalvula para o usurio (valvula central, valvula do canto Sul)
	data_gate varchar(50) NOT NULL,			# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)	
	constraint PK_GATE PRIMARY KEY(id_gate)
); 

CREATE TABLE water_flux (
	id_water_flux BIGINT(10) NOT NULL AUTO_INCREMENT,
	name_water_flux varchar(20) NOT NULL, #Nome do fluxo de agua para o usurio (fluxo de agua central, fluxo de agua da cisterna)
	data_water_flux varchar(50) NOT NULL,			# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)
	constraint PK_WATER_FLUX PRIMARY KEY(id_water_flux)
); 

CREATE TABLE microcontroller (
	id_microcontroller BIGINT(10) NOT NULL AUTO_INCREMENT,
	id_water_flux BIGINT(10) NOT NULL,
	id_gate BIGINT(10) NOT NULL,
	id_sensor BIGINT(10) NOT NULL,
	date_input_water_flux datetime,    #descobri o layout de entrada (dia, mes, ano ou mes, dia, ano  essas coisas)
	date_input_gate datetime,    #descobri o layout de entrada (dia, mes, ano ou mes, dia, ano  essas coisas)
	date_input_sensor datetime,    #descobri o layout de entrada (dia, mes, ano ou mes, dia, ano  essas coisas)
	constraint PK_MICROCONTROLLER PRIMARY KEY(id_microcontroller),
	constraint FK_MICROCONTROLLE_WATER_FLUX FOREIGN KEY (id_water_flux) references water_flux(id_water_flux),
	constraint FK_MICROCONTROLLER_GATE FOREIGN KEY (id_gate) references gate(id_gate),
	constraint FK_MICROCONTROLLER_SENSOR FOREIGN KEY (id_sensor) references sensor(id_sensor)

); 

CREATE TABLE temparature (
	id_data_temperature BIGINT(10) NOT NULL AUTO_INCREMENT,
	id_temperature BIGINT(10) NOT NULL,
	name_preview varchar(20) NOT NULL,
	date_input_temperature datetime,    #descobri o layout de entrada (dia, mes, ano ou mes, dia, ano  essas coisas)
	constraint PK_TEMPERATURE PRIMARY KEY(id_data_temperature)#há confirmar
); 

CREATE TABLE perimeter (
	id_perimeter BIGINT(10) NOT NULL AUTO_INCREMENT,
	id_garden BIGINT(10) NOT NULL, #Foreign key de Jardim
	id_plant BIGINT(10)NOT NULL ,	#Foreign key de Plant
	id_microcontroller BIGINT(10) NOT NULL, #Foreign key de Microcontrolador
	id_data_temperature BIGINT(10) NOT NULL, 	#Foreign key temperatura
	constraint PK_PERIMETER PRIMARY KEY(id_perimeter),
	constraint FK_PERIMETER_GARDEN FOREIGN KEY (id_garden) references garden(id_garden),
	constraint FK_PERIMETER_PLANT FOREIGN KEY (id_plant) references plant(id_plant),
	constraint FK_PERIMETER_MICROCONTROLLER FOREIGN KEY (id_microcontroller) references microcontroller(id_microcontroller)
#	constraint FK_PERIMETER_TEMPERATUREE	 FOREIGN KEY (id_data_temperature) references temperature(id_data_temperature)
); 
	
