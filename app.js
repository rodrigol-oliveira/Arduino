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
	<!-- da linha 19 a 24 se refere a seção, impedindo que acesse as paginas internas sem logar -->
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
	password	: 'junior04p',
	database	: 'Arduino'
});
//metodo de adicionar usuario no BD
app.post('/adduser',function(req, res){
	var name = req.body.name;
	var email = req.body.email;
	var password = req.body.password;
	var hash = bcrypt.hashSync(password); <!-- criptografi -->
	connection.query('INSERT INTO user (name,email,password) VALUES (?,?,?)', [ name, email, hash ] , 
		function(err, res){
			if(err) throw err;
		});
	res.render('index', {message: 'Cadastro OK'});
});

//Pagina requisita pagina main
app.get('/',function(req,res){
	res.render('index', {message: ''});
});

//Metodo requisita pagina de cadastro
app.get('/cadastro',function(req,res){
	res.render('cadastro');
});

//metodo requisita pagina de Login
app.get('/login', function(req, res){
	res.render('login');
});

//metodo requisita pagina de Login
app.get('/logout', function(req, res){
	var session = req.session.user = {}; <!-- finaliza a seção (cria uma em branco) e chama index-->
	res.redirect('/');
});

//metod que verifica as credenciais usuarios
app.post('/check-user', function(req, res) {
	var email = req.body.email;
	var password = req.body.password;
	connection.query('SELECT id_user, name, password FROM user WHERE email = ?', [ email ] , 
		function(err, rows){
			if(err) throw err;
			if(rows.length == 1){
				var id_user = rows[0].id_user;
				var name = rows[0].name;
				var pwd = rows[0].password;
				if(bcrypt.compareSync(password, pwd)){ <!-- metodo da biblioteca que compara as senhas -->
					var session = req.session.user = {
						id_user: id_user,
						name: name
					};
					res.redirect('/main');
				}else{
					res.send("Dados inválidos"); <!-- senha inválida -->
				}
			}else{
				res.send("Dados inválidos"); <!-- senha inválida -->
			}
		});
});
//metodo requisita pagina de Dashboad
app.get('/dashboard', function(req, res){
	if(!req.session.user || !req.session.user.name || !req.session.user.id_user){
		res.redirect('/login');
	}else{
		res.render('dashboard');	
	}
});

//Metodo requisita pagina main
app.get('/main', function(req, res){
	if(!req.session.user || !req.session.user.name || !req.session.user.id_user){
		res.redirect('/login');
	}else{
		var name = req.session.user.name;
		res.render('main', {name: name});	
	}
});

//Metodo de Conexão
connection.connect(function(err){
	if(err) throw err;
	console.log('Conectado no MySQL'); 	
	app.listen(3000, function(){
		console.log('Servidor Arduino -> http://localhost:3000');
	});
});
