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
  `sobrenome` VARCHAR(50) NOT NULL,
  `genero` VARCHAR(10) NOT NULL,
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



-- -----------------------------------------------------
-- Table `arduino`.`jardim`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`jardim` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `id_usuario` BIGINT(10) NOT NULL,
  `id_valvula` BIGINT(10) NOT NULL,
  `id_agua` BIGINT(10) NOT NULL,
  `serial`VARCHAR(10) NOT NULL,
  `nome_jardim` VARCHAR(50) NOT NULL,
  `estado` VARCHAR(50),
  `cidade` VARCHAR(50),
  PRIMARY KEY (`id`),
  CONSTRAINT `FK_USUARIO` FOREIGN KEY (`id_usuario`)REFERENCES `arduino`.`usuario` (`id`),
  CONSTRAINT `FK_VALVULA` FOREIGN KEY (`id_valvula`)REFERENCES `arduino`.`valvula` (`id`),
  CONSTRAINT `FK_AGUA` FOREIGN KEY (`id_agua`)REFERENCES `arduino`.`agua` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `arduino`.`jardim_sensor`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`jardim_sensor` (
  `id_jardim` BIGINT(10) NOT NULL,
  `id_sensor` BIGINT(10) NOT NULL,
   PRIMARY KEY (`id_jardim`, `id_sensor`),
    -- INDEX `FK_CONTROLESENSOR_SENSOR` (`id_sensor` ASC),
    CONSTRAINT `FK_JARDIMSENSOR_JARDIM`
	FOREIGN KEY (`id_jardim`)
     REFERENCES `arduino`.`jardim` (`id`),
  CONSTRAINT `FK_JARDIMSENSOR_SENSOR`
    FOREIGN KEY (`id_sensor`)
    REFERENCES `arduino`.`sensor` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `arduino`.`grupo`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`grupo` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `nome_grupo` VARCHAR(45) NOT NULL,
  `descricao_grupo` VARCHAR(300) NOT NULL,
  `umidade_min` BIGINT(10),
  `umidade_max` BIGINT(10),
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;



-- -----------------------------------------------------
-- Table `arduino`.`planta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`planta` (
  `id` BIGINT(10) NOT NULL AUTO_INCREMENT,
  `nome_planta` VARCHAR(50) NOT NULL,
  `nome_cientifico` VARCHAR(50),
  `temperatura` BIGINT(10),
  `informacao` VARCHAR(500),
  `umidade_min` BIGINT(10) NOT NULL,
  `umidade_max` BIGINT(10) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;





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




-- -----------------------------------------------------
-- Table `arduino`.`jardim_planta`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`jardim_planta` (
  `id_jardim` BIGINT(10) NOT NULL,
  `id_planta` BIGINT(10) NOT NULL,
  
  CONSTRAINT `FK_JARDIMPLANTA_JARDIM`
    FOREIGN KEY (`id_jardim`)
    REFERENCES `arduino`.`jardim` (`id`),
  CONSTRAINT `FK_JARDIMPLANTA_PLANTA`
    FOREIGN KEY (`id_planta`)
    REFERENCES `arduino`.`planta` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


-- -----------------------------------------------------
-- Table `arduino`.`analise`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `arduino`.`analise` (
  `id` BIGINT(10) NOT NULL auto_increment,
  `id_jardim` BIGINT(10) NOT NULL,
  `data_hora` DATETIME NOT NULL,
  `valor_S01` BIGINT(10),
  `valor_S02` BIGINT(10),
  `valor_S03` BIGINT(10),
  `valor_S04` BIGINT(10),
  `media`	  BIGINT(10),
  `status_umidade` VARCHAR(40),
  `clima` VARCHAR(40),
  `probabilidade_chuva` BIGINT(10),  
  `valvula` varchar(10),
  `consumo` BIGINT(10),
  PRIMARY KEY (`id`),
  -- INDEX `FK_GRUPOPLANTA_PLANTA` (`id_planta` ASC),
  CONSTRAINT `FK_analise` FOREIGN KEY (`id_jardim`) REFERENCES `arduino`.`jardim` (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

insert into agua(descricao_agua) value('AGUA001');

insert into valvula(descricao_valvula) value('VALV001');

INSERT into sensor(nome_sensor, especificacao_sensor) VALUES ('S01A', 'Adamantium');
INSERT into sensor(nome_sensor, especificacao_sensor) VALUES ('S02A', 'Chumbo');
INSERT into sensor(nome_sensor, especificacao_sensor) VALUES ('S03A', 'ouro');
INSERT into sensor(nome_sensor, especificacao_sensor) VALUES ('S04A', 'ferro');

INSERT INTO grupo(nome_grupo, descricao_grupo, umidade_min, umidade_max)
values('A', 'grupo comum', 400, 800), ('B', 'grupo raro', 400, 800);

INSERT INTO planta(nome_planta, nome_cientifico, temperatura, informacao, umidade_min, umidade_max) 
VALUES('rosa', 'rose',23,'espécie comum cultivadda em varias regiões do mundo',300, 700),
('tulipa', 'tulipe',20,'espécie comum cultivadda em varias regiões do mundo',300, 700),
('orquidea', 'orquidea',25,'espécie especial cultivadda em algumas regiões do mundo',400, 800);


INSERT INTO grupo_planta(id_grupo, id_planta) VALUES(1,1), (1,2), (2,3);

-- --------------------------------------------------------------------------------
-- limite de codigo do banco valido
-- -----------------------------------------------------------------------------------

/*
insert into analise(id_jardim, data_hora, valor_S01, valor_S02,media,
status_umidade, clima, probabilidade_chuva,valvula, consumo) 
values(1,now(), 450, 400,300, 'seco', 'ensolarado', 20, 'on', 30);

INSERT INTO jardim_planta(id_jardim, id_planta) VALUES(1,1);


insert into analise(id_jardim, data_hora, valor_S01, valor_S02, 
status_umidade, clima, probabilidade_chuva,valvula, consumo) 
values(2,now(), 450, 400, 'seco', 'ensolarado', 20, 'on', 30),
(2,now(), 600, 650, 'umido', 'ensolarado', 20, 'off', 0),
(2,now(), 700, 650, 'umido', 'ensolarado', 20, 'off', 0),
(2,now(), 550, 620, 'umido', 'ensolarado', 20, 'off', 20),
(2,now(), 540, 680, 'umido', 'ensolarado', 20, 'off', 0);



-- --------------------------------------------------------------
use arduino;

SELECT  j.nome_jardim, p.nome_planta, g.nome_grupo, j.estado, j.cidade from jardim j  
						inner join usuario u on u.id = j.id_usuario 
						inner join jardim_planta jp on jp.id_jardim = j.id 
						inner join planta p on p.id = jp.id_planta 
						inner join grupo_planta gp on gp.id_planta = p.id 
						inner join grupo g on g.id = gp.id_grupo
						where u.id = 1;
                        
select * from analise where id_jardim = 1;

select a.data_hora, a.status_umidade from usuario u
inner join jardim j on j.id_usuario = u.id
inner join analise a on a.id_jardim = j.id
where u.id = 1; 
                        


select * from usuario;
select * from jardim;
select * from jardim_planta;
select * from grupo_planta;
select * from planta;
select * from grupo;
select * from controle;
select * from sensor;
select * from jardim_sensor;
select * from analise;
select * from agua;
select * from valvula;
select * from analise order by id desc limit 4;


select * from analise where id_jardim = 1;
select last_insert_id() into analise;

delete from jardim_planta where id_jardim = 2;
delete from analise where id_jardim= 2;
delete from jardim where id_usuario = 1;
delete from jardim_sensor where id_jardim = 1;

SELECT id FROM jardim WHERE id_usuario = 4;
INSERT INTO jardim_planta(id_jardim, id_planta) VALUES (1, 1);

UPDATE jardim SET id_valvula = 1 WHERE id = 1;

select * from jardim where id_usuario = 3;

-- ---------------------------------
-- removidos
-- ----------------------------------

SELECT p.nome_planta, p.descricao_planta from planta p 
inner join jardim_planta jp on jp.id_planta = p.id
inner join jardim j on j.id = jp.id_jardim 
where j.id = 1;


select id from jardim where id_usuario = 1;



SELECT j.nome_jardim, j.estado, j.cidade, g.nome_grupo 
						from jardim j 
						inner join usuario u on u.id = j.id_usuario
						inner join jardim_planta jp on jp.id_jardim = j.id
						inner join planta p on p.id = jp.id_planta
						inner join grupo_planta gp on gp.id_planta = p.id
						inner join grupo g on g.id = gp.id_grupo 
						where u.id = 1;
                        
SELECT id_jardim, DATE_FORMAT(data_hora, "%d/%l/%Y %H:%m:%s"), valor_S01, valor_S02,
status_umidade, clima, probabilidade_chuva,valvula, consumo from analise;


SELECT DATE_FORMAT(data_hora, "%d/%l/%Y %H:%m:%s") as "data_hora", 
		valor_S01, valor_S02,valor_S03, valor_S04, status_umidade, clima, 
        probabilidade_chuva, valvula, consumo 
		from jardim j 
		inner join usuario u on u.id = j.id_usuario 
		inner join jardim_planta jp on jp.id_jardim = j.id 
		inner join analise a on a.id_jardim = j.id 
		where u.id = 1;
        

SELECT id_jardim, DATE_FORMAT(data_hora, "%d/%l/%Y %H:%m:%s") as "data_hora",
DATE_FORMAT(data_hora, "%H:%m:%s") as "hora",
valor_S01, valor_S02, status_umidade, clima, probabilidade_chuva,valvula,
consumo from analise where id_jardim = 2;



SELECT j.nome_jardim, j.estado, j.cidade, g.nome_grupo, v.id, v.descricao_valvula, a.id, a.descricao_agua 
from jardim j
inner join usuario u on u.id = j.id_usuario
inner join jardim_planta jp on jp.id_jardim = j.id
inner join planta p on p.id = jp.id_planta
inner join grupo_planta gp on gp.id_planta = p.id
inner join grupo g on g.id = gp.id_grupo
inner join valvula v on v.id = j.id_valvula
inner join agua a on a.id = j.id_agua
where u.id = 1;

select j.nome_jardim, j.estado, j.cidade, g.nome_grupo, v.id, v.descricao_valvula, a.id, a.descricao_agua
from jardim j
inner join usuario u on u.id = j.id_usuario

inner join jardim_planta jp on jp.id_jardim = j.id
inner join planta p on p.id = jp.id_planta

inner join grupo_planta gp on gp.id_planta = p.id
inner join grupo g on g.id = gp.id_grupo

inner join valvula v on v.id = j.id_valvula
inner join agua a on a.id = j.id_agua
where j.id = 1;
                        
-- ------------------------

select g.id, g.nome_grupo, g.umidade_min, g.umidade_max from jardim j
join jardim_planta jp on jp.id_jardim = j.id 
join planta p on p.id = jp.id_planta 
join grupo_planta gp on gp.id_planta = p.id 
join grupo g on g.id = gp.id_grupo 
where id_jardim=1;

insert into analise(id_jardim, data_hora, valor_S01, valor_S02, media, status_umidade, valvula, consumo)
values(4, '2016-10-07 00:00:00', 500, 500, 500, 'umido', 'off',0 );

select * from analise order by data_hora;
select * from analise where id_jardim = 4 and data_hora between '2016-10-04' and '2016-10-06' ;

select avg(valor_S01) from analise;




select DATE_FORMAT(data_hora, "%d/%m/%Y %H:%i:%s") as "data_hora", a.media, a.status_umidade, a.clima, g.umidade_min
			from usuario u 
			inner join jardim j on j.id_usuario = u.id 
			inner join jardim_planta jp on jp.id_jardim = j.id 
			inner join planta p on p.id = jp.id_planta 
			inner join grupo_planta gp on gp.id_planta = p.id
            inner join grupo g on g.id = gp.id_grupo 
			inner join analise a on a.id_jardim = j.id 
			where u.id = 1;


SELECT p.id, p.nome_planta from planta p
										inner join jardim_planta jp on jp.id_planta = p.id
										inner join jardim j on j.id = jp.id_jardim 
										where j.id = 1;

insert into analise(id_jardim, data_hora, valor_S01, valor_S02, valor_S03, valor_S04, media,status_umidade, clima, valvula, consumo) VALUES(1, now(),100,200,0,0,150,'seco','sol','off',0 );
?, now(), ?, ?, ?, ?, ?, ?, ?, ?);',[id_jardim, umidade1, umidade2, 
										umidade3, umidade4, media_umidade, status_umidade, clima, 'off', 0


*/
