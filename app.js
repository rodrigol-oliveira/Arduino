	var express = require('express');
	var ejs = require('ejs');
	var mysql = require('mysql');
	var bodyParser = require('body-parser');
	var path = require('path');
	var session = require('express-session'); <!-- cria uma instancia em branco  - framework -->
	var bcrypt = require('bcrypt-nodejs'); <!-- criptografia-->
	
	/*
    people = ['geddy', 'neil', 'alex'];
    html = ejs.render('<%= people.join(", "); %>', {people: people});
    */

    var app = express();
    app.set('view engine', 'ejs');
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(bodyParser.json())
    app.set('views', __dirname + '/views');
    app.use(express.static('public'));
    app.locals.pretty = true;
    app.use(express.static(__dirname + '/views'));
	//da linha 19 a 24 se refere a seção, impedindo que acesse as paginas internas sem logar
	app.set('trust proxy', 1)
	app.use(session({
		secret: 'secret cat',
		resave: false,
		saveUninitialized: true,
	}));


//Metodo de conexão
var connection = mysql.createConnection({
	host		: 'localhost',
	user		: 'root',
	password	: 'root',
	database	: 'arduino'
});


//Pagina requisita pagina inicial - ok
app.get('/',function(req,res){
	res.render('index', {message: ''});
});

//metodo requisita pagina de Login - ok
app.get('/viewIniciar', function(req,res){
	res.render('iniciar', {message: ''});
});

//Metodo requisita pagina de cadastro - ok
app.get('/viewRegistrar',function(req,res){
	res.render('registrar');
});

//Metodo requisita pagina de detalhes do jardim
app.get('/viewAlterarJardim',function(req,res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{
		var id = req.session.user.id;
		connection.query('SELECT * FROM planta;',
			function(err, rows){
				if (err) {
					console.log('erro ao select plantas cadastradas para pagina alterar jardim');
					throw err;
				}else{
					var plantas = rows;

					connection.query('SELECT j.nome_jardim, j.estado, j.cidade, p.id, p.nome_planta, g.nome_grupo '+ 
						'from jardim j '+ 
						'inner join usuario u on u.id = j.id_usuario '+
						'inner join jardim_planta jp on jp.id_jardim = j.id '+
						'inner join planta p on p.id = jp.id_planta '+
						'inner join grupo_planta gp on gp.id_planta = p.id '+
						'inner join grupo g on g.id = gp.id_grupo '+
						'where u.id = ?;',[id],
						function(err,rows){
							if(err) throw err;

							var nome_jardim = rows[0].nome_jardim;
							var estado = rows[0].estado;
							var cidade = rows[0].cidade;
							var planta = rows[0].nome_planta;
							var grupo = rows[0].nome_grupo;
							var id_planta = rows[0].id;

							res.render('alterarJardim', 
								{plantas:plantas, id:id, nome_jardim:nome_jardim, 
									estado:estado, cidade:cidade, planta:planta, 
									grupo:grupo, id_planta:id_planta});
							
						});
				}
			});
	}

});


//metodo requisita pagina de Login
app.get('/sair', function(req, res){
	var session = req.session.user = {}; //finaliza a seção (cria uma em branco) e chama index
	res.redirect('/');
});


//Metodo requisita pagina de redefinir senha
app.get('/viewRedefinir',function(req,res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{
		var nome = req.session.user.nome;

		res.render('redefinir', {nome: nome});	
	}
});

//Metodo requisita pagina principal
app.get('/viewPrincipal', function(req,res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{		
		var nome = req.session.user.nome;
		var id = req.session.user.id;

		connection.query('SELECT id FROM jardim WHERE id_usuario = ?', [id],
			function(err,rows){
				if (err) throw err;
				var jardim = rows;

				if (jardim.length == 0) {
					res.render('principal', {nome:nome, jardim:jardim})
				}else{
					connection.query('SELECT j.nome_jardim, j.estado, j.cidade, p.nome_planta, g.nome_grupo '+ 
						'from jardim j '+ 
						'inner join usuario u on u.id = j.id_usuario '+
						'inner join jardim_planta jp on jp.id_jardim = j.id '+
						'inner join planta p on p.id = jp.id_planta '+
						'inner join grupo_planta gp on gp.id_planta = p.id '+
						'inner join grupo g on g.id = gp.id_grupo '+
						'where u.id = ?;',[id],
						function(err,rows){
							if(err) throw err;
							var nome_jardim = rows[0].nome_jardim;
							var estado = rows[0].estado;
							var cidade = rows[0].cidade;
							var planta = rows[0].nome_planta;
							var grupo = rows[0].nome_grupo;

							res.render('principal', 
								{nome:nome, jardim:jardim, nome_jardim:nome_jardim, 
									estado:estado, cidade:cidade, planta:planta, 
									grupo:grupo, results:''})

						});
				}
			}); 	
	}
});



//Metodo requisita pagina de dados caddastrais
app.get('/viewNovoJardim', function(req, res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{
		connection.query('SELECT * FROM planta;',
			function(err, rows){
				if (err) {
					console.log('erro ao select plantas cadastradas para pagina novo jardim');
					throw err;
				}else{
					var plantas = rows;
					res.render('novoJardim',{plantas:plantas});
				}
			});
	}
});


//metod que verifica as credenciais da conta
app.post('/validar', function(req, res) {
	var email = req.body.email;
	var senha = req.body.senha;

	connection.query('SELECT * FROM usuario WHERE email = ?;', [ email ] , 
		function(err, rows){
			if(err) throw err;
			if(rows.length === 1){
				var id = rows[0].id;
				var nome = rows[0].nome;
				var pwd = rows[0].senha;
				
				if(bcrypt.compareSync(senha, pwd)){ // metodo da biblioteca que compara as senhas
					var session = req.session.user = {
						id: id,
						nome: nome
					};
					res.redirect('/viewPrincipal');
				}else{
					res.send("Dados inválidos");//senha inválida
				}
			}else{
				res.send("Dados inválidos");//user não cadastrado
			}
		});
});


//metodo de adicionar usuario no BD
app.post('/registrar',function(req, res){
	var nome = req.body.nome;
	var email = req.body.email;
	var senha = req.body.senha;
	var hash = bcrypt.hashSync(senha); //criptografia
	connection.query('INSERT INTO usuario(nome, email, senha) VALUES (?,?,?);', [ nome, email, hash ] , 
		function(err, res){
			if(err) throw err;
		});
	res.render('iniciar');
});

//metodo altera o jardim - ainda dá para melhorar a query com update inner join
app.post('/alterarJardim', function(req,res){

	var id = req.session.user.id;
	var planta = req.body.planta;
	var novonome = req.body.nome;
	var id_jardim;

	connection.query('UPDATE jardim SET nome_jardim = ? WHERE id_usuario = ?;', [novonome, id],
		function(err, res){
			if(err)	throw err;
		});

	connection.query('SELECT * from jardim WHERE id_usuario = ?;', [id],
		function(err, rows){
			if(err) throw err;
			id_jardim = rows[0].id;
		});

	connection.query('UPDATE jardim_planta SET id_planta = ? WHERE id_jardim = ?', [planta, id_jardim],
		function(res, err){
			if(err)	throw err;
		});

	res.redirect('viewPrincipal');
});

/*
connection.query('SELECT id from jardim WHERE id_usuario = ?;', [id],
		function(res, rows){
			if(err) throw err;

			var id_jardim = rows[0].id;

			connection.query('UPDATE jardim_planta SET id_planta = ? WHERE id_jardim = ?;', [planta, id_jardim],
				function(res, err){
					if(err)	throw err;

					res.redirect('viewPrincipal', {});
				});
		});
		*/

//metodo deletar jardim
app.get('/deletarJardim', function(req, res){

	var nome = req.session.user.nome;
	var id = req.session.user.id;

	connection.query('select * from jardim where id_usuario = ?', [id],
		function(err, rows){
			if (err) throw err;
			var id_jardim = rows[0].id;

			connection.query('delete from jardim_planta where id_jardim=?', [id_jardim],
				function(res, err){
					if (err) throw err;
				});

			connection.query('delete from jardim where id_usuario=?', [id],
				function(res, err){
					if(err) throw err;

					res.render('viewPrincipal', {nome:nome, id:id});
				});
		});
});


//metodo registra novo jardim no bano ainda da para melhorar a query com insert inner
app.post('/novoJardim',function(req, res){
	var id_usuario = req.session.user.id;
	var nome = req.body.nome;
	var pais = req.body.pais;
	var estado = req.body.estado;
	var cidade = req.body.cidade;
	var planta = req.body.planta;
	
	connection.query('INSERT INTO jardim (id_usuario, nome_jardim, pais, estado, cidade) VALUES (?,?,?,?,?);',
		[ id_usuario, nome, pais, estado, cidade ] , 
		function(err, res){
			if(err) {
				console.log('erro ao cadastrar jardim');
				throw err;
			}else{
				connection.query('SELECT * FROM jardim WHERE id_usuario = ?;' , [id_usuario],
					function(err, rows){
						if(err){
							console.log('erro ao pesquisar jardim cadastrado pelo usuario');
							throw err;	
						} else{
							var id = rows[0].id;
							console.log(id);
							connection.query('INSERT INTO jardim_planta(id_jardim, id_planta) VALUES (?,?);',
								[id, planta],
								function(err,res){
									if(err)
										console.log('erro ao cadastrar jardim_planta');
									throw err;	
									

								});
						}
					});
			}
		});
	res.redirect('/viewPrincipal');
});


//Chama Metodo de Conexão ao executar app
connection.connect(function(err){
	if(err) throw err;
	console.log('Conectado no MySQL'); 	
	app.listen(3000, function(){
		console.log('Servidor Arduino -> http://localhost:3000');
	});
});
