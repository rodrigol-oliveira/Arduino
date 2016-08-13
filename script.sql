
drop database arduino;
CREATE DATABASE Arduino;

USE Arduino;

CREATE TABLE user (
    id_user BIGINT(10) NOT NULL AUTO_INCREMENT,
    nome VARCHAR(50) NOT NULL,
    email VARCHAR(80) NOT NULL,
    senha VARCHAR(200) NOT NULL,
    CONSTRAINT PK_USER PRIMARY KEY (id_user)
);

CREATE TABLE garden (
    id_garden BIGINT(10) NOT NULL AUTO_INCREMENT,
    name_garden VARCHAR(50) NOT NULL,
    id_user BIGINT(10) NOT NULL,
    CONSTRAINT PK_GARDEN PRIMARY KEY (id_garden),
    CONSTRAINT FK_GARDEN_USER FOREIGN KEY (id_user)
        REFERENCES user (id_user)
);

CREATE TABLE plant (
    id_plant BIGINT(10) NOT NULL AUTO_INCREMENT,
    name_plant VARCHAR(20) NOT NULL,
    tipo_plant VARCHAR(20) NOT NULL,
    umidade_minima VARCHAR(50) NOT NULL,
    umidade_maxima VARCHAR(50) NOT NULL,
    CONSTRAINT PK_PLANT PRIMARY KEY (id_plant)
);

CREATE TABLE sensor (
    id_sensor BIGINT(10) NOT NULL AUTO_INCREMENT,
    name_sensor VARCHAR(20) NOT NULL,
    data_sensor VARCHAR(50) NOT NULL,
    CONSTRAINT PK_SENSOR PRIMARY KEY (id_sensor)
);

CREATE TABLE gate (
    id_gate BIGINT(10) NOT NULL AUTO_INCREMENT,
    name_gate VARCHAR(20) NOT NULL,
    data_gate VARCHAR(50) NOT NULL,
    CONSTRAINT PK_GATE PRIMARY KEY (id_gate)
);

CREATE TABLE water_flux (
    id_water_flux BIGINT(10) NOT NULL AUTO_INCREMENT,
    name_water_flux VARCHAR(20) NOT NULL,
    data_water_flux VARCHAR(50) NOT NULL,
    CONSTRAINT PK_WATER_FLUX PRIMARY KEY (id_water_flux)
);

CREATE TABLE microcontroller (
    id_microcontroller BIGINT(10) NOT NULL AUTO_INCREMENT,
    id_water_flux BIGINT(10) NOT NULL,
    id_gate BIGINT(10) NOT NULL,
    id_sensor BIGINT(10) NOT NULL,
    date_input_water_flux DATETIME,
    date_input_gate DATETIME,
    date_input_sensor DATETIME,
    CONSTRAINT PK_MICROCONTROLLER PRIMARY KEY (id_microcontroller),
    CONSTRAINT FK_MICROCONTROLLE_WATER_FLUX FOREIGN KEY (id_water_flux)
        REFERENCES water_flux (id_water_flux),
    CONSTRAINT FK_MICROCONTROLLER_GATE FOREIGN KEY (id_gate)
        REFERENCES gate (id_gate),
    CONSTRAINT FK_MICROCONTROLLER_SENSOR FOREIGN KEY (id_sensor)
        REFERENCES sensor (id_sensor)
);

CREATE TABLE temparature (
    id_data_temperature BIGINT(10) NOT NULL AUTO_INCREMENT,
    id_temperature BIGINT(10) NOT NULL,
    name_preview VARCHAR(20) NOT NULL,
    date_input_temperature DATETIME,
    CONSTRAINT PK_TEMPERATURE PRIMARY KEY (id_data_temperature)
);

CREATE TABLE perimeter (
    id_perimeter BIGINT(10) NOT NULL AUTO_INCREMENT,
    id_garden BIGINT(10) NOT NULL,
    id_plant BIGINT(10) NOT NULL,
    id_microcontroller BIGINT(10) NOT NULL,
    id_data_temperature BIGINT(10) NOT NULL,
    CONSTRAINT PK_PERIMETER PRIMARY KEY (id_perimeter),
    CONSTRAINT FK_PERIMETER_GARDEN FOREIGN KEY (id_garden)
        REFERENCES garden (id_garden),
    CONSTRAINT FK_PERIMETER_PLANT FOREIGN KEY (id_plant)
        REFERENCES plant (id_plant),
    CONSTRAINT FK_PERIMETER_MICROCONTROLLER FOREIGN KEY (id_microcontroller)
        REFERENCES microcontroller (id_microcontroller)
); 
	
