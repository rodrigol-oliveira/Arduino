DROP DATABASE arduino;

CREATE DATABASE arduino;

USE arduino;

CREATE TABLE registros (
	id BIGINT(20) NOT NULL AUTO_INCREMENT,
	temperatura FLOAT(7,2) DEFAULT NULL,
	PRIMARY KEY(id)
); 

INSERT INTO registros VALUES(NULL, 12);
INSERT INTO registros VALUES(NULL, 13);
INSERT INTO registros VALUES(NULL, 14);

DESC registros;

SELECT * FROM registros;

--test