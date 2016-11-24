var _this = {};

module.exports = {

	setup: function(connection, bCrypt, nodemailer) {
		_this.connection = connection;
		_this.bCrypt = bCrypt;
		_this.nodemailer = nodemailer;
	},

	login: function(req, res){

		var email 	= req.body.email,
		senha 		= req.body.senha;

			//Chama Metodo de Conexão ao executar app
			/*		_this.connection.connect(function(err){
					if(err) console.log('home - erro ao conectar com o banco de dados '+err);
				}); */

				_this.connection.query('select * from usuario where email = ?', [email], function(err, data){
					if (err) {
						console.log("Login - erro ao localizar conta "+err);
					}else{	
						if (data.length === 1) {

						if (_this.bCrypt.compareSync(senha, data[0].senha)){ //compara as senha (criptografia)
							var session = req.session.user ={ 
								id: data[0].id,
								nome: data[0].nome,
								sobrenome: data[0].sobrenome,
								email: data[0].email
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
				senha 		= _this.bCrypt.hashSync(req.body. senha);//criptografa senha a ser gravada no banco de dados

		//verifica email já possui conta cadastrada

	/*		_this.connection.connect(function(err){
					if(err) console.log('home - erro ao conectar com o banco de dados '+err);
				}); */
				_this.connection.query('select * from usuario where email = ?', [email], function(err, data){
					if (err) {
						console.log('cadastrar - erro ao localizar email '+err);
					}else{
						if (data.length == 1) {
							console.log('email já possu conta cadastrado');
							res.render('index', {alert:true, msg:'O email que você tentou cadastrar já possui uma conta.'})
						}else{
							_this.connection.query('insert into usuario(nome, sobrenome, email, senha) '+
								'values(?,?,?,?)', [nome, sobrenome, email, senha], function(err){
									if (err) {
										console.log('erro ao gravar novo usuario '+err);
									}else{
										_this.connection.query('select * from usuario where email = ?', [email], function(err, data){
											if (err) {
												console.log('erro ao gravar novo usuario '+err);
											}else{
												
												var session = req.session.user = { 
													id: data[0].id,
													nome: nome,
													sobrenome: sobrenome,
													email: email
												}
												res.redirect('/home');
											}
										});
									}
								});
								//após cadastrar usuario, cria-se uma sessão de login da conta e direciona para home
								
							}
						}		
					});
			},

			minhaconta: function(req, res){
		if(!req.session.user || !req.session.user.nome || !req.session.user.id){ //session
			res.redirect('/');
		}else{

			var nome = req.session.user.nome,
			sobrenome = req.session.user.sobrenome,
			email = req.session.user.email;

			res.render('minhaconta', {alert:false, nome:nome, sobrenome:sobrenome, email:email});

			
		}
	},

	//metodo - alterar dados da conta do usuário
	alterar: function(req, res){
		var id 		= req.session.user.id,
		nome 		= req.body.nome,
		sobrenome 	= req.body.sobrenome;

		/*		_this.connection.connect(function(err){
					if(err) console.log('home - erro ao conectar com o banco de dados '+err);
				}); */

				_this.connection.query('update usuario set nome = ?, sobrenome = ? where id = ?', [nome, sobrenome, id], 
					function(err, data){
						if (err) {
							console.log('alterar - erro alterar dados '+err);
						}else{
							_this.connection.query('select * from usuario where id = ?', [id], function(err, data){
								if (err) {
									console.log('alterar - erro buscar novos dados '+err);
								}else{
									var session = req.session.user ={ 
										id: data[0].id,
										nome: data[0].nome,
										sobrenome: data[0].sobrenome,
										email: data[0].email
									};
									nome 		= req.body.nome,
									sobrenome 	= req.body.sobrenome,
									email 	= req.body.email;
									res.render('minhaconta', {alert:true, msg:'Dados alterados com sucesso', nome:nome, sobrenome:sobrenome, email:email});
								}
							})

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

		/*		_this.connection.connect(function(err){
					if(err) console.log('home - erro ao conectar com o banco de dados '+err);
				}); */

				_this.connection.query('select * from usuario where email = ?', [email], function(err, data){
					if (err) {
						console.log('recuperarSenha - erro ao localizar email '+err);
					}else{
						if (data.length == 1) {	
					//cria link a ser enviado por email com o endereço do servidor e id da conta
					var link = '/redefiniremail?K='+data[0].senha.substr(5,20)+'&I='+data[0].id
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

		_this.connection.query('select * from usuario where id = ?', [id], function(err, data){
			if (err) {
				console.log('redefinirEmail - erro ao localizar conta por id '+err);
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
		novasenha 	= _this.bCrypt.hashSync(req.body.novasenha);

		/*		_this.connection.connect(function(err){
					if(err) console.log('home - erro ao conectar com o banco de dados '+err);
				}); */

				_this.connection.query('select * from usuario where id = ?', [id], function(err, data){
					if (err) {
						console.log('redefinirSenhaEmail - erro ao localizar conta por id '+err);
					}else{
						if (data.length == 1) {
							var nome 	= data[0].nome;
							var senha 	= data[0].senha; 
							if (senha.substr(5,20) == key){

								_this.connection.query('update usuario set senha = ? where id = ?', [novasenha, id],
									function(err){
										if (err) {
											console.log('redefinirSenhaEmail - erro ao update senha '+err);
										}else{
								//após alterar senha, cria uma sessão de usuario e redireciona para home
								var session = req.session.user ={ 
									id: id,
									nome: nome,
									sobrenome: data[0].sobrenome,
									email: data[0].email
								};

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
			res.render('redefinirhome', {alert:false});
		}
	},

	//criar pálgina com alert
	//metodo - redefinir senha pelo link da página home.
	redefinirSenhaHome: function(req, res){
		var id 	= req.session.user.id,
		senha 	= req.body.senha,
		novasenha 	= _this.bCrypt.hashSync(req.body.novasenha);
		
	/*		_this.connection.connect(function(err){
					if(err) console.log('home - erro ao conectar com o banco de dados '+err);
				}); */

				_this.connection.query('select * from usuario where id = ?', [id], function(err, data){
					if (err) {
						console.log('redefinirSenhaEmail - erro ao localizar conta por id '+err);
					}else{
						if (data.length == 1) {
							if (_this.bCrypt.compareSync(senha, data[0].senha)) {

								_this.connection.query('update usuario set senha = ? where id = ?', [novasenha, id],
									function(err){
										if (err) {
											console.log('redefinirSenhaEmail - erro ao update senha '+err);
										}else{
											res.render('redefinirhome', {alert:true, msg:'senha alterada com sucesso'} )
										}
									});		

							}else{
								console.log(" redefinirEmail - substr de senha não confere");	
								res.render('redefinirhome', {alert:true, msg:'senha atual não confere'} )
							}
						}else{
							console.log(" redefinirEmail - conta não encontrada por Id");
							res.render('redefinirhome', {alert:true, msg:'erro ao identificar conta'} )
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


   	var transporter = _this.nodemailer.createTransport({
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
   }

   



