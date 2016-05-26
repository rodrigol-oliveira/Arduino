	var express = require('express');
	var ejs = require('ejs');
	var mysql = require('mysql');
	var bodyParser = require('body-parser');
	var path = require('path');


	var app = express();
	app.set('view engine', 'ejs');
	app.use(bodyParser.urlencoded({ extended: false }))
	app.use(bodyParser.json())
	app.set('views', __dirname + '/views');
	app.use(express.static('public'));
	app.locals.pretty = true;
	app.use(express.static(__dirname + '/views'));

//Metodo de conexão
	var connection = mysql.createConnection({
		host		: 'localhost',
		user		: 'root',
		password	: '',
		database	: 'Arduino'
	});
//metodo de adicionar usuario no BD
	app.post('/adduser',function(req, res){
		var name = req.body.name;
		var email = req.body.email;
		var password = req.body.password;
		connection.query('INSERT INTO user (name,email,password) VALUES (?,?,?)', [ name, email, password ] , function(err, res){
				if(err) throw err;
			});
		res.render('index', {message: 'Cadastro OK'});
		});

//Pagina requisita pagina HOME
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

//Metodo requisita pagina Main
	app.get('/main', function(req, res){
		//res.send('<pre>Arduino</pre>');
		res.render('main');
	});

//Metodo de Conexão
	connection.connect(function(err){
		if(err) throw err;
		console.log('Conectado no MySQL'); 	
		app.listen(3000, function(){
		console.log('Servidor Arduino -> http://localhost:3000');
		});
	});
