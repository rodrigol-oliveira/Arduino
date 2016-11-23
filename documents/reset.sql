DROP DATABASE arduino;

CREATE DATABASE arduino;

USE arduino;

CREATE TABLE usuario (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	nome varchar (50) NOT NULL,
	email varchar (80) NOT NULL,
	senha varchar (255)NOT NULL,  #Falta tratar a criptografia MD5
	constraint PK_USUARIO PRIMARY KEY (id)
); 

CREATE TABLE jardim (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
    id_usuario BIGINT(10) NOT NULL,
	nome varchar (50) NOT NULL,
	localizacao varchar(50),
	constraint PK_JARDIM PRIMARY KEY(id),
    constraint FK_JARDIM foreign key (
    id_usuario) REFERENCES usuario(id) 
); 

CREATE TABLE planta(
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	nome varchar(20) NOT NULL,
    umidade_min BIGINT(50) NOT NULL,	# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)
	umidade_max BIGINT(50) NOT NULL,	# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)
	constraint PK_PLANTA PRIMARY KEY(id)
); 

CREATE TABLE jardim_planta(
	id_jardim BIGINT(10) NOT NULL,
	id_planta BIGINT(10) NOT NULL,
	constraint PK_JARDIMPLANTA PRIMARY KEY(id_jardim, id_planta),
    constraint FK_JARDIMPLANTA_JARDIM FOREIGN KEY (id_jardim) REFERENCES jardim(id),
    constraint FK_JARDIMPLANTA_PLANTA FOREIGN KEY (id_planta) REFERENCES planta(id)
);

CREATE TABLE grupo(
	id BIGINT(10) NOT NULL auto_increment,
	nome varchar(45) NOT NULL,
	constraint PK_GRUPO PRIMARY KEY(id)
);

CREATE TABLE grupo_planta(
	id_grupo BIGINT(10) NOT NULL,
	id_planta BIGINT(10) NOT NULL,
	constraint PK_GRUPO PRIMARY KEY(id_grupo, id_planta),
    constraint FK_GRUPOPLANTA_GRUPO FOREIGN KEY (id_jardim) REFERENCES jardim(id),
    constraint FK_GRUPOPLANTA_PLANTA FOREIGN KEY (id_planta) REFERENCES planta(id)
);

CREATE TABLE sensor (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	descricao varchar(50) not null,			#Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)	
	constraint PK_SENSOR PRIMARY KEY(id)
); 


CREATE TABLE valvula (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	descricao varchar(50) NOT NULL,
	constraint PK_VALVULA PRIMARY KEY(id)
); 

CREATE TABLE agua (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	descricao VARCHAR(50) NOT NULL,			# Descobrir o tipo de dados e tratar variavel (HexaDecimal, inteiro, double)
	constraint PK_AGUA PRIMARY KEY(id)
); 

CREATE TABLE controle (
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
    id_jardim BIGINT(10) NOT NULL,
	id_agua BIGINT(10) NOT NULL,
	id_valvula BIGINT(10) NOT NULL,
    datahora datetime not null,
	constraint PK_CONTROLE PRIMARY KEY(id),
	constraint FK_CONTROLE_JARDIM FOREIGN KEY (id_jardim) references jardim(id),
	constraint FK_CONTROLE_AGUA FOREIGN KEY (id_agua) references agua(id),
    constraint FK_CONTROLE_VALVULA FOREIGN KEY (id_valvula) references valvula(id)
); 

CREATE TABLE controle_sensor(
	id_controle BIGINT(10) NOT NULL,
	id_sensor BIGINT(10) NOT NULL ,
    valor BIGINT(10) NOT NULL ,
	constraint PK_CONTROLESENSOR PRIMARY KEY(id_controle, id_sensor),
    constraint FK_CONTROLESENSOR_CONTROLE FOREIGN KEY (id_controle) REFERENCES controle(id),
    constraint FK_CONTROLESENSOR_SENSOR FOREIGN KEY (id_sensor) REFERENCES sensor(id)
); 



/*
CREATE TABLE perimetro(
	id BIGINT(10) NOT NULL AUTO_INCREMENT,
	id_jardim BIGINT(10) NOT NULL, #Foreign key de Jardim
	id_planta BIGINT(10)NOT NULL ,	#Foreign key de Plant
	id_controle BIGINT(10) NOT NULL, #Foreign key de Microcontrolador
	id_usuario BIGINT(10) NOT NULL,
	constraint PK_perimetro PRIMARY KEY(id),
	constraint FK_PERIMETER_GARDEN FOREIGN KEY (id_jardim) references jardim(id),
	constraint FK_PERIMETER_PLANT FOREIGN KEY (id_planta) references planta(id),
	constraint FK_PERIMETER_MICROCONTROLLER FOREIGN KEY (id_controle) references controle(id)
); 
	


/*CREATE TABLE temparature (
	id_data_temperature BIGINT(10) NOT NULL AUTO_INCREMENT,
	id_temperature BIGINT(10) NOT NULL,
	name_preview varchar(20) NOT NULL,
	date_input_temperature datetime,    #descobri o layout de entrada (dia, mes, ano ou mes, dia, ano  essas coisas)
	constraint PK_TEMPERATURE PRIMARY KEY(id_data_temperature)#há confirmar
);*/ 


