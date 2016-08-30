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
-- Table `arduino`.`agua`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`agua` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


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
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `arduino`.`jardim`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`jardim` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `id_usuario` BIGINT(10) NOT NULL,
  `nome` VARCHAR(50) NOT NULL,
  `pais` VARCHAR(50) NULL DEFAULT NULL,
  `estado` VARCHAR(50) NULL DEFAULT NULL,
  `cidade` VARCHAR(50) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_JARDIM` (`id_usuario` ASC),
  CONSTRAINT `FK_JARDIM`
    FOREIGN KEY (`id_usuario`)
    REFERENCES `arduino`.`usuario` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 3
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `arduino`.`valvula`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`valvula` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `arduino`.`controle`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`controle` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `id_jardim` BIGINT(10) NOT NULL,
  `id_agua` BIGINT(10) NOT NULL,
  `id_valvula` BIGINT(10) NOT NULL,
  `datahora` DATETIME NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `FK_CONTROLE_JARDIM` (`id_jardim` ASC),
  INDEX `FK_CONTROLE_AGUA` (`id_agua` ASC),
  INDEX `FK_CONTROLE_VALVULA` (`id_valvula` ASC),
  CONSTRAINT `FK_CONTROLE_AGUA`
    FOREIGN KEY (`id_agua`)
    REFERENCES `arduino`.`agua` (`id`),
  CONSTRAINT `FK_CONTROLE_JARDIM`
    FOREIGN KEY (`id_jardim`)
    REFERENCES `arduino`.`jardim` (`id`),
  CONSTRAINT `FK_CONTROLE_VALVULA`
    FOREIGN KEY (`id_valvula`)
    REFERENCES `arduino`.`valvula` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `arduino`.`sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`sensor` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `descricao` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `arduino`.`controle_sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`controle_sensor` (
  `id_controle` BIGINT(10) NOT NULL,
  `id_sensor` BIGINT(10) NOT NULL,
  `valor` BIGINT(10) NOT NULL,
  PRIMARY KEY (`id_controle`, `id_sensor`),
  INDEX `FK_CONTROLESENSOR_SENSOR` (`id_sensor` ASC),
  CONSTRAINT `FK_CONTROLESENSOR_CONTROLE`
    FOREIGN KEY (`id_controle`)
    REFERENCES `arduino`.`controle` (`id`),
  CONSTRAINT `FK_CONTROLESENSOR_SENSOR`
    FOREIGN KEY (`id_sensor`)
    REFERENCES `arduino`.`sensor` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `arduino`.`grupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`grupo` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;

INSERT INTO grupo(nome) value('A');
INSERT INTO grupo(nome) value('B');


-- -----------------------------------------------------
-- Table `arduino`.`planta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`planta` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(20) NOT NULL,
  `umidade_min` BIGINT(50) NOT NULL,
  `umidade_max` BIGINT(50) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 2
DEFAULT CHARACTER SET = utf8;

INSERT INTO planta(nome, umidade_min, umidade_max) VALUES('rosa', 300, 700);
INSERT INTO planta(nome, umidade_min, umidade_max) VALUES('tulipa', 500, 900);



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

INSERT INTO grupo_planta(id_grupo, id_planta) VALUES(2,2);
INSERT INTO grupo_planta(id_grupo, id_planta) VALUES(3,3);

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

SELECT * 
						from jardim j  
						inner join usuario u on u.id = j.id_usuario 
						inner join jardim_planta jp on jp.id_jardim = j.id 
						inner join planta p on p.id = jp.id_planta 
						inner join grupo_planta gp on gp.id_planta = p.id 
						inner join grupo g on g.id = gp.id_grupo
						where u.id = 2;



select * from grupo_planta;