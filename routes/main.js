module.exports = function(app){

	
	
	var home		= app.controllers.home;
	var usuario		= app.controllers.usuario;
	var jardim 		= app.controllers.jardim;
/*	var analise 	= app.controllers.analise;
	var relatorio 	= app.controllers.relatorio;
	*/

	//express-session: cria seção de usuario, impedindo que acesso páginas internas sem estar logado.
	
	//rotas - pagina principal 
	app.get('/', home.index);
	app.get('/login', home.login);
	app.get('/home', home.home); //*session
	app.get('/sair', home.sair); 

	//rotas - usuario
	app.post('/login', usuario.login);								//rota - login no sistema
	app.post('/cadastrarUsuario', usuario.cadastrar);				//rota - cadastrar novo usuario
	app.get('/minhaconta', usuario.minhaconta)						//rota - exibe página detalhes da conta
	app.post('/alterar', usuario.alterar);							//rota - alterar dados da conta
	app.get('/esqueciSenha', usuario.esqueciSenha);					//rota - exibe página para inserir email de recuperação
	app.post('/recuperarSenha', usuario.recuperarSenha);			//rota - Envia email para recuperar senha (link email)
	app.get('/redefiniremail', usuario.redefinirEmail);				//rota - exibe página para inserir nova senha (link email)
	app.post('/redefinirSenhaEmail', usuario.redefinirSenhaEmail);	//rota - redefine senha (link email)
	app.get('/redefinirHome', usuario.redefinirHome);//*session		//rota - exibe página para inserir nova senha (link home)
	app.post('/redefinirSenhaHome', usuario.redefinirSenhaHome);	//rota - redefine senha (link home)
	app.post('/desativarConta', usuario.desativar);					//rota - desativar conta de usuario
	app.get('/listarUsuarios', usuario.listar);						//rota - listar todos usuarios
	
	//rotas - jardim
	app.get('/meujardim', jardim.meujardim);						//rota - exibe página para cadastro de jardim
	app.post('/cadastrarJardim', jardim.cadastrar);					//rota - cadastrar jardim
	//app.get('/exibirJardim', jardim.exibir);						//rota - exibe página com detalhes do jardim
	app.post('/alterarJardim', jardim.editar);						//rota - alterar dados do jardim
	app.post('/deletarJardim', jardim.deletar);						//rota - deletar Jardim
	app.post('/listarJardins', jardim.listar);						//rota - listar todos jardins
	
	//rotas - analise (interação com hardware)
/*	app.post('/cadastrarAnalise', analise.cadastrar);				//rota - cadastrar analise
	app.post('/alterarAnalise', analise.editar);					//rota - editar analise
	app.post('/deletarAnalise', analise.deletar);					//rota - deletar analise
	app.post('/listarAnalises', analise.listar);					//rota - listar analises
	
	//rotas - relatorios
	app.get('/relatorio', relatorio.index);							//rota - exibe página com opções de relatorios
	app.post('/consumo', relatorio.consumo);						//rota - lista informações de consumo de água
	app.post('/umidade', relatorio.umidade);						//rota - lista informações de umidade do solo
	app.post('/completo', relatorio.completo);						//rota - lista informações gerais
*/
}

/*
campos devem ser inseridos na pagina definir nova senha encaminhada por email
<input type="hidden" name="key" value="<%- key %>" >
<input type="hidden" name="id" value="<%- id %>" >
*/