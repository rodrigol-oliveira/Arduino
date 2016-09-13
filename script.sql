-- MySQL Workbench Forward Engineering

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema arduino
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema arduino
-- -----------------------------------------------------
DROP schema arduino;
CREATE SCHEMA IF NOT EXISTS `arduino` DEFAULT CHARACTER SET utf8 ;
USE `arduino` ;


-- -----------------------------------------------------
-- Table `arduino`.`usuario`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`usuario` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(50) NOT NULL,
  `email` VARCHAR(80) NOT NULL,
  `senha` VARCHAR(255) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

-- -----------------------------------------------------
-- Table `arduino`.`agua`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`agua` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `descricao_agua` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

insert into agua(descricao_agua) value('AGUA001');

-- update agua set descricao_agua = 'AGUA001' where id =1;

-- -----------------------------------------------------
-- Table `arduino`.`valvula`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`valvula` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `descricao_valvula` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

insert into valvula(descricao_valvula) value('VALV001');

-- -----------------------------------------------------
-- Table `arduino`.`sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`sensor` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `nome_sensor` VARCHAR(50) NOT NULL,
  `especificacao_sensor` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

INSERT into sensor(nome_sensor, especificacao_sensor) VALUES ('S01A', 'Adamantium');
INSERT into sensor(nome_sensor, especificacao_sensor) VALUES ('S02A', 'Chumbo');
INSERT into sensor(nome_sensor, especificacao_sensor) VALUES ('S03A', 'ouro');
INSERT into sensor(nome_sensor, especificacao_sensor) VALUES ('S04A', 'ferro');

select * from sensor;

-- -----------------------------------------------------
-- Table `arduino`.`controle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`controle` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `id_agua` BIGINT(10) NOT NULL,
  `id_valvula` BIGINT(10) NOT NULL,
  PRIMARY KEY (`id`),
  -- INDEX `FK_CONTROLE_JARDIM` (`id_jardim` ASC),
  -- INDEX `FK_CONTROLE_AGUA` (`id_agua` ASC),
  -- INDEX `FK_CONTROLE_VALVULA` (`id_valvula` ASC),
  CONSTRAINT `FK_CONTROLE_AGUA`
    FOREIGN KEY (`id_agua`)
    REFERENCES `arduino`.`agua` (`id`),
   CONSTRAINT `FK_CONTROLE_VALVULA`
    FOREIGN KEY (`id_valvula`)
    REFERENCES `arduino`.`valvula` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;



-- -----------------------------------------------------
-- Table `arduino`.`controle_sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`controle_sensor` (
  `id` BIGINT(10) NOT NULL auto_increment,
  `id_controle` BIGINT(10) NOT NULL,
  `id_sensor` BIGINT(10) NOT NULL,
  PRIMARY KEY (`id`),
  -- INDEX `FK_CONTROLESENSOR_SENSOR` (`id_sensor` ASC),
  CONSTRAINT `FK_CONTROLESENSOR_CONTROLE`
    FOREIGN KEY (`id_controle`)
    REFERENCES `arduino`.`controle` (`id`),
  CONSTRAINT `FK_CONTROLESENSOR_SENSOR`
    FOREIGN KEY (`id_sensor`)
    REFERENCES `arduino`.`sensor` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;



-- -----------------------------------------------------
-- Table `arduino`.`jardim`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`jardim` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `id_usuario` BIGINT(10) NOT NULL,
  `id_controle` BIGINT(10) NOT NULL,
  `nome_jardim` VARCHAR(50) NOT NULL,
  `pais` VARCHAR(50) NULL DEFAULT NULL,
  `estado` VARCHAR(50) NULL DEFAULT NULL,
  `cidade` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  -- INDEX `FK_JARDIM` (`id_usuario` ASC),
  CONSTRAINT `FK_JARDIM` FOREIGN KEY (`id_usuario`)REFERENCES `arduino`.`usuario` (`id`),
  CONSTRAINT `FK_CONTROLE` FOREIGN KEY (`id_controle`)REFERENCES `arduino`.`controle` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `arduino`.`grupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`grupo` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `nome_grupo` VARCHAR(45) NOT NULL,
  `umidade_min` BIGINT(10),
  `umidade_max` BIGINT(10),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

INSERT INTO grupo(nome_grupo, umidade_min, umidade_max) value('A', 400, 800);
INSERT INTO grupo(nome_grupo, umidade_min, umidade_max) value('B', 300, 700);


-- -----------------------------------------------------
-- Table `arduino`.`planta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`planta` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `nome_planta` VARCHAR(20) NOT NULL,
  `umidade_min` BIGINT(10) NOT NULL,
  `umidade_max` BIGINT(10) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

INSERT INTO planta(nome_planta, umidade_min, umidade_max) VALUES('rosa', 300, 700);
INSERT INTO planta(nome_planta, umidade_min, umidade_max) VALUES('tulipa', 500, 900);



-- -----------------------------------------------------
-- Table `arduino`.`grupo_planta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`grupo_planta` (
  `id_grupo` BIGINT(10) NOT NULL,
  `id_planta` BIGINT(10) NOT NULL,
  PRIMARY KEY (`id_grupo`, `id_planta`),
  INDEX `FK_GRUPOPLANTA_PLANTA` (`id_planta` ASC),
  CONSTRAINT `FK_GRUPOPLANTA_GRUPO`
    FOREIGN KEY (`id_grupo`)
    REFERENCES `arduino`.`grupo` (`id`),
  CONSTRAINT `FK_GRUPOPLANTA_PLANTA`
    FOREIGN KEY (`id_planta`)
    REFERENCES `arduino`.`planta` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

INSERT INTO grupo_planta(id_grupo, id_planta) VALUES(1,1);
INSERT INTO grupo_planta(id_grupo, id_planta) VALUES(2,2);

-- -----------------------------------------------------
-- Table `arduino`.`jardim_planta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`jardim_planta` (
  `id_jardim` BIGINT(10) NOT NULL,
  `id_planta` BIGINT(10) NOT NULL,
  PRIMARY KEY (`id_jardim`, `id_planta`),
  INDEX `FK_JARDIMPLANTA_PLANTA` (`id_planta` ASC),
  CONSTRAINT `FK_JARDIMPLANTA_JARDIM`
    FOREIGN KEY (`id_jardim`)
    REFERENCES `arduino`.`jardim` (`id`),
  CONSTRAINT `FK_JARDIMPLANTA_PLANTA`
    FOREIGN KEY (`id_planta`)
    REFERENCES `arduino`.`planta` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

drop table analize;
-- -----------------------------------------------------
-- Table `arduino`.`analize`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`analize` (
  `id` BIGINT(10) NOT NULL auto_increment,
  `id_jardim` BIGINT(10) NOT NULL,
  `data_hora` DATETIME NOT NULL,
  `valor_S01` BIGINT(10),
  `valor_S02` BIGINT(10),
  `valor_S03` BIGINT(10),
  `valor_S04` BIGINT(10),
  `status_umidade` VARCHAR(40),
  `clima` VARCHAR(40),
  `probabilidade_chuva` BIGINT(10),  
  `valvula` varchar(10),
  `consumo` BIGINT(10),
  PRIMARY KEY (`id`),
  -- INDEX `FK_GRUPOPLANTA_PLANTA` (`id_planta` ASC),
  CONSTRAINT `FK_ANALIZE` FOREIGN KEY (`id_jardim`) REFERENCES `arduino`.`jardim` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

insert into analize(id_jardim, data_hora, valor_S01, valor_S02, 
status_umidade, clima, probabilidade_chuva,valvula, consumo) 
values(1,now(), 300, 400, 'seco', 'ensolarado', 20, 'on', 30),
	 (1,now(), 600, 650, 'umido', 'ensolarado', 20, 'off', 0),
     (1,now(), 550, 600, 'umido', 'ensolarado', 20, 'off', 0);



-- --------------------------------------------------------------


SELECT  j.nome_jardim, p.nome_planta, g.nome_grupo, j.estado, j.cidade from jardim j  
						inner join usuario u on u.id = j.id_usuario 
						inner join jardim_planta jp on jp.id_jardim = j.id 
						inner join planta p on p.id = jp.id_planta 
						inner join grupo_planta gp on gp.id_planta = p.id 
						inner join grupo g on g.id = gp.id_grupo
						where u.id = 1;

select * from usuario;
select * from jardim;
select * from jardim_planta;
select * from grupo_planta;
select * from planta;
select * from grupo;
select * from controle;
select * from sensor;
select * from controle_sensor;
select * from agua;
select * from valvula;

select * from analize;


delete from jardim_planta where id_jardim= 5;
delete from jardim where id_usuario = 1;

SELECT id FROM jardim WHERE id_usuario = 4;
INSERT INTO jardim_planta(id_jardim, id_planta) VALUES (1, 1);

UPDATE jardim_planta SET id_planta = 2 WHERE id_jardim= 1;