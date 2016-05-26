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


var connection = mysql.createConnection({
	host		: 'localhost',
	user		: 'root',
	password	: '',
	database	: 'Arduino'
});
app.post('/adduser',function(req, res){
	var name = req.body.name;
		//var email = req.params.email;
		//var password = req.params.password;
		//var city_id = req.params.city_id;
		//connection.query('INSERT INTO user ( name,email,password,city_id) VALUES (?,?,?,?)', 
		//[ name,email,password,city_id ] , function(err, res){
			connection.query('INSERT INTO user (name) VALUES (?)', [name] , function(err, res){
				if(err) throw err;
			});
			res.render("ok");
		});

app.post('/entrar',function(req, res){
	var name = req.body.name;
		//var email = req.params.email;
		//var password = req.params.password;
		//var city_id = req.params.city_id;
		//connection.query('INSERT INTO user ( name,email,password,city_id) VALUES (?,?,?,?)', 
		//[ name,email,password,city_id ] , function(err, res){
		connection.query('INSERT INTO user (name) VALUES (?)', [name] , function(err, res){
				if(err) throw err;
		});
			res.render("ok");
		});

app.get('/',function(req,res){
	res.render('index', {message: 'variavel vinda do node.js'})
	//res.sendFile('index.html');
	//res.render('user_add')
  //It will find and locate index.html from View or Scripts
});
app.get('/cadastro',function(req,res){
	res.render('cadastro')
});

app.get('/login', function(req, res){
		//res.send('<pre>Arduino</pre>');
		res.render('login');
	});

app.get('/main', function(req, res){
		//res.send('<pre>Arduino</pre>');
		res.render('main');
	});


connection.connect(function(err){
	if(err) throw err;
	console.log('Conectado no MySQL'); 	
	app.listen(3000, function(){
		console.log('Servidor Arduino -> http://localhost:3000');
	});
});
