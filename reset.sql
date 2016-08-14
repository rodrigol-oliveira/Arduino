DROP DATABASE arduino;

CREATE DATABASE arduino;

USE arduino;

CREATE TABLE usuario (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	nome varchar (50) NOT NULL,
	email varchar (80) NOT NULL,
	senha varchar (255)NOT NULL,  #Falta tratar a criptografia MD5
	constraint PK_USER PRIMARY KEY (id)
); 

CREATE TABLE jardim (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	nome varchar (50) NOT NULL,
	localizacao varchar(50)NOT NULL,
	constraint PK_GARDEN PRIMARY KEY(id)
); 

CREATE TABLE planta(
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	nome varchar(20) NOT NULL,
	umidade_minima BIGINT(50) NOT NULL,	# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)
	umidade_maxima BIGINT(50) NOT NULL,	# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)
	constraint PK_PLANT PRIMARY KEY(id)
); 

/*CREATE TABLE plantas(
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	id_ṕlanta BIGINT(10) NOT NULL,
	constraint PK_PLANT PRIMARY KEY(id)
); */

CREATE TABLE sensor (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	umidade BIGINT(50) NOT NULL,			#Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)	
	data_hora datetime,
	constraint PK_SENSOR PRIMARY KEY(id)
); 

CREATE TABLE sensores (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	id_sensor BIGINT(10) NOT NULL ,
	constraint PK_SENSOR PRIMARY KEY(id)
); 

CREATE TABLE valvula (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	status boolean NOT NULL,			# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)	
	data_hora datetime,
	constraint PK_GATE PRIMARY KEY(id)
); 

CREATE TABLE agua (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	valor BIGINT(50) NOT NULL,			# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)
	data_hora datetime,
	constraint PK_WATER_FLUX PRIMARY KEY(id)
); 

CREATE TABLE controle (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	id_agua BIGINT(10) NOT NULL,
	id_valvula BIGINT(10) NOT NULL,
	id_sensores BIGINT(10) NOT NULL,
	constraint PK_MICROCONTROLLER PRIMARY KEY(id),
	constraint FK_MICROCONTROLLE_agua FOREIGN KEY (id_agua) references agua(id),
	constraint FK_MICROCONTROLLER_valvula FOREIGN KEY (id_valvula) references valvula(id),
	constraint FK_MICROCONTROLLER_sensores FOREIGN KEY (id_sensores) references sensores(id)

); 

/*CREATE TABLE temparature (
	id_data_temperature BIGINT(10) NOT NULL AUTO_INCREMENT,
	id_temperature BIGINT(10) NOT NULL,
	name_preview varchar(20) NOT NULL,
	date_input_temperature datetime,    #descobri o layout de entrada (dia, mes, ano ou mes, dia, ano  essas coisas)
	constraint PK_TEMPERATURE PRIMARY KEY(id_data_temperature)#há confirmar
);*/ 

CREATE TABLE perimetro(
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	id_jardim BIGINT(10) NOT NULL, #Foreign key de Jardim
	id_planta BIGINT(10)NOT NULL ,	#Foreign key de Plant
	id_controle BIGINT(10) NOT NULL, #Foreign key de Microcontrolador
	id_usuario BIGINT(10) NOT NULL,
	#id_data_temperature BIGINT(10) NOT NULL, 	#Foreign key temperatura
	constraint PK_perimetro PRIMARY KEY(id),
	constraint FK_PERIMETER_GARDEN FOREIGN KEY (id_jardim) references jardim(id),
	constraint FK_PERIMETER_PLANT FOREIGN KEY (id_planta) references planta(id),
	constraint FK_PERIMETER_MICROCONTROLLER FOREIGN KEY (id_controle) references controle(id)
#	constraint FK_PERIMETER_TEMPERATUREE	 FOREIGN KEY (id_data_temperature) references temperature(id_data_temperature)
); 
	
