	var express = require('express');
	var ejs = require('ejs');
	var mysql = require('mysql');
	var bodyParser = require('body-parser');
	var path = require('path');
	var session = require('express-session'); <!-- cria uma instancia em branco  - framework -->
	var bcrypt = require('bcrypt-nodejs'); <!-- criptografia-->


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


//metodo requisita pagina de Login
app.get('/sair', function(req, res){
	var session = req.session.user = {}; //finaliza a seção (cria uma em branco) e chama index
	res.redirect('/');
});

//Metodo requisita pagina de redefinir senha
app.get('/viewRedefinir',function(req,res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id_user){
		res.redirect('/viewIniciar');
	}else{
		var nome = req.session.user.nome;
		res.render('redefinir', {nome: nome});	
	}
});

//Metodo requisita pagina main
app.get('/viewPrincipal', function(req, res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id_user){
		res.redirect('/viewIniciar');
	}else{
		var nome = req.session.user.nome;
		res.render('principal', {nome: nome});	
	}
});

//Metodo requisita pagina de dados caddastrais
app.get('/viewNovoJardim',function(req,res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id_user){
		res.redirect('/viewIniciar');
	}else{
		var nome = req.session.user.nome;
		res.render('novoJardim', {nome: nome});	
	}
	
});

//metod que verifica as credenciais usuarios
app.post('/validar', function(req, res) {
	var email = req.body.email;
	var senha = req.body.senha;
	connection.query('SELECT * FROM user WHERE email = ?', [ email ] , 
		function(err, rows){
			if(err) throw err;
			if(rows.length == 1){
				var id_user = rows[0].id_user;
				var nome = rows[0].nome;
				var pwd = rows[0].senha;
				if(bcrypt.compareSync(senha, pwd)){ // metodo da biblioteca que compara as senhas
					var session = req.session.user = {
						id_user: id_user,
						nome: nome
					};
					res.redirect('/viewPrincipal');
				}else{
					res.send("Dados inválidos");//senha inválida
				}
			}else{
				res.send("Dados inválidos");//senha inválida
			}
		});
});


//metodo de adicionar usuario no BD
app.post('/registrar',function(req, res){
	var nome = req.body.nome;
	var email = req.body.email;
	var senha = req.body.senha;
	var hash = bcrypt.hashSync(senha); //criptografia
	connection.query('INSERT INTO user (nome, email, senha) VALUES (?,?,?)', [ nome, email, hash ] , 
		function(err, res){
			if(err) throw err;
		});
	res.render('viewIniciar', {msgContaRegistrada: 'Conta registrada com sucesso.'});
});

//metodo requisita pagina de Dashboad
app.get('/dashboard', function(req, res){
	if(!req.session.user || !req.session.user.name || !req.session.user.id_user){
		res.redirect('/login');
	}else{
		res.render('dashboard');	
	}
});

app.post('/novoJardim',function(req, res){
	var jardim = req.body.nome;
	var planta = req.body.planta;
	var ambiente = req.body.ambiente;
	
	connection.query('INSERT INTO jardim (nome, planta, ambiente) VALUES (?,?,?)', [ nome, planta, jardim ] , 
		function(err, res){
			if(err) throw err;
		});
	res.render('viewPrincipal', {msgNovoJardim: 'Jardim criado com Sucesso.'});
});


//Chama Metodo de Conexão ao executar app
connection.connect(function(err){
	if(err) throw err;
	console.log('Conectado no MySQL'); 	
	app.listen(3000, function(){
		console.log('Servidor Arduino -> http://localhost:3000');
	});
});
