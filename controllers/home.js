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
								res.render("home", {alert:false, jardim:false, analise:false});	
							}else{
								var jardim = data;

								_this.connection.query('select * from analise where idJardim = ? limit 5', [jardim[0].id],
									function(err, data){
										if (err) {
											console.log('home - erro ao localizar analise '+err);
										}else{
											if (data.length > 0) {
												var analise = data;
												res.render("home", {alert:false, jardim:jardim, analise:analise});	
											}else{
												res.render("home", {alert:false, jardim:jardim, analise:false});	
											}
										}
									});

								
							}
						}
					});	

			}
		}
	}