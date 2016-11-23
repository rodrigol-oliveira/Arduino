  var express = require('express');
  var ejs = require('ejs');
  var mysql = require('mysql');
  var bodyParser = require('body-parser');
  var path = require('path');
  var session = require('express-session');
  var bcrypt = require('bcrypt-nodejs'); 
  var nodemailer = require('nodemailer');//envia email
  var request = require('request');//request previsao do tempo
  var keyprevisao = 'd18b9453b7807f16107f9e8573492a6a';//chave individual atrelada ao usuario cadastrado no site - key previsao do tempo

  //Metodo de conexão
  var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password  : '',
    database  : 'ioneBD'
  });

  var previsaoController = require('./controllers/previsaoController.js');
  previsaoController.setup(keyprevisao, request);

  var userController = require('./controllers/userController.js');
  userController.setup(connection,bcrypt);

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
 app.get('/recuperar-senha',function(req,res){
  res.render('recuperar');
 });

  app.post('/checkemail',function(req,res){
    var email = req.body.email;
    connection.query('SELECT * FROM usuario WHERE email = ?', [ email ] ,
        function(err, rows){
          if(err) throw err;
          if(rows.length === 1){
            var id = rows[0].id;
            var nome = rows[0].nome;
            var pwd = rows[0].senha;
            var link = '/redefinir?K='+pwd.substr(5,20)+'&I='+id;
            enviaemailsenha(req, res,link,email)
          }else{
            res.send("Email não encontrado");//user não cadastrado
          }
        });

  });

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
              res.redirect('/viewAlterarUsuario');
            }else{
              res.send("Dados inválidos");//senha inválida
            }
          }else{
            res.send("Dados inválidos");//user não cadastrado
          }
        });
  });



  //Metodo requisita pagina de cadastro - ok
app.get('/viewAlterarUsuario', userController.viewAlterarUsuario);




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

//Metodo requisita pagina de redefinir senha
app.get('/viewRedefinirLogado',function(req,res){
  if(!req.session.user || !req.session.user.nome || !req.session.user.id){
    res.redirect('/viewIniciar');
  }else{
    var nome = req.session.user.nome;

    res.render('redefinirLogado');
  }
});





  function enviaemailsenha(req, res,link,email) {
    // Not the movie transporter!
    var text = 'Para Trocar a sua senha click no link: http://localhost:3000'+link;
    var mailOptions = {
      from: 'ionegardensystem@gmail.com', // sender address
      to: email, // list of receivers
      subject: 'ione Garden | Troca de Senha', // Subject line
      text: text //, // plaintext body
    // html: '<b>Hello world ✔</b>' // You can choose to send an HTML body instead
};
var transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: {
            user: 'ionegardensystem@gmail.com', // Your email id
            pass: 'jardim10' // Your password
        }
    });
transporter.sendMail(mailOptions, function(error, info){
  if(error){
    console.log(error);
    res.send("Erro ao enviar email");
  }else{
    console.log('Message sent: ');
    res.send("Enviado um e-mail para redefinir a senha");
  };
});
};



app.post('/registrar', userController.registrar);
app.get('/previsao', previsaoController.previsao);



    //Chama Metodo de Conexão ao executar app
    connection.connect(function(err){
      if(err) throw err;
      console.log('Conectado no MySQL');
      app.listen(3000, function(){
        console.log('Servidor Arduino -> http://localhost:3000');
      });
    });


