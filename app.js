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
	//password	: 'root',//Valter
	password	: 'root', //Rodrigo
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
app.get('/viewPrincipal', function(req, res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{
		nome = req.session.user.nome;
		var id = req.session.user.id;
		

		connection.query('SELECT * FROM jardim where id_usuario = ?', [id] ,
			function(err, rows){
				if(err) throw err;
				var jardim = rows;

				connection.query('SELECT valor FROM agua limit 5 ',function(err, rows,fields) {
					if(err) throw err;
					results=rows;

					res.render('principal', {nome:nome, jardim:jardim, results: results});
					
				});
			});
	}
	
});

//Metodo requisita pagina de dados caddastrais
app.get('/viewNovoJardim',function(req,res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/viewIniciar');
	}else{
		var nome = req.session.user.nome;
		res.render('novoJardim', {nome: nome});	
	}
	
});

//metod que verifica as credenciais da conta
app.post('/validar', function(req, res) {
	var email = req.body.email;
	var senha = req.body.senha;

	connection.query('SELECT * FROM usuario WHERE email = ?', [ email ] , 
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
	connection.query('INSERT INTO usuario(nome, email, senha) VALUES (?,?,?)', [ nome, email, hash ] , 
		function(err, res){
			if(err) throw err;
		});
	res.render('iniciar');
});

//metodo requisita pagina de Dashboad
app.get('/dashboard', function(req, res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id){
		res.redirect('/login');
	}else{
		res.render('dashboard');	
	}	console.log(email); 	
	console.log(senha); 	
});

app.post('/novoJardim',function(req, res){
	var id_usuario = req.session.user.id;
	var nome = req.body.nome;
	var ambiente = req.body.ambiente;
	var localizacao = req.body.localizacao;
	
	connection.query('INSERT INTO jardim (id_usuario, nome, ambiente, localizacao) VALUES (?,?,?,?)', [ id_usuario, nome, ambiente, localizacao ] , 
		function(err, res){
			if(err) throw err;
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
