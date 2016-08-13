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
app.get('/iniciar', function(req,res){
	res.render('iniciar');
});

//Metodo requisita pagina de cadastro - ok
app.get('/registrar',function(req,res){
	res.render('registrar');
});

//metodo de adicionar usuario no BD
app.post('/gravarregistro',function(req, res){
	var nome = req.body.nome;
	var email = req.body.email;
	var senha = req.body.senha;
	var hash = bcrypt.hashSync(senha); //criptografia
	connection.query('INSERT INTO user (nome, email, senha) VALUES (?,?,?)', [ nome, email, hash ] , 
		function(err, res){
			if(err) throw err;
		});
	res.render('index', {message: 'Usuário cadastrado com sucesso.'});
});

//metodo requisita pagina de Login
app.get('/sair', function(req, res){
	var session = req.session.user = {}; //finaliza a seção (cria uma em branco) e chama index
	res.redirect('/');
});

//Metodo requisita pagina de redefinir senha
app.get('/senha',function(req,res){
	res.render('redefinirSenha');
});

//Metodo requisita pagina de dados caddastrais
app.get('/dados',function(req,res){
	res.render('dadosCadastrais');
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
					res.redirect('/principal');
				}else{
					res.send("Dados inválidos");//senha inválida
				}
			}else{
				res.send("Dados inválidos");//senha inválida
			}
		});
});

//Metodo requisita pagina main
app.get('/principal', function(req, res){
	if(!req.session.user || !req.session.user.nome || !req.session.user.id_user){
		res.redirect('/iniciar');
	}else{
		var nome = req.session.user.nome;
		res.render('principal', {nome: nome});	
	}
});

//Metodo requisita pagina de dados caddastrais
app.get('/criar',function(req,res){
	res.render('criar');
});

//Metodo requisita pagina de dados caddastrais
app.get('/redefini',function(req,res){
	res.render('redefinir');
});

//metodo requisita pagina de Dashboad
app.get('/dashboard', function(req, res){
	if(!req.session.user || !req.session.user.name || !req.session.user.id_user){
		res.redirect('/login');
	}else{
		res.render('dashboard');	
	}
});



//Chama Metodo de Conexão ao executar app
connection.connect(function(err){
	if(err) throw err;
	console.log('Conectado no MySQL'); 	
	app.listen(3000, function(){
		console.log('Servidor Arduino -> http://localhost:3000');
	});
});
