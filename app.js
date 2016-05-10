var express = require('express');
var jade = require('jade');
var mysql = require('mysql');

var app = express();

app.use(express.static('public'));
app.set('view engine', 'jade');
app.set('views', __dirname + '/views');

app.locals.pretty = true;

var connection = mysql.createConnection({
	host		: 'localhost',
	user		: 'root',
	password	: '',
	database	: 'Arduino'
});

app.get('/', function(req, res){
	res.send('<pre>Arduino</pre>');
});

app.get('/user',function(req,res){
	var name = req.query.name;
	var email = req.query.email;
	var password = req.query.password;
	var city_id = req.query.city_id;
	connection.query('INSERT INTO user ( name,email,password,city_id) VALUES (?,?,?,?)', [ name,email,password,city_id] , function(err, res){
		if(err) throw err;
	});
	var response = {
		nome: name
	}	
	//res.json(response);	
	res.send("Gravado com sucesso");
});

connection.connect(function(err){
	if(err) throw err;
	console.log('Conectado no MySQL'); 	
	app.listen(3000, function(){
		console.log('Servidor Arduino -> http://localhost:3000');
	});
});
