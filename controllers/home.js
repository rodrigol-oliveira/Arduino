var _this = {};

module.exports = {

	setup: function(connection) {
		_this.connection = connection;
	},

	index: function(req, res){
		res.render('index', {alert:false});	
	},

	login: function(req, res){
		res.render('login', {alert:false});
	},

	sair: function(req, res){
		var session = req.session.user = {}; //finaliza a seção (cria uma em branco) e chama index
		res.redirect('/');
	},

	home: function(req, res){
			if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
				res.redirect('/');
			}else{

				var idUsuario = req.session.user.id;

		/*		_this.connection.connect(function(err){
					if(err) console.log('home - erro ao conectar com o banco de dados '+err);
				}); */

				_this.connection.query('select * from jardim where idUsuario = ?', [idUsuario],
					function(err, data){
						if (err) {
							console.log("Login - erro ao localizar conta "+err);

						}else{
							if(data.length == 0){
								res.render("home", {alert:false, jardim:false, planta:false, analise:false});	
							}else{
								var jardim = data;	

								_this.connection.query('select DATE_FORMAT(dataHora, "%d/%m/%Y %H:%i:%s") as "dataHora", valvula, consumo, clima, '+
									'statusUmidade, mediaSensores '+
									'from usuario u '+
									'inner join jardim j on j.idUsuario = u.id '+
									'inner join analise a on a.idJardim = j.id '+
									'where u.id = ? order by a.id desc limit 10', [idUsuario], function(err, data){
										if (err) {
											console.log('home - erro ao localizar analise '+err);
											res.render("home", {alert:true, msg:'erro ao carregar acompanhamento', jardim:jardim, planta:false, analise:false});	
										}else{
											if (data.length > 0) {
												var analise = data;
											
												_this.connection.query('select p.umidade_min, p.umidade_max from planta p '+
													'inner join jardim_planta jp on jp.idPlanta = p.id '+
													'inner join jardim j on j.id = jp.idJardim '+
													'where idJardim = ?', [jardim[0].id],
													function(err, data){
														if (err) {
															console.log('home - erro ao localizar plantas '+err);
															res.render("home", {alert:true, msg:'erro ao carregar acompanhamento', jardim:jardim, planta:false, analise:false});	
														}else{
															var planta = data;
															res.render("home", {alert:false, jardim:jardim, planta:planta, analise:analise});	
														}
													});
											}else{
												res.render("home", {alert:false, jardim:jardim, planta:false, analise:false});	
											}
										}
									});


							}
						}
					});	

			}
		}
	}