module.exports = function(app){

	var mysql = require('mysql');

	var nodemailer  = require('nodemailer');	//midleware para envio de email
	var bCrypt      = require('bcrypt-nodejs');	//midleware para criptografar senha
	var Usuario 	= app.models.usuario;		//instancia classe Model - usuario


	var UsuarioController = {
		//metodos da classe controllers.usuario

		//metodo - login
		login: function(req, res){

			var email 	= req.body.email,
			senha 		= req.body.senha;
			
			Usuario.find({email:email}, function(err, data){
				if (err) {
					console.log("Login - erro ao localizar conta "+err);
				}else{	
					
					if (data.length === 1) {
						
						if (bCrypt.compareSync(senha, data[0].senha)){ //compara as senha (criptografia)
							var session = req.session.user ={ 
								id: data[0].id,
								nome: data[0].nome
							};
							res.redirect('/home');
						}else{
							res.render('login', {alert:true, msg:'senha inválida'});
							console.log(" senha inválida");
						}
					}else{
						res.render('login', {alert:true, msg:'email não cadastrado'});
						console.log(" email não localizado");
					}
				}
			});
		},

		cadastrar: function(req, res){ 
			var nome 	= req.body.nome,
			sobrenome	= req.body.sobrenome,
			email 		= req.body.email,
			senha 		= bCrypt.hashSync(req.body. senha),//criptografa senha a ser gravada no banco de dados
			novaConta 	= {nome, sobrenome, email, senha };
			
		//verifica email já possui conta cadastrada
		Usuario.find({email:email}, function(err, data){
			if (err) {
				console.log('cadastrar - erro ao localizar email '+err);
			}else{
		//se email já cadastrado, retorna msg sem cadastrar
		if (data.length == 1) {
			console.log('email já possu conta cadastrado');
			res.render('index', {alert:true, msg:'O email que você tentou cadastrar já possui uma conta.'})
		}else{
		//cadastra nova conta de usuario
		var model = new Usuario(novaConta);
		model.save(function(err, data){
			if (err) {
				console.log('erro ao gravar novo usuario '+err);
			}else{
				
				//após cadastrar usuario, cria-se uma sessão de login da conta e direciona para home
				var session = req.session.user ={ 
					id: data._id,
					nome: nome};

					res.redirect('/home');
				}		
			});
	}
}
});
	},

	cadastrar2: function(req, res){ 
		var nome 	= req.body.nome,
		sobrenome	= req.body.sobrenome,
		email 		= req.body.email,
			senha 		= bCrypt.hashSync(req.body. senha),//criptografa senha a ser gravada no banco de dados
			novaConta 	= {nome, sobrenome, email, senha };
			
			connection.query('select * from usuario where email = ?', [email], function(err, rows){
				if (err) throw err;
				if (rows.length === 1) {
					res.render('home', {alert:true, msg:"email ja cadastrado"});
				}else{
					connection.query('insert into usuario(nome, sobrenome, email, senha',
						[nome, sobrenome, email, senha], function(err){
							if (err) throw err;

							var session = req.session.user ={ 
								id: data._id,
								nome: nome};

								res.redirect('/home');
							})
				}
			});
		},

	//metodo - exibe página de detalhes da conta de usuário, *session
	exibir: function(req, res){
		if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
			res.redirect('/');
		}else{
			res.render('/exibirConta');
		}
	},

	//metodo - alterar dados da conta do usuário
	alterar: function(req, res){
		var id 		= req.session.user.id,
		nome 		= req.body.nome,
		sobrenome 	= req.body.sobrenome;

		Usuario.update({_id:id},{$set:{nome:nome, sobrenome:sobrenome}}, function(err, data){
			if (err) {
				console.log('alterarConta - erro ao atualizar '+err);
			}else{
				res.redirect('/home');
			}
		});
	},

	//metodo - exibe página para recuperar senha
	esqueciSenha: function(req, res){
		res.render('esquecisenha', {alert:false});
	},

	//metodo - enviar link por email para recuperar senha
	recuperarSenha: function(req, res){
		var email = req.body.email;

		Usuario.find({email:email}, function(err, data){
			if (err) {
				console.log('recuperarSenha - erro ao localizar email '+err);
			}else{
				if (data.length == 1) {	
					//cria link a ser enviado por email com o endereço do servidor e id da conta
					var link = '/redefiniremail?K='+data[0].senha.substr(5,20)+'&I='+data[0]._id
					//executa funcao que envia email
					new enviarEmailSenha(req, res, link, email);
				}else{
					res.render('esquecisenha', {alert:true, send:false, msg:'email não cadastrado'})
					console.log(" email não localizado");
				}
			}
		});
	},

	//mtodo - exibe tela redirecionada pelo link do email
	redefinirEmail: function(req, res){

		var key = req.query.K,
		id 		= req.query.I;

		var chave = {'key':key, 'id':id};

		Usuario.find({_id:id}, function(err, data){
			if(err){
				console.log('redefinirEmail - conta não localizada '+err);
			}else{
				if (data.length == 1) {
					if (data[0].senha.substr(5,20) == key) {

						res.render('redefiniremail', {key:key, id:id});
					}else{

						console.log(" redefinirEmail - substr de senha não confere");
					}
				}else{

					console.log(" redefinirEmail - conta não encontrada por Id");
				}
			}
		});
	},

	//metodo - redefine a senha do usuario pelo link enviado por email
	redefinirSenhaEmail: function(req, res){

		var key = req.body.key,
		id 		= req.body.id,
		novaSenha 	= bCrypt.hashSync(req.body.senha);
		
		Usuario.find({_id:id}, function(err, data){
			if (err) {
				console.log('redefinirSenhaEmail - erro ao localizar conta por id '+err);
			}else{
				if (data.length == 1) {
					var nome 	= data[0].nome;
					var senha 	= data[0].senha; 
					if (senha.substr(5,20) == key){
						Usuario.update({_id:id},{$set:{senha:novaSenha}}, function(err, data){
							
							if (err) {
								console.log('redefinirSenhaEmail - erro ao update senha '+err);
							}else{
								//após alterar senha, cria uma sessão de usuario e redireciona para home
								var session = req.session.user ={ 
									id: id,
									nome: nome};

									res.redirect('/home');
								}
							});						
					}else{
						console.log(" redefinirEmail - substr de senha não confere");	
						res.render('redefiniremail', {alert:true, msg:'conta a ser alterada não confere.'})
					}
				}else{
					console.log(" redefinirEmail - conta não encontrada por Id");
					res.render('redefiniremail', {alert:true, msg:'ID da conta a ser alterada não confere.'})
				}
			}
		});
	},

	//metodo - exibe tela redirecionada pelo link da página home
	redefinirHome: function(req, res){
		if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
			res.redirect('/');
		}else{
			res.render('redefinirhome');
		}
	},

	//metodo - redefinir senha pelo link da página home.
	redefinirSenhaHome: function(req, res){
		var id 	= req.session.user.id,
		senha 	= req.body.senha,
		msgerr	= 'dados invalidos';
		msgok	= 'senha alterada com sucesso'

		Usuario.find({_id:id}, function(err, data){
			if (err) {
				console.log('redefinirSenhaEmail - erro ao localizar conta por id '+err);
			}else{
				if (data.length == 1) {
					if (bCrypt.compareSync(senha, data[0].senha)) {
						Usuario.update({_id:id},{$set:{senha:senha}});
						
					}else{
						console.log(msgerr+" redefinirEmail - substr de senha não confere");	
						res.redirect('/home');
					}
				}else{
					console.log(msgerr+" redefinirEmail - conta não encontrada por Id");
					res.json(msgerr);
				}
			}
		});
	},

	//metodo - desativar conta
	desativar: function(req, res){
		
	},

	//metodo - listar todos as contas
	listar: function(req, res){
		Usuario.find(function(err, user){
			if (err) {
				console.log('erro ao listar usuarios '+err);
			}else{
				res.json(user);
			}

		});
	}
}

return UsuarioController;


   //funções app.controllers.usuario

   //função para enviar email
   function enviarEmailSenha(req, res,link,email) {

   	//cria instancia de email a ser enviado
   	var mailOptions = {
   		from: 'ionegardensystem@gmail.com', 
   		to: email, 
   		subject: 'ione Jardim Inteligente | Redefinir de Senha',
   		text: 'Para redefinir sua senha click no link: http://localhost:3000'+link
   	};


   	var transporter = nodemailer.createTransport({
   		service: 'Gmail',
   		auth: {
            user: 'ionegardensystem@gmail.com', // Your email id
            pass: 'jardim10' // Your password
        }
    });

   	transporter.sendMail(mailOptions, function(err, info){
   		if(err){
   			console.log('recuperarSenha - erro ao enviar email '+err);
   			res.render('esquecisenha', {alert:true, send:false, msg:'Falha ao enviar email, verifique sua conexão e tente mais tarde.'})
   		}else{
   			console.log('Email enviado para: '+email);
   			res.render('esquecisenha', {alert:true, send:true, msg:'Email enviado com sucesso. Acesse o link para redefinir sua senha.'})
   		}
   	});    
   };

}

