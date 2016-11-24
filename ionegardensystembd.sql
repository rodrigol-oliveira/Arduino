CREATE SCHEMA IF NOT EXISTS `ioneBD` DEFAULT CHARACTER SET utf8 ;
USE `ionegardensystemdb` ;

CREATE TABLE `ionegardensystemdb`.`usuario` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `sobrenome` VARCHAR(45) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  `senha` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


CREATE TABLE `ionegardensystemdb`.`jardim` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idJardim` BIGINT NOT NULL,
  `nome` VARCHAR(45) NOT NULL,
  `serial` VARCHAR(45) NOT NULL,
  `estado` VARCHAR(45) NOT NULL,
  `cidade` VARCHAR(45) NOT NULL,
  `qtdSensores` BIGINT NOT NULL,
  PRIMARY KEY (`id`),
  INDEX `jardim_usuario_idx` (`id_jardim` ASC),
  CONSTRAINT `jardim_usuario`
    FOREIGN KEY (`id_jardim`)
    REFERENCES `ionegardensystemdb`.`usuario` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


CREATE TABLE `ionegardensystemdb`.`planta` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `nome` VARCHAR(45) NOT NULL,
  `grupo` BIGINT NULL,
  `nomeCientifico` VARCHAR(45) NULL,
  `temperaturaIdeal` VARCHAR(45) NULL,
  `umidadeMin` BIGINT NULL,
  `umidadeMax` BIGINT NULL,
  `informacoes` VARCHAR(1000) NULL,
  PRIMARY KEY (`id`))
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


CREATE TABLE `ionegardensystemdb`.`jardim_planta` (
  `idJardim` BIGINT NOT NULL,
  `idPlanta` BIGINT NOT NULL,
  INDEX `jardim_planta_idx` (`id_jardim` ASC),
  INDEX `jardim_planta_planta_idx` (`id_planta` ASC),
  CONSTRAINT `jardim_planta_jardim`
    FOREIGN KEY (`id_jardim`)
    REFERENCES `ionegardensystemdb`.`jardim` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `jardim_planta_planta`
    FOREIGN KEY (`id_planta`)
    REFERENCES `ionegardensystemdb`.`planta` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;


CREATE TABLE `ionegardensystemdb`.`analise` (
  `id` BIGINT NOT NULL AUTO_INCREMENT,
  `idJardim` BIGINT NOT NULL,
  `dataHora` DATETIME NOT NULL,
  `sensor1` BIGINT NULL,
  `sensor2` BIGINT NULL,
  `sensor3` BIGINT NULL,
  `sensor4` BIGINT NULL,
  `mediaSensores` FLOAT NULL,
  `statusUmidade` VARCHAR(45) NULL,
  `clima` VARCHAR(45) NULL,
  `valvula`  VARCHAR(45) NULL,
  `consumo` BIGINT NULL,
  PRIMARY KEY (`id`),
  INDEX `jardim_analise_idx` (`id_jardim` ASC),
  CONSTRAINT `jardim_analise`
    FOREIGN KEY (`id_jardim`)
    REFERENCES `ionegardensystemdb`.`jardim` (`id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB
DEFAULT CHARACTER SET = utf8;

insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Cactus Lily','Echinopsis oxygona', 204, 409, 1, '7°C - 30°C', 'Nativa do sul do Brasil, Uruguai e norte da Argentina.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Cactus de Páscoa','Hatiora gaertneri', 204, 409, 1, '7°C - 35°C', 'Vive em condições mais baixas de luz, pois é indicado para nativamente crescer. Crescem sobre os galhos de árvores, que os protege. Se adapta melhor em alta umidade.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Flor de Maio','Schlumbergera truncata', 204, 409, 1, '7°C - 30°C','Vive melhor com luz, mas de forma indireta.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Dendrobium da Rainha Victoria','Dendrobium victoriae-reginae', 204, 409, 1, '18°C - 30°C','Prospera nos trópicos, subtrópicos e pode sobreviver nos climas mais amenos do Mediterrâneo. No inverno, o crescimento necessitará ser feito em estufas.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Cactus Orquídea','Epiphyllum x', 204, 409, 1, '7°C - 30°C','Melhor crescimento em ambientes com sombra parcial. São adequados para jardins sombreados e no calor, em cestos como plantas do pátio.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Rosa Chinesa','Rosa chinensis', 410, 613, 2, '7°C - 30°C','Em temperaturas baixas suas folhas costumam cair, embora muitas rosas sobrevivam e algumas podem exigir proteção de inverno. Geralmente prosperam com pleno sol à sombra clara.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Hibisco Chines','Hibiscus rosa-sinensis', 410, 613, 2, '15°C - 30°C','Crescem melhor em pleno sol, reagindo mal à seca e geada.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Dama da noite','Cestrum nocturnum', 410, 613, 2, '10°C - 40°C','Precisa de pleno sol e climas quentes para prosperar. Também requer a proteção da geada em áreas sensíveis. ');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Margarida','Begonia semperflorens', 410, 613, 2, '7°C - 30°C','Cresce melhor com pleno sol e pode sustentar uma variedade de temperaturas. Pode crescer até 1 metro de altura, crescendo muito bem em regiões costeiras.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Violeta','Saintpaulia ionantha', 410, 613, 2, '15°C - 30°C','Suas flores brotam do centro da planta e preferem alta umidade. No inverno, move-se a Violeta para a luz interior mais brilhante.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Girasol','Helianthus annuus', 614, 818, 3, '15°C - 40°C','Toleram o calor, mas a geada a mata. Devem ficar protegidas do vento. Seu crescimento deve ser feito em áreas abertas de sol.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Azaléia','Rhododendron satsuki', 614, 818, 3, '10°C - 30°C','Crescem melhor com luz solar filtrada. Geralmente, essas plantas precisam de mais proteção contra o sol. Elas crescem melhor em refrigeradores e climas temperados que têm chuva suficiente.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Sino Chinês','Abutilon hybrids', 614, 818, 3, '10°C - 40°C', 'Eles são sensíveis a geada, sendo os melhores para crescer ao longo das paredes quentes e abrigadas. Muitas variedades necessitam de apoio.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Lírio da Paz','Spathiphyllum wallisii', 614, 818, 3, '15°C - 30°C','Cresce melhor em profunda sombra com alta umidade. Se não for localizada em regiões quentes, planta em uma estufa quente ou conservatório. Caso contrário, as espécies funcionam bem em uma borda úmido e sombrio.');
insert into planta(nome, cientifico, umidade_min, umidade_max, grupo, temperatura, informacoes)
values('Jasmin','Jasminum officinale', 614, 818, 3, '10°C - 40°C',' Cresce melhor em pleno sol ou pleno sol com sombreamento.');

select * from usuario;
delete from usuario where id = 5;
