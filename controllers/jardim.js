var _this = {};

module.exports = {

	setup: function(connection) {
		_this.connection = connection;
	},

		//metodo exibe pagina de cadastro
		meujardim: function(req, res){
			if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
				res.redirect('/');
			}else{
				var idUsuario = req.session.user.id;

				_this.connection.query('select * from jardim where idUsuario = ?', [idUsuario], 
					function(err, data){
						if (err) {
							console.log('meujardim - erro ao consultar jardim '+err);
							res.render('meujardim', {alert:false, jardim:false, plantas:false, jardimPlanta:false});
						}else{	
							if (data.length > 0) {
								var jardim = data;

								_this.connection.query('select p.id, p.nome, p.grupo, p.cientifico, p.temperatura, p.informacoes '+
									'from planta p '+
									'inner join jardim_planta jp on jp.idPlanta = p.id '+
									'inner join jardim j on j.id = jp.idJardim '+
									'where idJardim = ?', [jardim[0].id],
									function(err, data){
										if (err) {
											console.log('meujardim - erro ao consultar jardim_plantas '+err);
											res.render('meujardim', {alert:true, jardim:jardim, plantas:false, jardimPlanta:false, msg:'erro ao localizar as plantas do jardim'});
										}else{	
											var jardimPlanta = data;

											_this.connection.query('select * from planta', function(err, data){
												if (err) {
													console.log('meujardim - erro ao consultar plantas '+err);
													res.render('meujardim', {alert:true, jardim:jardim, plantas:false, jardimPlanta:jardimPlanta, msg:'plantas não localizadas no BD'});
												}else{	
													if (data.length > 0) {
														var plantas = data;
														res.render('meujardim', {alert:false, jardim:jardim, plantas:plantas, jardimPlanta:jardimPlanta});
													}else{
														res.render('meujardim', {alert:false, jardim:jardim, plantas:false, jardimPlanta:jardimPlanta});
													}
												}
											});

										}
									});
							}else{
								_this.connection.query('select * from planta', function(err, data){
									if (err) {
										console.log('meujardim - erro ao consultar plantas '+err);
										res.render('meujardim', {alert:false, jardim:false, plantas:false});
									}else{	
										if (data.length > 0) {
											res.render('meujardim', {alert:false, jardim:false, plantas:data});
										}else{
											res.render('meujardim', {alert:false, jardim:false, plantas:false});
										}
									}
								});
							}
						}
					});
			}
		},

		//metodo cadastar novo jardim 
		cadastrar: function(req, res){

			var nome 			= req.body.nome,
			serial 				= req.body.serial,
			sensores 			= req.body.sensores,
			idUsuario			= req.session.user.id,
			estado				= req.body.estado,
			plantas				= req.body.planta,
			cidade				= req.body.cidade,
			codCidade 			= cidade.substring(0,7),
			nomeCidade 			= cidade.substring(8);

			_this.connection.query('insert into jardim(idUsuario, nome, serial, estado, cidade, qtdSensores) '+
				'values(?,?,?,?,?,?)',[idUsuario, nome, serial, estado, cidade, sensores], function(err){
					if (err) {
						console.log('cadastrar - erro ao inserir jardim '+err);
						res.render('/home', {alert:true, msg:'erro ao cadastrar jardim'});
					}else{							
						_this.connection.query('select * from jardim where idUsuario = ?',[idUsuario],
							function(err, data){
								if (err) {
									console.log('cadastrar - erro ao consultar novo jardim '+err);
									res.render('/home', {alert:true, msg:'erro ao cadastrar jardim'});
								}else{	
									var jardim = data;
									//associar as plantas ao jardim (jardim_planta)

									if (Array.isArray(plantas)) {
										for(var i = 0; i < plantas.length; i++) {
											_this.connection.query('insert into jardim_planta values(?,?)',[jardim[0].id, plantas[i]],
												function(err){
													if (err) {
														console.log('cadastrar - erro ao cadastrar jardim_planta '+err);
														res.render('/home', {alert:true, msg:'erro ao cadastrar jardim'});
													}
												});	
										}

									}else{
										_this.connection.query('insert into jardim_planta values(?,?)',[jardim[0].id, plantas],
											function(err){
												if (err) {
													console.log('cadastrar - erro ao cadastrar jardim_planta No Array '+err);
													res.render('/home', {alert:true, msg:'erro ao cadastrar jardim'});
												}
											});
									}

									res.redirect('/home');
								}
							});
					}
				});

		},

		//metodo alterar dados do jardim
		editar: function(req, res){
			var nome 			= req.body.nome,
			serial 				= req.body.serial,
			sensores 			= req.body.sensores,
			idUsuario			= req.session.user.id,
			plantas 			= req.body.planta;

			_this.connection.query('update jardim set nome = ?, serial = ?, qtdSensores = ? '+
				'where idUsuario = ?', [nome, serial, sensores, idUsuario], 
				function(err){
					if (err) {
						console.log('editarJardim - erro update jardim '+err);
					}else{
						_this.connection.query('select * from jardim where idUsuario = ?', [idUsuario], 
							function(err, data){
								if (err) {
									console.log('editar - erro select jardim '+err);
									res.render('/home', {alert:true, msg:'erro ao altearar jardim'});
								}else{
									var jardim = data;

								/*	_this.connection.query('delete from jardim_planta where idJardim = ?', [jardim[0].id], 
										function(err){
											if (err) {
												console.log('editar - erro deletar jardimPlanta '+err);
												res.render('home', {alert:true, msg:'erro ao altearar jardim'});
											}else{
												for (var i = 0; i < plantas.length; i++) {
													_this.connection.query('insert into jardim_planta values(?,?)',[jardim[0].id, plantas[i]],
														function(err){
															if (err) {
																console.log('cadastrar - erro ao cadastrar jardim_planta '+err);
																res.render('home', {alert:true, msg:'erro ao altearar jardim'});
															}
														});
												}
												*/
												_this.connection.query('select p.id, p.nome, p.grupo, p.cientifico, p.temperatura, p.informacoes '+
													'from planta p '+
													'inner join jardim_planta jp on jp.idPlanta = p.id '+
													'inner join jardim j on j.id = jp.idJardim '+
													'where idJardim = ?', [jardim[0].id],
													function(err, data){
														if (err) {
															console.log('alterarJardim - erro ao consultar jardim_plantas '+err);
															res.render('home', {alert:true, msg:'erro ao altearar jardim'});
														}else{	
															var jardimPlanta = data;
															res.render('meujardim', {alert:true, msg:'Jardim alterado com sucesso',jardim:jardim, jardimPlanta:jardimPlanta});

													/*	_this.connection.query('select * from planta', function(err, data){
																if (err) {
																	console.log('alterarJardim - erro ao consultar plantas '+err);
																	res.render('home', {alert:true, msg:'erro ao alterar jardim'});
																}else{	
																	if (data.length > 0) {
																		var plantas = data;
																		res.render('meujardim', {alert:false, jardim:jardim, jardimPlanta:jardimPlanta, plantas:plantas});
																	}else{
																		res.render('home', {alert:true, msg:'erro ao altearar jardim'});
																	}
																}
															});*/

														}
													});

											}
										});
					}
				});

					//}
			//	});

		},

		//metodo deletar jardim
		deletar: function(req, res){

			var idUsuario = req.session.user.id;

			_this.connection.query('select * from jardim where idUsuario = ?', [idUsuario], function(err, data){
				if (err) {
					console.log('deletarJardim - erro select jardim '+err);
				}else{
					jardim = data;
					_this.connection.query('delete from jardim_planta where idJardim = ?', [jardim[0].id], function(err){
						if (err) {
							console.log('deletarJardim - erro delete jardim_planta '+err);
						}else{
							_this.connection.query('delete from analise where idJardim = ?', [jardim[0].id], function(err){
								if (err) {
									console.log('deletarJardim - erro delete analise '+err);
								}else{
									_this.connection.query('delete from jardim where id = ?', [jardim[0].id], function(err){
										if (err) {
											console.log('deletarJardim - erro delete jardim '+err);
										}else{

											res.redirect('/home');
										}
									});
								}
							});
						}
					});

				}
			})
		},

		//metodo listar jardim
		listar: function(req, res){
			//opção de administrador do sistema - fora do escopo
		}


	}

	//falta metodos editar e deletar jardim