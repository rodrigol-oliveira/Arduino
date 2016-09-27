	var express = require('express');
	var ejs = require('ejs');
	var mysql = require('mysql');
	var bodyParser = require('body-parser');
	var path = require('path');
	var session = require('express-session'); <!-- cria uma instancia em branco  - framework -->
	var bcrypt = require('bcrypt-nodejs'); <!-- criptografia-->
	
	/*
    people = ['geddy', 'neil', 'alex'];
    html = ejs.render('<%= people.join(", "); %>', {people: people});
    */

    var app = express();
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.set('views', __dirname + '/views');
    app.use(express.static('public'));
    app.locals.pretty = true;
    app.use(express.static(__dirname + '/views'));
	//da linha 19 a 24 se refere a seção, impedindo que acesse as paginas internas sem logar
	app.set('trust proxy', 1)
	app.use(session({
		secret: 'secret cat',
		resave: false,
		saveUninitialized: true,
	}));


//Metodo de conexão
var connection = mysql.createConnection({
	host		: 'localhost',
	user		: 'root',
	password	: 'root',
	database	: 'arduino'
});


//Pagina requisita pagina inicial - ok
app.get('/',function(req,res){
	res.render('index', {message: ''});
});

//metodo requisita pagina de Login - ok
app.get('/viewIniciar', function(req,res){
	res.render('iniciar', {message: ''});
});

//Metodo requisita pagina de cadastro - ok
app.get('/viewRegistrar',function(req,res){
	res.render('registrar');
});


//Metodo requisita pagina de relatorios
app.get('/viewRelatorios',function(req,res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{
		var id = req.session.user.id;
		res.render('relatorios', {id:id});
	}
});




//metodo requisita pagina de Login
app.get('/sair', function(req, res){
var session = req.session.user = {}; //finaliza a seção (cria uma em branco) e chama index
res.redirect('/');
});


//Metodo requisita pagina de redefinir senha
app.get('/viewRedefinir',function(req,res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{
		var nome = req.session.user.nome;

		res.render('redefinir', {nome: nome});	
	}
});

function Usuario(id, nome, sobrenome, genero, email){
	this.id = validaINTNull(id);
	this.nome = validaCHARNull(nome);
	this.sobrenome = validaCHARNull(sobrenome);
	this.genero = validaCHARNull(genero);
	this.email = validaCHARNull(email);
}

function relatorioCompleto(nome_planta, nome_grupo, data_hora, valor_S01, valor_S02, valor_S03, valor_S04,
	status_umidade, clima, probabilidade_chuva,valvula, consumo){
	
	this.nome_planta = validaCHARNull(nome_planta);
	this.nome_grupo = validaCHARNull(nome_grupo);
	this.valor_S01 = validaINTNull(valor_S01); this.valor_S02 = validaINTNull(valor_S02);
	this.valor_S03 = validaINTNull(valor_S03); this.valor_S04 = validaINTNull(valor_S04); 
	this.probabilidade_chuva = validaINTNull(probabilidade_chuva); this.consumo = validaINTNull(consumo);
	this.status_umidade = validaCHARNull(status_umidade); this.clima = validaCHARNull(clima); 
	this.valvula = validaCHARNull(valvula);
}


function relatorioPlantas(nome_jardim, nome_planta, descricao_planta, nome_grupo, descricao_grupo){
	this.nome_jardim = validaCHARNull(nome_jardim);
	this.nome_planta = validaCHARNull(nome_planta);
	this.descricao_planta = validaCHARNull(descricao_planta);
	this.nome_grupo = validaCHARNull(nome_grupo); 
	this.descricao_grupo = validaCHARNull(descricao_grupo);
}

function relatorioUmidade(data_hora, status_umidade, clima){
	this.data_hora = data_hora;
	this.status_umidade = validaCHARNull(status_umidade);
	this.clima = validaCHARNull(clima);
}

function relatorioConsumo(data_hora, valvula, consumo, clima){
	this.data_hora = data_hora;
	this.valvula = validaCHARNull(valvula);
	this.consumo = validaINTNull(consumo);
	this.clima = validaCHARNull(clima);
}

function Jardim(nome_jardim, estado, cidade, grupo, id_valvula, descricao_valvula, id_agua, descricao_agua){
	this.nome_jardim = validaCHARNull(nome_jardim);
	this.estado = validaCHARNull(estado);
	this.cidade = validaCHARNull(cidade);
	this.grupo = validaCHARNull(grupo);
	this.id_valvula = validaINTNull(id_valvula);
	this.descricao_valvula = validaCHARNull(descricao_valvula);
	this.id_agua = validaINTNull(id_agua);
	this.descricao_agua = validaCHARNull(descricao_agua);
}

function Planta(id, nome_planta, descricao_planta){
	this.id = validaINTNull(id);
	this.nome_planta = validaCHARNull(nome_planta);
	this.descricao_planta = validaCHARNull(descricao_planta);
}

function Sensor(id, nome_sensor, especificacao_sensor){
	this.id = validaINTNull(id);
	this.nome_sensor = validaCHARNull(nome_sensor);
	this.especificacao_sensor = validaCHARNull(especificacao_sensor);
}

function validaINTNull(int){
	if (int == null) {
		return 0;
	}else{
		return int;
	}
}

function validaCHARNull(char){
	if (char == null) {
		return " ";
	}else{
		return char;
	}
}

function Analize(id_jardim, data_hora, valor_S01, valor_S02, valor_S03, valor_S04,
	status_umidade, clima, probabilidade_chuva,valvula, consumo){
	
	this.id_jardim = id_jardim;	this.data_hora = data_hora;	
	this.valor_S01 = validaINTNull(valor_S01); this.valor_S02 = validaINTNull(valor_S02);
	this.valor_S03 = validaINTNull(valor_S03); this.valor_S04 = validaINTNull(valor_S04); 
	this.probabilidade_chuva = validaINTNull(probabilidade_chuva); this.consumo = validaINTNull(consumo);
	this.status_umidade = validaCHARNull(status_umidade); this.clima = validaCHARNull(clima); 
	this.valvula = validaCHARNull(valvula);
}

function SelectIdJardim(usuario){
	connection.query('SELECT id FROM jardim WHERE id_usuario = ?', [usuario],
		function(err, rows){
			if(err){
				console.log('erro SelectIdJardim');
				throw err;
			}else{
				var idJardim = rows[0];
				
				return idJardim;
			}
		});
}


//chama metodo tela principal
app.get('/viewPrincipal', function(req, res){
	if (!req.session.user || !req.session.user.nome || !req.session.user.id) {
		res.redirect('/viewIniciar');
	}else{
		var id_usuario = req.session.user.id;

		connection.query('SELECT * from usuario WHERE id = ?;', [id_usuario], function(err, rows){
			if (err) {
				console.log('erro select usuario principal');
				throw err;
			}else{
				var usuario = new Usuario(rows[0].id, rows[0].nome, rows[0].sobrenome, rows[0].genero, rows[0].email)
				
				connection.query('SELECT * from jardim WHERE id_usuario = ?;', [id_usuario],
					function(err, rows){
						if (err){
							console.log('erro select jardim view principal');
							throw err;
						}else{
							if (rows.length == 0) {
								res.render('principal', {usuario:usuario, id_jardim:''});
							}else{
								var id_jardim = rows[0].id;

								connection.query('SELECT j.nome_jardim, j.estado, j.cidade, g.nome_grupo, v.id, v.descricao_valvula, a.id, a.descricao_agua '+ 
									'from jardim j '+ 
									'inner join usuario u on u.id = j.id_usuario '+
									'inner join jardim_planta jp on jp.id_jardim = j.id '+
									'inner join planta p on p.id = jp.id_planta '+
									'inner join grupo_planta gp on gp.id_planta = p.id '+
									'inner join grupo g on g.id = gp.id_grupo '+
									'inner join valvula v on v.id = j.id_valvula '+
									'inner join agua a on a.id = j.id_agua '+
									'where u.id = ?;',[id_usuario], function(err, rows){
										if (err) {
											console.log('erro ao pesquisar detalhes de jardim em princiapl json');
											throw err;
										}else{

											var detalhesJardim = new Jardim(rows[0].nome_jardim, rows[0].estado, 
												rows[0].cidade, rows[0].nome_grupo, rows[0].id_valvula, rows[0].descricao_valvula,
												rows[0].id_agua,  rows[0].descricao_agua);

											var arrayPlanta = [];

											connection.query('SELECT p.id, p.nome_planta, p.descricao_planta from planta p '+
												'inner join jardim_planta jp on jp.id_planta = p.id '+
												'inner join jardim j on j.id = jp.id_jardim '+
												'where j.id = ?', [id_jardim], function(err, rows){
													if (err) {
														console.log('erro select plantas principal');
														throw err;
													}else{
														if (rows.length > 0) {
															for(var i=0; i<rows.length; i++){
																var planta = new Planta(rows[i].id, rows[i].nome_planta, rows[i].descricao_planta);
																arrayPlanta.push(planta);
															}
														}

														var arraySensor = [];

														connection.query('SELECT s. id, s.nome_sensor, s.especificacao_sensor from sensor s '+
															'inner join jardim_sensor js on js.id_sensor = s.id '+
															'inner join jardim j on j.id = js.id_jardim '+
															'where j.id = ?;', [id_jardim], function(err, rows){
																if (err) {
																	console.log('erro select sensores principal');
																	throw err;
																}else{
																	if (rows.length > 0) {
																		for(var i=0; i<rows.length; i++){
																			var sensor = new Sensor(rows[i].id, rows[i].nome_sensor, rows[i].especificacao_sensor);
																			arraySensor.push(sensor); 
																		}
																	}

																	connection.query('SELECT id_jardim, DATE_FORMAT(data_hora, "%d/%l/%Y %H:%m:%s") as "data_hora", '+
																		'valor_S01, valor_S02, status_umidade, clima, probabilidade_chuva,valvula, '+
																		'consumo from analize where id_jardim = ? LIMIT 3;', [id_jardim], 
																		function(err, rows){
																			if (err) {
																				console.log('erro select analize');
																				throw err;
																			}else{

																				var arrayAnalize = [];

																				if (rows.length == 0) {
																					res.render('principal', {usuario:usuario, id_jardim:id_jardim, detalhesJardim:detalhesJardim, 
																						plantas:arrayPlanta, sensores:arraySensor, analize:''});
																				}else{

																					for (var i = 0; i < rows.length; i++) {

																						var analize = new Analize(rows[i].id_jardim, rows[i].data_hora, rows[i].valor_S01, 
																							rows[i].valor_S02, rows[i].valor_S03, rows[i].valor_S04, rows[i].status_umidade, 
																							rows[i].clima, rows[i].probabilidade_chuva, rows[i].valvula, rows[i].consumo);

																						arrayAnalize.push(analize);
																					}

																					res.render('principal', {usuario:usuario, id_jardim:id_jardim, detalhesJardim:detalhesJardim, 
																						plantas:arrayPlanta, sensores:arraySensor, analize:arrayAnalize});
																				}
																			}
																		});
																}
															});
													}
												});
										}	
									});
}
}
});
}
});
}
});


//Metodo requisita pagina de dados caddastrais
app.get('/viewNovoJardim', function(req, res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{
		connection.query('SELECT * FROM planta;', function(err, rows){
			if (err) {
				console.log('erro select plantas novo jardim');
				throw err;
			}else{
				var plantas = rows;

				connection.query('SELECT * from valvula;', function(err, rows){
					if (err) {
						console.log('erro select valvula novo jardim');
						throw err;
					}else{
						var valvula = rows;

						connection.query('SELECT * from agua;', function(err, rows){
							if (err) {
								console.log('erro select agua novo jardim');
								throw err;
							}else{
								var agua = rows;

								connection.query('SELECT * from sensor;', function(err, rows){
									if (err) {
										console.log('erro select sensor novo jardim');
										throw err;
									}else{
										var sensor = rows;

										res.render('novoJardim',{plantas:plantas, valvula:valvula, agua:agua, sensor:sensor});
									}
								});								
							}
						});				
					}
				});
			}
		});
	}
});


//metod que verifica as credenciais da conta
app.post('/validar', function(req, res) {
	var email = req.body.email;
	var senha = req.body.senha;

	connection.query('SELECT * FROM usuario WHERE email = ?;', [ email ] , 
		function(err, rows){
			if(err) throw err;
			if(rows.length === 1){
				var id = rows[0].id;
				var nome = rows[0].nome;
				var pwd = rows[0].senha;
				
				if(bcrypt.compareSync(senha, pwd)){ // metodo da biblioteca que compara as senhas
					var session = req.session.user = {
						id: id,
						nome: nome
					};
					res.redirect('/viewPrincipal');
				}else{
					res.send("Dados inválidos");//senha inválida
				}
			}else{
				res.send("Dados inválidos");//user não cadastrado
			}
		});
});


//metodo de adicionar usuario no BD
app.post('/registrar',function(req, res){
	var nome = req.body.nome;
	var sobrenome = req.body.sobrenome;
	var email = req.body.email;
	var senha = req.body.senha;
	var genero = req.body.genero;
	var hash = bcrypt.hashSync(senha); //criptografia
	connection.query('INSERT INTO usuario(nome, sobrenome, genero, email, senha) VALUES (?,?,?,?,?);',
		[nome, sobrenome, genero, email, hash ] , 
		function(err, res){
			if(err) throw err;
		});
	res.render('iniciar');
});

//metodo altera o jardim - ainda dá para melhorar a query com update inner join
app.post('/alterarJardim', function(req,res){

	var id_usuario = req.session.user.id;
	
	var nome = req.body.nome;
	var estado = req.body.estado;
	var cidade = req.body.cidade;
	var agua = req.body.agua;
	var valvula = req.body.valvula;

	var planta = req.body.planta;
	var sensor = req.body.sensor;

	console.log(nome, estado, cidade, agua, valvula);

	connection.query('SELECT * from jardim WHERE id_usuario = ?;', [id_usuario], function(err, rows){
		if (err) {
			console.log('erro select jardim alterarJardim');
			throw err;
		}else{
			var id_jardim = rows[0].id;

			connection.query('UPDATE jardim SET nome_jardim = ? WHERE id = ?;', [nome, id_jardim], function(err){
				if (err) {
					console.log('erro update nome alterarJardim');
					throw err;
				}else{
					connection.query('UPDATE jardim SET id_valvula = ? WHERE id = ?;', [ valvula, id_jardim], function(err){
						if (err) {
							console.log('erro update valvula alterarJardim');
							throw err;		
						}else{
							connection.query('UPDATE jardim SET id_agua = ? WHERE id = ?;', [ agua, id_jardim], function(err){
								if (err) {
									console.log('erro update agua alterarJardim');
									throw err;		
								}else{
									connection.query('UPDATE jardim SET estado = ? WHERE id = ?;', [ estado, id_jardim], function(err){
										if (err) {
											console.log('erro update estado alterarJardim');
											throw err;		
										}else{
											connection.query('UPDATE jardim SET cidade = ? WHERE id = ?;', [ cidade, id_jardim], function(err){
												if (err) {
													console.log('erro update cidade alterarJardim');
													throw err;		
												}else{
													connection.query('delete from jardim_planta where id_jardim = ?',[id_jardim], function(err){
														if (err) {
															console.log('erro delete jardim_planta alterarJardim');
															throw err;		
														}else{
															for (var i = 0; i < planta.length; i++) {
																connection.query('INSERT into jardim_planta(id_jardim, id_planta) VALUES(?,?)',
																	[id_jardim, planta[i]], function(err){
																		if (err) {
																			console.log('erro inserir jardim_planta alterarJardim');
																			throw err;
																		}
																	});	
															}

															connection.query('delete from jardim_sensor where id_jardim = ?;',[id_jardim], function(err){
																if (err) {
																	console.log('erro delete jardim_sensor alterarJardim');
																	throw err;		
																}else{
																	for (var i = 0; i < sensor.length; i++) {
																		connection.query('INSERT into jardim_sensor(id_jardim, id_sensor) VALUES(?,?);',
																			[id_jardim, sensor[i]], function(err){
																				if (err) {
																					console.log('erro inserir jardim_sensor alterarJardim');
																					throw err;
																				}
																			});
																	}
																	res.redirect('viewPrincipal');
																}
															});
														}
													});
												}
											});
										}
									});
								}
							});
						}
					});
				}
			});
		}
	});
});


//Metodo alterar jardim
app.get('/viewAlterarJardim',function(req,res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{
		var id_usuario = req.session.user.id;

		connection.query('SELECT * FROM jardim WHERE id_usuario = ?;', [id_usuario], function(err, rows){
			if (err) {
				onsole.log('erro select id_jardim alterar jardim');
				throw err;
			}else{
				var id_jardim = rows[0].id;

				connection.query('SELECT * FROM planta;', function(err, rows){
					if (err) {
						console.log('erro select planta alterar jardim');
						throw err;
					}else{
						var plantas = rows;

						connection.query('SELECT * from sensor;', function(err, rows){
							if (err) {
								console.log('erro select sensor alterar jardim');
								throw err;
							}else{
								var sensores = rows;

								connection.query('select * from agua;', function(err, rows){
									if (err) {
										console.log('erro select agua alterar jardim');
										throw err;	
									}else{
										var agua = rows;

										connection.query('SELECT * from valvula;', function(err, rows){
											if(err){
												console.log('erro select valvula alterar jardim');
												throw err;
											}else{
												var valvula = rows;

												connection.query('SELECT j.nome_jardim, j.estado, j.cidade, g.nome_grupo, v.id as id_valvula, v.descricao_valvula, a.id as id_agua, a.descricao_agua '+ 
													'from jardim j '+ 
													'inner join usuario u on u.id = j.id_usuario '+
													'inner join jardim_planta jp on jp.id_jardim = j.id '+
													'inner join planta p on p.id = jp.id_planta '+
													'inner join grupo_planta gp on gp.id_planta = p.id '+
													'inner join grupo g on g.id = gp.id_grupo '+
													'inner join valvula v on v.id = j.id_valvula '+
													'inner join agua a on a.id = j.id_agua '+
													'where u.id = ?;',[id_usuario], function(err, rows){
														if (err) {
															console.log('erro select jardim alterar jardim');
															throw err;
														}else{
															var jardim = new Jardim(rows[0].nome_jardim, rows[0].estado, 
																rows[0].cidade, rows[0].nome_grupo, rows[0].id_valvula, rows[0].descricao_valvula,
																rows[0].id_agua,  rows[0].descricao_agua);

															
															connection.query('SELECT p.id, p.nome_planta from planta p '+
																'inner join jardim_planta jp on jp.id_planta = p.id '+
																'inner join jardim j on j.id = jp.id_jardim '+
																'where j.id = ?', [id_jardim], function(err, rows){
																	if(err){
																		console.log('erro SELECT jardim_planta alterar jardim');
																		throw err;
																	}else{
																		var arrayPlanta = [];

																		for(var i=0; i<rows.length; i++){

																			var res_planta = new Planta(rows[i].id, rows[i].nome_planta, rows[i].descricao_planta);
																			arrayPlanta.push(res_planta);
																		}

																		connection.query('SELECT s.id, s.nome_sensor, s.especificacao_sensor from sensor s '+
																			'inner join jardim_sensor js on js.id_sensor = s.id '+
																			'inner join jardim j on j.id = js.id_jardim '+
																			'WHERE j.id = ?', [id_jardim], function(err, rows){
																				if (err) {
																					onsole.log('erro select jardim_sensor alterar jardim');
																					throw err;
																				}else{
																					var arraySensor = [];
																					for(var i=0; i<rows.length; i++){

																						var res_sensor = new Sensor(rows[i].id, rows[i].nome_sensor, rows[i].especificacao_sensor);

																						arraySensor.push(res_sensor);
																					}	
																					
																					res.render('alterarJardim', {plantas:plantas, sensores:sensores, valvula:valvula,
																						agua:agua, jardim:jardim, arrayPlanta:arrayPlanta, arraySensor:arraySensor});
																				}
																			});
																	}
																});

														}
													});
											}
										});
									}

								})
							}
						});
					}
				});
			}
		});
}
});


//metodo deletar jardim
app.get('/deletarJardim', function(req, res){

	var nome = req.session.user.nome;
	var id_usuario = req.session.user.id;

	connection.query('select * from jardim where id_usuario = ?', [id_usuario],
		function(err, rows){
			if (err){
				console.log('erro select jardim em deletar')
				throw err;
			}else{
				
				var id_jardim = rows[0].id;

				connection.query('delete from jardim_planta where id_jardim = ?;', [id_jardim],
					function(err){
						if(err){
							console.log('erro ao deletar jardim_planta x');
							throw err;
						}else{
							connection.query('delete from jardim_sensor where id_jardim = ?;', [id_jardim],
								function(err){
									if (err) {
										console.log('erro ao deletar jardim_sensor');
										throw err;
									}else{
										connection.query('select * from analize WHERE id_jardim = ?;', [id_jardim],
											function(err, rows){
												if(err){
													console.log('erro select analize deletar');
													throw err;
												}else{
													if (rows.length > 0) {
														connection.query('delete from analize where id_jardim = ?;', [id_jardim], function(err){
															if (err) {
																console.log('erro ao deletar analize');
																throw err;
															}
														});
													}
												}
												connection.query('delete from jardim where id_usuario = ?', [id_usuario], 
													function(err){
														if (err) {
															console.log('erro ao deletar jardim');
															throw err;
														}

														res.redirect('/viewPrincipal');
													});	
												

											});	
									}
								});
						}
					});
			}
		});
});


//metodo registra novo jardim no bano ainda da para melhorar a query com insert inner
app.post('/novoJardim',function(req, res){
	var id_usuario = req.session.user.id;
	var nome = req.body.nome;
	var pais = req.body.pais;
	var estado = req.body.estado;
	var cidade = req.body.cidade;
	var agua = req.body.agua;
	var valvula = req.body.valvula;

	var planta = req.body.planta;
	var sensor = req.body.sensor;
	

	connection.query('INSERT into jardim(id_usuario, id_valvula, id_agua, nome_jardim, estado, cidade) '+
		'VALUES(?,?,?,?,?,?);', [id_usuario, valvula, agua, nome, estado, cidade],
		function(err){
			if(err) {
				console.log('erro inserir novo jardim');
				throw err;
			}
		});

	connection.query('SELECT * FROM jardim WHERE id_usuario = ?', [id_usuario],
		function(err, rows){
			if (err) {
				console.log('erro select idjardim novoJardim');
				throw err;
			}else{
				var id_jardim = rows[0].id;

				if (planta.length > 0) {
					for (var i = 0; i < planta.length; i++) {
						connection.query('INSERT into jardim_planta(id_jardim, id_planta) VALUES(?,?);',
							[id_jardim, planta[i]], function(err){
								if (err) {
									console.log('erro inserir jardim_planta');
									throw err;
								}
							});
					}
				}
				if (sensor.length > 0) {
					for (var i = 0; i < sensor.length; i++) {
						connection.query('INSERT into jardim_sensor(id_jardim, id_sensor) VALUES(?,?);',
							[id_jardim, sensor[i]], function(err){
								if (err) {
									console.log('erro inserir jardim_sensor');
									throw err;
								}
							});
					}					
				}
			}
		});
	res.redirect('viewPrincipal');
});






app.post('/selectPlantas', function(req, res){

	var id = req.session.user.id;

	connection.query('SELECT j.nome_jardim, p.nome_planta, p.descricao_planta, g.nome_grupo, g.descricao_grupo '+ 
		'from jardim j '+ 
		'inner join usuario u on u.id = j.id_usuario '+
		'inner join jardim_planta jp on jp.id_jardim = j.id '+
		'inner join planta p on p.id = jp.id_planta '+
		'inner join grupo_planta gp on gp.id_planta = p.id '+
		'inner join grupo g on g.id = gp.id_grupo '+
		'where u.id = ?;', [id], function(err, rows){
			if(err){
				console.log('erro selectplantas');
				throw err;
			}else{
				var plantas = new relatorioPlantas(rows[0].nome_jardim, rows[0].nome_planta, rows[0].descricao_planta,
					rows[0].nome_grupo, rows[0].descricao_grupo);

				res.render('res_planta', {res_plantas:plantas});

			}
		});
});

app.post('/selectUmidade', function(req, res){

	var id = req.session.user.id;

	connection.query('select DATE_FORMAT(data_hora, "%d/%l/%Y %H:%m:%s") as "data_hora", status_umidade, clima '+
		'from usuario u '+
		'inner join jardim j on j.id_usuario = u.id '+
		'inner join analize a on a.id_jardim = j.id '+
		'where u.id = ?; ', [id], function(err, rows){
			if(err){
				console.log('erro selectUmidade');
				throw err;
			}else{
				if (rows.length > 0) {
					var array = [];

					for (var i = 0; i < rows.length; i++) {
						var umidade = new relatorioUmidade(rows[i].data_hora, rows[i].status_umidade, rows[i].clima);

						array.push(umidade);
					}

					res.render('res_umidade', {res_umidade:array});

				}else{
					res.render('res_umidade', {res_umidade:''});
				}
			}
		});
});


app.post('/selectConsumo', function(req, res){

	var id = req.session.user.id;

	connection.query('select DATE_FORMAT(data_hora, "%d/%l/%Y %H:%m:%s") as "data_hora", valvula, consumo, clima '+
		'from usuario u '+
		'inner join jardim j on j.id_usuario = u.id '+
		'inner join analize a on a.id_jardim = j.id '+
		'where u.id = ?; ', [id], function(err, rows){
			if(err){
				console.log('erro selectConsumo');
				throw err;
			}else{
				if (rows.length > 0) {
					var array = [];

					for (var i = 0; i < rows.length; i++) {
						var consumo = new relatorioConsumo(rows[i].data_hora, rows[i].valvula, rows[i].consumo, rows[i].clima);

						array.push(consumo);
					}

					res.render('res_consumo', {res_consumo:array});

				}else{
					res.render('res_consumo', {res_consumo:''});
				}
			}
		});
});

app.post('/selectCompleto', function(req, res){

	var id = req.session.user.id;

	connection.query('SELECT DATE_FORMAT(data_hora, "%d/%l/%Y %H:%m:%s") as "data_hora", '+
		'valor_S01, valor_S02,valor_S03, valor_S04, status_umidade, clima, probabilidade_chuva, valvula, '+ 
		'consumo, nome_planta, nome_grupo '+
		'from jardim j '+ 
		'inner join usuario u on u.id = j.id_usuario '+
		'inner join jardim_planta jp on jp.id_jardim = j.id '+
		'inner join planta p on p.id = jp.id_planta '+
		'inner join grupo_planta gp on gp.id_planta = p.id '+
		'inner join grupo g on g.id = gp.id_grupo '+
		'inner join analize a on a.id_jardim = j.id '+
		'where u.id = ?;', [id], function(err, rows){
			if(err){
				console.log('erro selectCompleto');
				throw err;
			}else{
				
				if (rows.length > 0) {
					var array = [];

					for (var i = 0; i < rows.length; i++) {

						var completo = new relatorioCompleto(rows[i].nome_planta, rows[i].nome_grupo, rows[i].data_hora, rows[i].valor_S01, 
							rows[i].valor_S02, rows[i].valor_S03, rows[i].valor_S04, rows[i].status_umidade, 
							rows[i].clima, rows[i].probabilidade_chuva, rows[i].valvula, rows[i].consumo);

						array.push(completo);
					}

					res.render('res_completo', {res_completo:array});
					

				}else{
					res.render('res_completo', {res_completo:''});
				}
			}
		});
});

function defineStatus(v1,v2,v3,v4){
	this.v1 = parseInt(v1);
	this.v2 = parseInt(v2);
	this.v3 = parseInt(v3);
	this.v4 = parseInt(v4);

	var md = parseFloat((this.v1+this.v2+this.v3+this.v4)/4);
	
	if(md > 500){
		var status =  'umido';
	}else{
		var status =  'seco';
	}
	return status;
}

//metodo-teste analize
app.get('/analizar', function(res, req){
	
	
	var S01 = 500; var S02=600; var S03=200; var S04=300;

/*	`id` BIGINT(10) NOT NULL auto_increment,  `id_jardim` BIGINT(10) NOT NULL,   `data_hora` DATETIME NOT NULL,
  `valor_S01` BIGINT(10),   `valor_S02` BIGINT(10),   `valor_S03` BIGINT(10),   `valor_S04` BIGINT(10),
  `status_umidade` VARCHAR(40),   `clima` VARCHAR(40),  `probabilidade_chuva` BIGINT(10),    `valvula` varchar(10),
  `consumo` BIGINT(10),
  */

  connection.query('SELECT * from jardim where id_usuario = ?;', [1], function(err, rows){
  	if(err){
  		console.log('erro select jardim analize');
  		throw err;
  	}else{

  		var id_jardim = rows[0].id;

  		connection.query('INSERT into analize(id_jardim, data_hora,  valor_S01, valor_S02, valor_S03, valor_S04) '+
  			'VALUES(?, now(), ?,?,?,?);', [id_jardim, S01, S02, S03, S04], function(err){
  				if(err){
  					console.log('erro insert analize');
  					throw err;
  				}else{

  					var st = new defineStatus(S01, S02, S03, S04);
  					console.log(st);

  					connection.query('UPDATE analize SET status = ? where id_jardim = ?;', [st, id_jardim], function(err){
  						if(err){
  							console.log('erro update status analize');
  							throw err;
  						}else{
  							res.redirect('/viewPrincipal');
  						}
  					})
  				}

  			});
  	}
  });


});



			//Chama Metodo de Conexão ao executar app
			connection.connect(function(err){
				if(err) throw err;
				console.log('Conectado no MySQL'); 	
				app.listen(3000, function(){
					console.log('Servidor Arduino -> http://localhost:3000');
				});
			});


/*		
				connection.query('INSERT INTO jardim (id_usuario, nome_jardim, pais, estado, cidade) VALUES (?,?,?,?,?);',
				[ id_usuario, nome, pais, estado, cidade ] , 
				function(err, res){
					if(err) {
						console.log('erro ao cadastrar jardim');
						throw err;
					}else{
						connection.query('SELECT * FROM jardim WHERE id_usuario = ?;' , [id_usuario],
						function(err, rows){
							if(err){
								console.log('erro ao pesquisar jardim cadastrado pelo usuario');
								throw err;	
							} else{
								var id = rows[0].id;
								console.log(id);
								connection.query('INSERT INTO jardim_planta(id_jardim, id_planta) VALUES (?,?);',
								[id, planta],
								function(err,res){
									if(err)
										console.log('erro ao cadastrar jardim_planta');
									throw err;	
									

								});
							}
						});
					}
				});
				res.redirect('/viewPrincipal');
			});
			*/
/*
//Metodo requisita pagina principal
app.get('/viewPrincipalOld', function(req,res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{		
		var nome = req.session.user.nome;
		var id = req.session.user.id;

		connection.query('SELECT id FROM jardim WHERE id_usuario = ?', [id],
			function(err,rows){
				if (err) {
					console.log('erro select id jardim principal');
					throw err;
				}else{

					var jardim = rows[0].id_jardim;

					if (jardim.length == 0) {
						res.render('principal', {nome:nome, jardim:jardim})
					}else{

						connection.query('SELECT j.nome_jardim, j.estado, j.cidade, p.nome_planta, g.nome_grupo '+ 
							'from jardim j '+ 
							'inner join usuario u on u.id = j.id_usuario '+
							'inner join jardim_planta jp on jp.id_jardim = j.id '+
							'inner join planta p on p.id = jp.id_planta '+
							'inner join grupo_planta gp on gp.id_planta = p.id '+
							'inner join grupo g on g.id = gp.id_grupo '+
							'where u.id = ?;',[id],
							function(err,rows){
								if(err) throw err;
								var nome_jardim = rows[0].nome_jardim;
								var estado = rows[0].estado;
								var cidade = rows[0].cidade;
								var planta = rows[0].nome_planta;
								var grupo = rows[0].nome_grupo;

								res.render('principal', 
									{nome:nome, jardim:jardim, nome_jardim:nome_jardim, 
										estado:estado, cidade:cidade, planta:planta, 
										grupo:grupo, results:''})

							});
					}
				}
			}); 	
	}
});

}*/
