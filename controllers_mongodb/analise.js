module.exports = function(app){

	//midleware de previsao do tempo
	var request		= require('request');
	//chave individual atrelada ao usuario cadastrado no site - key previsao do tempo
	var keyprevisao	= 'd18b9453b7807f16107f9e8573492a6a';
	//instancia as classes models


	var AnaliseController = {
		
		//metodo cadadastrar analise
		cadastrar: function(req, res){

		//trata possível erro no recebimento do valor do sensor e atribui a  variavel valor_sensores.
		if(req.query.umidade1==null || Number.isNaN(umidade1)){
			var valor_sensores	= 0;
		}else{
			var valor_sensores	= parseInt(req.query.umidade1);
		}
		var serial_ione		= req.query.serial;
		var consumo_agua	= req.query.consumo;
		var status_solo		= new calculaStatus(valor_sensores, serial_ione);

		//consulta jardim com serial enviado pelo hardware
		Jardim.find({serial_ione:serial_ione}, function(err, data){
			if (err) {
				console.log('cadastrarAnalise - erro pesquisar jardim por serial '+err);
			}else{
				var jardim = data[0].id,
				cidade = data[0].cidade;

					//definir codigo da cidade
					if(typeof cidade == 'undefined'){
						cidade = '3448439'; //default sao paulo
					}

					//define parametro do API para obter previsao do tempo
					var path = 'http://api.openweathermap.org/data/2.5/forecast/city?id=' + cidade + '&APPID=' + keyprevisao + '&units=metric';

					//executa request do API 'openWeatherMap.org'
					request(path, function (error, response, body){
						if (!error && response.statusCode == 200){
							//res.json(JSON.parse(body));
							var resposta = JSON.parse(body);
							//console.log(resposta.list);
							//console.log(resposta.list.length);
							
							// atribui clima da resposta do API
							var clima = resposta.list[0].weather[0].description;

							var novaAnalise = {jardim, nome, clima, valor_sensores, status_solo, consumo_agua};
							var model 		= new Analise(novaAnalise);
							//grava analise no banco de dados
							model.save(function(err, data){
								if (err) {
									console.log('erro ao gravar nova analise '+err);
								}else{
									console.log('analise gravada com sucesso.');
									//define resposta ao hardware
									var resposta = new resposta(status_solo, clima);
									res.json(resposta);
								}
							});
						}
					});	
				}
			});
	},

		//metodo editar analise
		editar: function(req, res){
			//fora do escopo
		},

		//metodo deletar analise
		deletar: function(req, res){
			//fora do escopo
		},

		//metodo listar analise
		listar: function(req, res){

		},

	}
	return AnaliseController;

	//funções app.controller.analise

	//função que calcula o status do solo conforme o grupo do jardim
	function calculaStatus(valor, serial){
		Planta.find({jardim:{$exist:true}}, function(err, data){
			if(err){
				console.log('func calculaStatus - erro ao pesquisar planta associada a jardim '+err);
			}else{
				if (data.length > 0) {
					var umidade_minima = parseInt(data[0].umidade_minima);
					if (valor >= umidade_minima) {
						var status = 'umido';
					}else{
						var status = 'seco';
					}
					return status;
				}else{
					var status = 'indefinido' 
				}
				return status;
			}
		});
	}

	function resposta(status, clima){
		//verifica candiçõa do solo
		if (status == 'seco') {
			//verifica intensidade da chuva
			if(clima.match(/light rain/)){
				//atribui 70% do tempo de acionamento da valvula
				var response = {'acao':'70'};
			}else if(clima.match(/rain/)){
				//atribui 50% do tempo de acionamento da valvula
				var response = {'acao':'50'};
			}else{
				//atribui 100% do tempo de acionamento da valvula
				var response = {'acao':'100'};
			}
		}else{
			//não aciona a valvula
			var resposta = {'acao':'0'};
		}

		return resposta;
	}
}