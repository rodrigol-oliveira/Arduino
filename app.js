var express = require('express');
var jade = require('jade');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var app = express();

app.set('view engine', 'jade');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())
app.set('views', __dirname + '/views');
app.use(express.static('public'));

app.locals.pretty = true;


	var connection = mysql.createConnection({
		host		: 'localhost',
		user		: 'root',
		password	: '',
		database	: 'Arduino'
	});
	app.post('/user',function(req, res){
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


	app.get('/', function(req, res){
		//res.send('<pre>Arduino</pre>');
		res.render('user_form');
	});

	connection.connect(function(err){
		if(err) throw err;
		console.log('Conectado no MySQL'); 	
		app.listen(3000, function(){
			console.log('Servidor Arduino -> http://localhost:3000');
		});
	});
