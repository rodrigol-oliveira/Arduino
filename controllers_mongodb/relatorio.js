module.exports = function(app){

	var Analise = app.models.analise;

	var RelatorioController = {

		index: function(req, res){
			if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
				res.redirect('/');
			}else{
				res.render('relatorio', {alert:false});
			}
		},

		consumo: function(req, res){
			var inicio = req.body.inicio,
			fim	   = req.body.fim;


			if(inicio == '' || fim == ''){

				Analise.find({},{data_cad:1, clima:1, consumo_agua:1}, function(err, data){
					if (err) {
						console.log('consumo - erro ao buscar valores '+err);
						res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', resultado:false})
					}else{
						res.render('resultado', {alert:false, resultado:data, tipo:'consumo'});
					}
				})
			}else{
				inicio = new Date(inicio);
				fim	   = new Date(fim+" 23:59:59");

				console.log(inicio, fim)
				Analise.find({$and:[{data_cad:{$gte:inicio}},{data_cad:{$lte:fim}}]},{data_cad:1, clima:1, consumo_agua:1},
					function(err, data){
						if (err) {
							console.log('consumo - erro ao buscar valores em príodo '+err);
							res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', resultado:false})
						}else{
							res.render('resultado', {alert:false, resultado:data, tipo:'consumo'});
						}
					})
			}
		},

		umidade: function(req, res){
			var inicio = req.body.inicio,
			fim	   = req.body.fim;


			if(inicio == '' || fim == ''){

				Analise.find({},{data_cad:1, clima:1, valor_sensores:1, status_solo:1}, function(err, data){
					if (err) {
						console.log('umidade - erro ao buscar valores '+err);
						res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', resultado:false})
					}else{
						res.render('resultado', {alert:false, resultado:data, tipo:'umidade'});
					}
				})
			}else{
				inicio = new Date(inicio);
				fim	   = new Date(fim+" 23:59:59");

				console.log(inicio, fim)
				Analise.find({$and:[{data_cad:{$gte:inicio}},{data_cad:{$lte:fim}}]},{data_cad:1, clima:1, valor_sensores:1, status_solo:1},
					function(err, data){
						if (err) {
							console.log('umidade - erro ao buscar valores em príodo '+err);
							res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', resultado:false})
						}else{
							res.render('resultado', {alert:false, resultado:data, tipo:'umidade'});
						}
					})
			}
		},

		completo: function(req, res){
			var inicio = req.body.inicio,
			fim	  	   = req.body.fim;


			if(inicio == '' || fim == ''){

				Analise.find(function(err, data){
					if (err) {
						console.log('completo - erro ao buscar valores '+err);
						res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', resultado:false})
					}else{
						res.render('resultado', {alert:false, resultado:data, tipo:'completo'});
					}
				})
			}else{
				inicio = new Date(inicio);
				fim	   = new Date(fim+" 23:59:59");

				Analise.find({$and:[{data_cad:{$gte:inicio}},{data_cad:{$lte:fim}}]}, function(err, data){
						if (err) {
							console.log('completo - erro ao buscar valores em príodo '+err);
							res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', resultado:false})
						}else{
							res.render('resultado', {alert:false, resultado:data, tipo:'completo'});
						}
					})
			}
		}
	}

	return RelatorioController;

}