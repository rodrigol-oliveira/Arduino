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
	database	: 'arduino'
});

app.get('/', function(req, res){
	res.send('<pre>Arduino</pre>');
});

app.get('/save', function(req, res){
	var temperatura = parseFloat(req.query.temperatura);
	var acao = '';
	if(temperatura > 15){
		acao = 'regar';
	}
	var response = {
		temperatura: temperatura,
		action: acao
	};
	connection.query('INSERT INTO registros (id, temperatura) VALUES (?, ?)', [null, temperatura] , function(err, res){
		if(err) throw err;
	});
	console.log('temperatura', temperatura);
	res.json(response);
});

app.get('/dashboard', function(req, res){
	connection.query('SELECT * FROM registros', function(err, rows, fields){
		if(err) throw err;
		var results = rows;
		res.render('dashboard', {results: results});
	});
});

connection.connect(function(err){
	if(err) throw err;
	console.log('Conectado no MySQL'); 
	app.listen(3000, function(){
		console.log('Servidor Arduino -> http://localhost:3000');
	});
});

