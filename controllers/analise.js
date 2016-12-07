
var _this = {};
var keyprevisao = 'd18b9453b7807f16107f9e8573492a6a';
//chave individual atrelada ao usuario cadastrado no site - key previsao do tempo

module.exports = {

	setup: function(connection, request) {
		_this.connection	= connection;
		_this.request		= request;
	},

		//metodo cadadastrar analise
		cadastrar: function(req, res){

			if(req.query.umidade1 == '0'){ var sensor1 = 0}else{var sensor1	= 1023 - (parseInt(req.query.umidade1))}
				if(req.query.umidade2 == '0'){ var sensor2 = 0}else{var sensor2	= 1023 - (parseInt(req.query.umidade2))}
					if(req.query.umidade3 == '0'){ var sensor3 = 0}else{var sensor3	= 1023 - (parseInt(req.query.umidade3))}
						if(req.query.umidade4 == '0'){ var sensor4 = 0}else{var sensor4	= 1023 - (parseInt(req.query.umidade4))}

							var serial	= req.query.serial;
						var consumo = req.query.consumo;
						var valvula = req.query.valvula;

						console.log('valores recebidos: serial: '+serial)
						console.log('====================================')
						console.log('valores originais dos sensores.')
						console.log('====================================')
						console.log('sensor de umidade 1: '+req.query.umidade1)
						console.log('sensor de umidade 2: '+req.query.umidade2)
						console.log('sensor de umidade 3: '+req.query.umidade3)
						console.log('sensor de umidade 4: '+req.query.umidade4)
						console.log('====================================')
						console.log('valores convertidos.')
						console.log('====================================')
						console.log('sensor de umidade 1: '+sensor1)
						console.log('sensor de umidade 2: '+sensor2)
						console.log('sensor de umidade 3: '+sensor3)
						console.log('sensor de umidade 4: '+sensor4)
						console.log('valvula: '+valvula)
						console.log('consumo: '+consumo)
						console.log('====================================')


		//-----------------------------------------------------------------
		// valida e soma valores oriundos do jardim
		// se valor do sensor = 0 implica em sensor desligado ou danificad
		//-----------------------------------------------------------------
		var soma = 0;
		if (sensor1 > 0) {soma += sensor1};
		if (sensor2 > 0) {soma += sensor2};
		if (sensor3 > 0) {soma += sensor3};
		if (sensor4 > 0) {soma += sensor4};
		//----------------------------------------------------------------


		//identifica qual o jardim cadastrado com o serial iOne.
		_this.connection.query('select * from jardim where serial = ?', [serial], function(err, data){
			if (err) {
				console.log('cadastrarAnalise - erro ao select jardim '+err);
				res.json({erro:'erro ao localizar jardim'})
			}else{
				if (data.length === 1) {
					var jardim = data;

		//----------------------------------------------------------------
		// calcula média aritmética dos valores de umidade recebidos
		// de acordo com o numero de sensores cadastrados no jardim
		//----------------------------------------------------------------
		var mediaSensores = soma/jardim[0].qtdSensores;
		//----------------------------------------------------------------

		//consulta as caracteristicas das plantas cadastradas no jardim
		_this.connection.query('select p.umidade_min, p.umidade_max from planta p '+
			'inner join jardim_planta jp on jp.idPlanta = p.id '+
			'inner join jardim j on j.id = jp.idJardim '+
			'where idJardim = ?', [jardim[0].id],
			function(err, data){
				if (err) {
					console.log('cadastrarAnalise - erro ao consultar as plantas do jardim');
					res.json({erro: 'erro ao consultar as plantas do jardim'});
				}else{	
					var plantas = data;

		//----------------------------------------------------------------
		// calcula status de umidade do solo de acordo com
		// as características das plantas cadastradas no jardim
		//----------------------------------------------------------------
		var umidadeMin 	= parseInt(plantas[0].umidade_min),
		umidadeMax 		= parseInt(plantas[0].umidade_max),
		statusUmidade	= 'indefinido';

		if(mediaSensores < umidadeMin){ 
			statusUmidade = 'seco';
		}else if(mediaSensores > umidadeMin && mediaSensores < umidadeMax){
			statusUmidade = 'ideal';
		}else{
			statusUmidade = 'encharcado';
		}
		//----------------------------------------------------------------

		
		//----------------------------------------------------------------
		// estabelece conexão com API de previsão do tempo para
		// identificar o clima atual da localização cadastrada no jardim
		//----------------------------------------------------------------
		//var cidade = jardim[0].cidade;

		//definir codigo da cidade
		//if(typeof cidade == 'undefined'){
			//default sao paulo
		//	cidade = '3448439'; 
		//}

		var cidade = jardim[0].cidade.substring(0,7);

		//define parametro do API para obter previsao do tempo
		var path = 'http://api.openweathermap.org/data/2.5/forecast/city?id=' + cidade + '&APPID=' + keyprevisao + '&units=metric';
		
		//executa request do API 'openWeatherMap.org'
		_this.request(path, function (error, response, body){
			if (!error && response.statusCode == 200){
		//res.json(JSON.parse(body));
		var resposta = JSON.parse(body);
		//console.log(resposta.list);
		//console.log(resposta.list.length);
		
		// atribui clima da resposta do API
		// levado em consideração a descrição do clima, pois possui informações complementares
		var clima = resposta.list[0].weather[0].description;

//-------------------------------------------------------

}
		//----------------------------------------------------------------


		//----------------------------------------------------------------
		// define resposta a ser enviada ao microcontrolador para acionar
		// o sistema de irrigação. 
		// a vazão de água varia conforme o tipo de material utilizado no 
		// sistema de irrigação, bem como a pressão e a capacidade da 
		// valvula solenóide empregada. Desse modo, para efeito de protótipo,
		// definimos o tempo padrão para acionamento da valvula em 1 minuto. 
		//----------------------------------------------------------------		
		// o acionamento será realizado caso o solo esteja SECO e seu tempo 
		// varia conforme intensidade da chuva, sendo o caso.
		// sem chuva	= acionamento em 100% do tempo = 60s
		// chuva fraca	= acionamento em 70% do tempo ~= 40s
		// chuva 		= acionamento em 50% do tempo ~= 30s
		//----------------------------------------------------------------
		
		if (clima != "") {
			if(statusUmidade == 'seco'){
				if(clima.match(/light rain/) || clima.match(/drizzle/)){
					var resposta = {'acao':'70'};
				}else if(clima.match(/rain/)){
					var resposta = {'acao':'50'};
				}else{
					var resposta = {'acao':'100'};
				}
			}else{
				var resposta = {'acao':'0'};
			}
		}else{
			if(statusUmidade == 'seco'){
				var resposta = {'acao':'50'};
			}else{
				var resposta = {'acao':'0'};
			}
		}
		//----------------------------------------------------------------
		console.log('====================================')
		console.log('clima: '+clima)
		console.log('resposta do sistema ao hardware')
		console.log(resposta)

		//----------------------------------------------------------------
		// define o status da valvula
		//----------------------------------------------------------------
		// if (consumo > 0) {var valvula = 'ligada'}else{var valvula = 'desligada'}
		//----------------------------------------------------------------


		//salva os valores recebido em analise
		_this.connection.query('insert into analise(idJardim, dataHora, sensor1, sensor2, sensor3, sensor4, '+
			'mediaSensores, statusUmidade, clima, valvula, consumo) values(?, now(),?,?,?,?,?,?,?,?,?)',
			[jardim[0].id, sensor1, sensor2, sensor3, sensor4, mediaSensores,
			statusUmidade, clima, valvula, consumo], function(err){
				if (err) {
					console.log('cadastrarAnalise - erro ao salvar dados em analise '+err);
					res.json({erro: 'dados de analise não salvos'});
				}else{
					res.json(resposta);
				}
			});
	});
	}
});
}else{
	console.log('cadastrarAnalise - nenhum jardim cadastrado com serial informado');
	res.json({erro: 'nenhum jardim cadastrado com o serial informado'});
}
}
});

},

// ------------------------------------------------------------------------------------------
// métodos referentes aos relatórios
// ------------------------------------------------------------------------------------------

//pagina inicial de relatorios
index: function(req, res){
			if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
				res.redirect('/');
			}else{
				res.render('relatorio', {alert:false});
			}
		},

		consumo: function(req, res){
			var idUsuario = req.session.user.id,
			inicio = req.body.inicio,
			fim	   = req.body.fim;


			if(inicio == '' || fim == ''){

				_this.connection.query('select DATE_FORMAT(dataHora, "%d/%m/%Y %H:%i:%s") as "dataHora", valvula, consumo, clima '+
					'from usuario u '+
					'inner join jardim j on j.idUsuario = u.id '+
					'inner join analise a on a.idJardim = j.id '+
					'where u.id = ? order by a.id desc ', [idUsuario], function(err, data){
						if (err) {
							console.log('relatorioConsumo - erro select analise '+err);
							res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.',soma:false, resultado:false})
						}else{
							var resultado = data;
							if (resultado.length > 0) {

								_this.connection.query('select sum(consumo) as "soma" '+
									'from usuario u '+
									'inner join jardim j on j.idUsuario = u.id '+
									'inner join analise a on a.idJardim = j.id '+
									'where u.id = ?', [idUsuario], function(err,data){
										if (err) {
											console.log('relatorioConsumo - erro sum consumo '+err);
											res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', resultado:false})
										}else{
											var soma = data;
											console.log(soma)
											if (soma.length > 0) {
												res.render('resultado', {alert:false, resultado:resultado, soma: soma, tipo:'consumo'});
											}else{
												res.render('resultado', {alert:false, resultado:resultado, soma: false, tipo:'consumo'});	
											}
										}
									})
							}else{
								res.render('resultado', {alert:true, msg:'Não existe resultado para esse período',soma: false, resultado:false, tipo:'consumo'});
							}
						}
					});
			}else{


				inicio = inicio.substring(6)+"-"+inicio.substring(3,5)+"-"+inicio.substring(0,2);
				fim = fim.substring(6)+"-"+fim.substring(3,5)+"-"+fim.substring(0,2)+" 23:59:59";


				_this.connection.query('select DATE_FORMAT(dataHora, "%d/%m/%Y %H:%i:%s") as "dataHora", valvula, consumo, clima '+
					'from usuario u '+
					'inner join jardim j on j.idUsuario = u.id '+
					'inner join analise a on a.idJardim = j.id '+
					'where u.id = ? and '+
					'a.dataHora between ? and ? order by a.id desc; ', [idUsuario, inicio, fim], function(err, data){
						if (err) {
							console.log('relatorioConsumo - erro select analise '+err);
							res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', soma:false, resultado:false})
						}else{
							var resultado = data;
							if (resultado.length > 0) {
								_this.connection.query('select sum(consumo) as "soma" '+
									'from usuario u '+
									'inner join jardim j on j.idUsuario = u.id '+
									'inner join analise a on a.idJardim = j.id '+
									'where u.id = ? and a.dataHora between ? and ?', [idUsuario, inicio, fim], function(err,data){
										if (err) {
											console.log('relatorioConsumo - erro sum consumo '+err);
											res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', resultado:false})
										}else{
											var soma = data;
											if (soma.length > 0) {
												console.log(soma)
												res.render('resultado', {alert:false, resultado:resultado, soma: soma, tipo:'consumo'});
											}else{
												res.render('resultado', {alert:false, resultado:resultado, soma: false, tipo:'consumo'});	
											}
										}
									});
							}else{
								res.render('resultado', {alert:true, msg:'Não existe resultado para esse período',soma:false, resultado:false, tipo:'consumo'});
							}
						}
					});
			}
		},

		umidade: function(req, res){
			var idUsuario = req.session.user.id,
			inicio = req.body.inicio,
			fim	   = req.body.fim;


			if(inicio == '' || fim == ''){

				_this.connection.query('select DATE_FORMAT(dataHora, "%d/%m/%Y %H:%i:%s") as "dataHora", statusUmidade, mediaSensores, clima, umidade_min, umidade_max '+
					'from usuario u '+
					'inner join jardim j on j.idUsuario = u.id '+
					'inner join jardim_planta jp on jp.idJardim = j.id '+
					'inner join planta p on p.id = jp.idPlanta '+
					'inner join analise a on a.idJardim = j.id '+
					'where u.id = ? order by a.id desc ', [idUsuario], function(err, data){
						if (err) {
							console.log('relatorioConsumo - erro select analise '+err);
							res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.',soma:false,soma:false,soma:false, resultado:false})
						}else{
							var resultado = data;
							if (resultado.length > 0) {
								res.render('resultado', {alert:false, resultado:resultado, soma:false,soma:false,tipo:'umidade'});	
							}else{
								res.render('resultado', {alert:true, msg:'Não existe resultado para esse período', soma:false,resultado:false, tipo:'umidade'});
							}
						}
					});
			}else{

				inicio = inicio.substring(6)+"-"+inicio.substring(3,5)+"-"+inicio.substring(0,2);
				fim = fim.substring(6)+"-"+fim.substring(3,5)+"-"+fim.substring(0,2)+" 23:59:59";

				_this.connection.query('select DATE_FORMAT(dataHora, "%d/%m/%Y %H:%i:%s") as "dataHora", statusUmidade, mediaSensores, clima, umidade_min, umidade_max '+
					'from usuario u '+
					'inner join jardim j on j.idUsuario = u.id '+
					'inner join jardim_planta jp on jp.idJardim = j.id '+
					'inner join planta p on p.id = jp.idPlanta '+
					'inner join analise a on a.idJardim = j.id '+
					'where u.id = ? and '+
					'a.dataHora between ? and ? order by a.id desc; ', [idUsuario, inicio, fim], function(err, data){
						if (err) {
							console.log('relatorioConsumo - erro select analise '+err);
							res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', soma:false,resultado:false})
						}else{
							var resultado = data;
							if (resultado.length > 0) {
								res.render('resultado', {alert:false, resultado:resultado,soma:false, tipo:'umidade'});	
							}else{
								res.render('resultado', {alert:true, msg:'Não existe resultado para esse período',soma:false, resultado:false, tipo:'umidade'});
							}
						}
					});
			}
		},

		completo: function(req, res){
			var idUsuario = req.session.user.id,
			inicio = req.body.inicio,
			fim	   = req.body.fim;


			if(inicio == '' || fim == ''){

				_this.connection.query('select DATE_FORMAT(dataHora, "%d/%m/%Y %H:%i:%s") as "dataHora", valvula, consumo, clima, umidade_min, umidade_max, '+
					'statusUmidade, mediaSensores '+
					'from usuario u '+
					'inner join jardim j on j.idUsuario = u.id '+
					'inner join jardim_planta jp on jp.idJardim = j.id '+
					'inner join planta p on p.id = jp.idPlanta '+
					'inner join analise a on a.idJardim = j.id '+
					'where u.id = ? order by a.id desc', [idUsuario], function(err, data){
						if (err) {
							console.log('relatorioConsumo - erro select analise '+err);
							res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.',soma:false, resultado:false})
						}else{
							var resultado = data;
							if (resultado.length > 0) {
								_this.connection.query('select sum(consumo) as "soma" '+
									'from usuario u '+
									'inner join jardim j on j.idUsuario = u.id '+
									'inner join analise a on a.idJardim = j.id '+
									'where u.id = ?', [idUsuario], function(err,data){
										if (err) {
											console.log('relatorioConsumo - erro sum consumo '+err);
											res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', resultado:false})
										}else{
											var soma = data;
											console.log(soma)
											if (soma.length > 0) {
												res.render('resultado', {alert:false, resultado:resultado, soma: soma, tipo:'completo'});
											}else{
												res.render('resultado', {alert:false, resultado:resultado, soma: false, tipo:'completo'});	
											}
										}
									})
							}else{
								res.render('resultado', {alert:true, msg:'Não existe resultado para esse período', soma:false,resultado:false, tipo:'completo'});
							}
						}
					});
			}else{
				inicio = inicio.substring(6)+"-"+inicio.substring(3,5)+"-"+inicio.substring(0,2);
				fim = fim.substring(6)+"-"+fim.substring(3,5)+"-"+fim.substring(0,2)+" 23:59:59";

				_this.connection.query('select DATE_FORMAT(dataHora, "%d/%m/%Y %H:%i:%s") as "dataHora", valvula, consumo, clima, umidade_min, umidade_max, '+
					'statusUmidade, mediaSensores '+
					'from usuario u '+
					'inner join jardim j on j.idUsuario = u.id '+
					'inner join jardim_planta jp on jp.idJardim = j.id '+
					'inner join planta p on p.id = jp.idPlanta '+
					'inner join analise a on a.idJardim = j.id '+
					'where u.id = ? and '+
					'a.dataHora between ? and ? order by a.id desc; ', [idUsuario, inicio, fim], function(err, data){
						if (err) {
							console.log('relatorioConsumo - erro select analise '+err);
							res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', soma:false,resultado:false})
						}else{
							var resultado = data;
							if (resultado.length > 0) {
								_this.connection.query('select sum(consumo) as "soma" '+
									'from usuario u '+
									'inner join jardim j on j.idUsuario = u.id '+
									'inner join analise a on a.idJardim = j.id '+
									'where u.id = ? and a.dataHora between ? and ?', [idUsuario, inicio, fim], function(err,data){
										if (err) {
											console.log('relatorioConsumo - erro sum consumo '+err);
											res.render('relatorio', {alert:true, msg:'erro ao pesquisar, tente novamente.', resultado:false})
										}else{
											var soma = data;
											console.log(soma)
											if (soma.length > 0) {
												res.render('resultado', {alert:false, resultado:resultado, soma: soma, tipo:'completo'});
											}else{
												res.render('resultado', {alert:false, resultado:resultado, soma: false, tipo:'completo'});	
											}
										}
									})
							}else{
								res.render('resultado', {alert:true, msg:'Não existe resultado para esse período',soma:false, resultado:false, tipo:'completo'});
							}
						}
					});
			}
		}
	}