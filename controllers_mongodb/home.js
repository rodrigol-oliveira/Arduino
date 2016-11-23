module.exports = function(app){

	var Jardim 	= app.models.jardim;	//instancia classe Model - jardim
	var Usuario	= app.models.usuario;	//instancia classe Model - usuario
	var Planta = app.models.planta;   //instancia classe Model - Plantas
	var Analise = app.models.analise;

	var HomeController = {

		index: function(req, res){
			res.render('index', {alert:false});	
		},

		login: function(req, res){
			res.render('login', {alert:false});
		},

		home: function(req, res){
			if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
				res.redirect('/');
			}else{

				var id_usuario = req.session.user.id;

				Jardim.find({id_usuario:id_usuario}, function(err, data){
					if (err) {
						console.log('home - erro ao localizar conta '+err);
					}else{
						//if (data.length == 1) { correto
						if(data.length < 1){//somente para teste
							res.render("home", {alert:false, jardim:false, analise:false});	
						}else{
							var jardim = data;
							
							Analise.find({jardim:jardim[0].id}, function(err, data){
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
							}).limit(5);
						}


					}
				})
				
				
			}
		}
	}

	return HomeController;
}