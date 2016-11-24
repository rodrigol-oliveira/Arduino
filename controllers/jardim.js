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
			cidade				= req.body.cidade,
			plantas				= req.body.planta;

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
									for (var i = 0; i < plantas.length; i++) {
										_this.connection.query('insert into jardim_planta values(?,?)',[jardim[0].id, plantas[i]],
											function(err){
												if (err) {
													console.log('cadastrar - erro ao cadastrar jardim_planta '+err);
													res.render('/home', {alert:true, msg:'erro ao cadastrar jardim'});
												}
											});
									}
								}
							});
					}
				});

		},

/*
		//metodo exibir detalhes do jardim
		exibir: function(req, res){

			var id = req.session.user.id;

			//procura jardim no banco de dados
			Jardim.find({id_usuario:id}, function(err, data){
				if (err) {
					console.log('exibirJardim - erro localizar jardim '+err);
				}else{
					var jardim = data;

			//pricura as plantas que estão associadas ao jardim no banco de dados
			Planta.find({jardim:{$exist:true}}, function(err, data){
				if (err) {
					console.log('exibirJardim - erro localizar plantas '+err);		
				}else{
					var plantas = data;

					res.render('meujardim', {jardim:jardim, plantas:plantas});
				}
			});
		}
	})
		},
		*/

		//metodo alterar dados do jardim
		editar: function(req, res){
			var nome 			= req.body.nome,
			serial_ione 		= req.body.serial,
			sensores_umidade 	= req.body.sensores,
			id_usuario			= req.session.user.id,
			planta 				= req.body.planta;

			//altera os dados do jardim cadastrado
			Jardim.update({id_usuario:id_usuario},{$set:{
				nome:nome,
				serial_ione:serial_ione,
				sensores_umidade:sensores_umidade}}, function(err, data){
					if(err){
						console.log('alterarJardim - erro update jardim '+err);
					}else{
						
						//atualiza a associação do jardim às plantas

						//remove associação do jardim
						Planta.update({jardim:{$exist:true}},{$unset:{jardim:1}}, function(err, data){
							if (err) {
								console.log('alterarJardim - erro remover jardim das plantas '+err);		
							}else{
						//insere associação do jardim
						for (var i = 0; i < planta.length; i++) {
							Planta.update({nome:planta[i]},{$set:{jardim:data[0].nome}}, function(err,data){
								if (err) console.log('alterarJardim - associar planta '+err);
							});
						}	
						res.render('/home');
					}
				});
					}
				});

		},

		//metodo deletar jardim
		deletar: function(req, res){

			var id_usuario = req.session.user.id;


			Jardim.delete({id_usuario:id_usuario}, function(err, data){
				if (err) {
					console.log('deletarJardim - erro ao deletar jardim '+err);
				}else{
					//remove associação do jardim com as plantas
					Planta.update({jardim:{$exist:true}},{$unset:{jardim:1}}, function(err, data){
						if (err) {
							console.log('deletarJardim - erro remover jardim das plantas '+err);
						}else{
							Usuario.update({_id:id_usuario}, {$unset:{jardim:1}}, function(err, data){
								if (err) {
									console.log('deletarJardim - erro remover jardim de conta do usuario '+err);
								}else{
									res.redirect('/home');
								}
							});

						}
					});
				}
			});
		},

		//metodo listar jardim
		listar: function(req, res){
			//opção de administrador do sistema - fora do escopo
		}


	}

	//falta metodos editar e deletar jardim