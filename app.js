  var express = require('express');
  var ejs = require('ejs');
  var mysql = require('mysql');
  var bodyParser = require('body-parser');
  var path = require('path');
  var session = require('express-session'); <!-- cria uma instancia em branco  - framework -->
  var bcrypt = require('bcrypt-nodejs'); <!-- criptografia-->
  var nodemailer = require('nodemailer');//envia email
  var request = require('request');//request previsao do tempo
  var keyprevisao = 'd18b9453b7807f16107f9e8573492a6a';//chave individual atrelada ao usuario cadastrado no site - key previsao do tempo

  //Metodo de conexão
  var connection = mysql.createConnection({
    host    : 'localhost',
    user    : 'root',
    password  : '',
    database  : 'arduino'
  });

  var previsaoController = require('./controllers/previsaoController.js');
  previsaoController.setup(keyprevisao, request);

  var userController = require('./controllers/userController.js');


  userController.setup(connection);

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





function Usuario(id, nome, sobrenome, genero, email){
  this.id = validaINTNull(id);
  this.nome = validaCHARNull(nome);
  this.sobrenome = validaCHARNull(sobrenome);
  this.genero = validaCHARNull(genero);
  this.email = validaCHARNull(email);
}

function relatorioCompleto(data_hora, valor_S01, valor_S02, valor_S03, valor_S04,
  status_umidade, clima, probabilidade_chuva,valvula, consumo){

  this.data_hora = validaCHARNull(data_hora);
  this.valor_S01 = validaINTNull(valor_S01); this.valor_S02 = validaINTNull(valor_S02);
  this.valor_S03 = validaINTNull(valor_S03); this.valor_S04 = validaINTNull(valor_S04);
  this.probabilidade_chuva = validaINTNull(probabilidade_chuva); this.consumo = validaINTNull(consumo);
  this.status_umidade = validaCHARNull(status_umidade); this.clima = validaCHARNull(clima);
  this.valvula = validaCHARNull(valvula);
}

function relatorioPlantas(nome_planta, nome_cientifico, umidade_min, temperatura, informacao, descricao_grupo){
  this.nome_planta = validaCHARNull(nome_planta);
  this.nome_cientifico = validaCHARNull(nome_cientifico);
  this.umidade_min = validaINTNull(umidade_min);
  this.temperatura = validaINTNull(temperatura);
  this.informacao = validaCHARNull(informacao);
  this.descricao_grupo = validaCHARNull(descricao_grupo);
}

function relatorioUmidade(data_hora,media, status_umidade, clima){
  this.data_hora = data_hora;
  this.media = validaINTNull(media);
  this.status_umidade = validaCHARNull(status_umidade);
  this.clima = validaCHARNull(clima);
}

function relatorioConsumo(data_hora, valvula, consumo, clima){
  this.data_hora = data_hora;
  this.valvula = validaCHARNull(valvula);
  this.consumo = validaINTNull(consumo);
  this.clima = validaCHARNull(clima);
}

function Jardim(serial, nome_jardim, estado, cidade, grupo, umidade_min, id_valvula, descricao_valvula, id_agua, descricao_agua){
  this.serial = validaCHARNull(serial);
  this.nome_jardim = validaCHARNull(nome_jardim);
  this.estado = validaCHARNull(estado);
  this.cidade = validaCHARNull(cidade);
  this.grupo = validaCHARNull(grupo);
  this.umidade_min = validaINTNull(umidade_min);
  this.id_valvula = validaINTNull(id_valvula);
  this.descricao_valvula = validaCHARNull(descricao_valvula);
  this.id_agua = validaINTNull(id_agua);
  this.descricao_agua = validaCHARNull(descricao_agua);
}

function Planta(id, nome_planta, descricao_planta){
  this.id = validaINTNull(id);
  this.nome_planta = validaCHARNull(nome_planta);
  this.descricao_planta = validaCHARNull(descricao_planta);
}

function Sensor(id, nome_sensor, especificacao_sensor){
  this.id = validaINTNull(id);
  this.nome_sensor = validaCHARNull(nome_sensor);
  this.especificacao_sensor = validaCHARNull(especificacao_sensor);
}

function Grupo(id, nome_grupo, umidade_min, umidade_max){
  this.id = validaINTNull(id);
  this.nome_grupo = validaCHARNull(nome_grupo);
  this.umidade_min = validaINTNull(umidade_min);
  this.umidade_max = validaINTNull(umidade_max);
}

function validaINTNull(int){
  if (int == null) {
    return 0;
  }else{
    return int;
  }
}

function validaCHARNull(char){
  if (char == null) {
    return " ";
  }else{
    return char;
  }
}

function Analise(id, id_jardim, data_hora, valor_S01, valor_S02, valor_S03, valor_S04, media,
  status_umidade, clima, probabilidade_chuva,valvula, consumo){
  this.id = validaINTNull(id);
  this.id_jardim =validaINTNull(id_jardim);
  this.data_hora = validaCHARNull(data_hora);
  this.valor_S01 = validaINTNull(valor_S01);
  this.valor_S02 = validaINTNull(valor_S02);
  this.valor_S03 = validaINTNull(valor_S03);
  this.valor_S04 = validaINTNull(valor_S04);
  this.media = validaINTNull(media);
  this.status_umidade = validaCHARNull(status_umidade);
  this.clima = validaCHARNull(clima);
  this.probabilidade_chuva = validaINTNull(probabilidade_chuva);
  this.valvula = validaCHARNull(valvula);
  this.consumo = validaINTNull(consumo);
}

function SelectIdJardim(usuario){
  connection.query('SELECT id FROM jardim WHERE id_usuario = ?', [usuario],
    function(err, rows){
      if(err){
        console.log('erro SelectIdJardim');
        throw err;
      }else{
        var idJardim = rows[0];

        return idJardim;
      }
    });
}


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

//Metodo requisita pagina de cadastro - ok
app.get('/viewAlterarUsuario', userController.viewAlterarUsuario);
/*
app.get('/viewAlterarUsuario',function(req,res){
  if(!req.session.user || !req.session.user.nome || !req.session.user.id){
    res.redirect('/viewIniciar');
  }else{
    var id_usuario = req.session.user.id;

    connection.query('SELECT * from usuario where id=?;', [id_usuario], function(err, rows){
      if(err){
        conosole.log('erro select usuario viewAlterarUsuario');
        throw err;
      }else{
        var usuario = new Usuario(rows[0].id, rows[0].nome, rows[0].sobrenome, rows[0].genero, rows[0].email);
        res.render('alterarUsuario', {usuario:usuario});
      }
    });
  }
});
*/


//Metodo requisita pagina de relatorios
app.get('/viewRelatorios',function(req,res){
  if(!req.session.user || !req.session.user.nome || !req.session.user.id){
    res.redirect('/viewIniciar');
  }else{
    var id_jardim = req.session.user.id;
    res.render('relatorios');
  }
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

//Metodo requisita pagina de redefinir senha
app.get('/viewRedefinirLogado',function(req,res){
  if(!req.session.user || !req.session.user.nome || !req.session.user.id){
    res.redirect('/viewIniciar');
  }else{
    var nome = req.session.user.nome;

    res.render('redefinirLogado');
  }
});

app.post('/redefinirlogado', function(req, res){
  if(!req.session.user || !req.session.user.nome || !req.session.user.id){
    res.redirect('/viewIniciar');
  }else{

    var id_usuario = req.session.user.id;
    var senha = req.body.senha;
    var hash = bcrypt.hashSync(senha);
    var novasenha = req.body.novasenha;
    var novahash = bcrypt.hashSync(novasenha);



    connection.query('SELECT * FROM usuario WHERE id = ?;', [ id_usuario ] , function(err, rows){
      if(err){
        console.log('erro selec usuario redefinirlogado')
        throw err;
      }else{
        if(rows.length == 1){
          var pwd = rows[0].senha;
          console.log(senha, hash, pwd, novasenha, novahash);

          if(pwd == hash){

            connection.query('UPDATE usuario SET senha = ? WHERE id =?',[ novasenha, id_usuario ] ,
              function(err){
                if(err) throw err;
                console.log('update ok',res);
              res.send('/viewPrincipal');//user não cadastrado
            });
          }else{
          res.send("Dados invalidos");//user não cadastrado
        }
      }else{
        res.send("Dados invalidos");//user não cadastrado
      }
    }
  });

  }
});



//chama metodo tela principal
app.get('/viewPrincipal', function(req, res){
  if (!req.session.user || !req.session.user.nome || !req.session.user.id) {
    res.redirect('/viewIniciar');
  }else{
    var id_usuario = req.session.user.id;

    connection.query('SELECT * from usuario WHERE id = ?;', [id_usuario], function(err, rows){
      if (err) {
        console.log('erro select usuario principal');
        throw err;
      }else{
        var usuario = new Usuario(rows[0].id, rows[0].nome, rows[0].sobrenome, rows[0].genero, rows[0].email)

        connection.query('SELECT * from jardim WHERE id_usuario = ?;', [id_usuario],
          function(err, rows){
            if (err){
              console.log('erro select jardim view principal');
              throw err;
            }else{
              if (rows.length == 0) {
                res.render('principal', {usuario:usuario, id_jardim:''});
              }else{
                var id_jardim = rows[0].id;

                connection.query('SELECT j.serial, j.nome_jardim, j.estado, j.cidade, g.nome_grupo, g.umidade_min, v.id, v.descricao_valvula, a.id, a.descricao_agua '+
                  'from jardim j '+
                  'inner join usuario u on u.id = j.id_usuario '+
                  'inner join jardim_planta jp on jp.id_jardim = j.id '+
                  'inner join planta p on p.id = jp.id_planta '+
                  'inner join grupo_planta gp on gp.id_planta = p.id '+
                  'inner join grupo g on g.id = gp.id_grupo '+
                  'inner join valvula v on v.id = j.id_valvula '+
                  'inner join agua a on a.id = j.id_agua '+
                  'where u.id = ?;',[id_usuario], function(err, rows){
                    if (err) {
                      console.log('erro ao pesquisar detalhes de jardim em princiapl json');
                      throw err;
                    }else{

                      var detalhesJardim = new Jardim(rows[0].serial, rows[0].nome_jardim, rows[0].estado,
                        rows[0].cidade, rows[0].nome_grupo, rows[0].umidade_min, rows[0].id_valvula, rows[0].descricao_valvula,
                        rows[0].id_agua,  rows[0].descricao_agua);

                      var arrayPlanta = [];

                      connection.query('SELECT p.id, p.nome_planta from planta p '+
                        'inner join jardim_planta jp on jp.id_planta = p.id '+
                        'inner join jardim j on j.id = jp.id_jardim '+
                        'where j.id = ?', [id_jardim], function(err, rows){
                          if (err) {
                            console.log('erro select plantas principal');
                            throw err;
                          }else{
                            if (rows.length > 0) {
                              for(var i = 0; i < rows.length; i++){
                                var planta = new Planta(rows[i].id, rows[i].nome_planta, rows[i].descricao_planta);
                                arrayPlanta.push(planta);
                              }
                            }

                            var arraySensor = [];

                            connection.query('SELECT s. id, s.nome_sensor, s.especificacao_sensor from sensor s '+
                              'inner join jardim_sensor js on js.id_sensor = s.id '+
                              'inner join jardim j on j.id = js.id_jardim '+
                              'where j.id = ?;', [id_jardim], function(err, rows){
                                if (err) {
                                  console.log('erro select sensores principal');
                                  throw err;
                                }else{
                                  if (rows.length > 0) {
                                    for(var i=0; i<rows.length; i++){
                                      var sensor = new Sensor(rows[i].id, rows[i].nome_sensor, rows[i].especificacao_sensor);
                                      arraySensor.push(sensor);
                                    }
                                  }

                                  connection.query('SELECT id, id_jardim, DATE_FORMAT(data_hora, "%d/%m/%Y %H:%m:%s") as "data_hora", '+
                                    'valor_S01, valor_S02, valor_S03, valor_S04, media, status_umidade, clima, probabilidade_chuva, valvula, '+
                                    'consumo from analise where id_jardim = ? order by id desc limit 4;', [id_jardim], function(err, rows){
                                      if (err) {
                                        console.log('erro select analise');
                                        throw err;
                                      }else{

                                        var arrayanalise = [];

                                        if (rows.length == 0) {
                                          res.render('principal', {usuario:usuario, id_jardim:id_jardim, detalhesJardim:detalhesJardim,
                                            plantas:arrayPlanta, sensores:arraySensor, analise:''});
                                        }else{

                                          for (var i = 0; i < rows.length; i++) {

                                            var analise = new Analise(rows[i].id, rows[i].id_jardim, rows[i].data_hora,
                                              rows[i].valor_S01, rows[i].valor_S02, rows[i].valor_S03, rows[i].valor_S04, rows[i].media,
                                              rows[i].status_umidade, rows[i].clima, rows[i].probabilidade_chuva, rows[i].valvula, rows[i].consumo);

                                            arrayanalise.push(analise);
                                          }

                                          res.render('principal', {usuario:usuario, id_jardim:id_jardim, detalhesJardim:detalhesJardim,
                                            plantas:arrayPlanta, sensores:arraySensor, analise:arrayanalise});
                                        }
                                      }
                                    });
                                }
                              });
                          }
                        });
                    }
                  });
}
}
});
}
});
}
});


//Metodo requisita pagina de dados caddastrais
app.get('/viewNovoJardim', function(req, res){
  if(!req.session.user || !req.session.user.nome || !req.session.user.id){
    res.redirect('/viewIniciar');
  }else{
    connection.query('SELECT * FROM planta;', function(err, rows){
      if (err) {
        console.log('erro select plantas novo jardim');
        throw err;
      }else{
        var plantas = rows;

        connection.query('SELECT * from valvula;', function(err, rows){
          if (err) {
            console.log('erro select valvula novo jardim');
            throw err;
          }else{
            var valvula = rows;

            connection.query('SELECT * from agua;', function(err, rows){
              if (err) {
                console.log('erro select agua novo jardim');
                throw err;
              }else{
                var agua = rows;

                connection.query('SELECT * from sensor;', function(err, rows){
                  if (err) {
                    console.log('erro select sensor novo jardim');
                    throw err;
                  }else{
                    var sensor = rows;

                    res.render('novoJardim',{plantas:plantas, valvula:valvula, agua:agua, sensor:sensor});
                  }
                });
              }
            });
          }
        });
      }
    });
  }
});







//metod que verifica as credenciais da conta
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
          res.redirect('/viewPrincipal');
        }else{
          res.send("Dados inválidos");//senha inválida
        }
      }else{
        res.send("Dados inválidos");//user não cadastrado
      }
    });
});

/*
//metodo de adicionar usuario no BD
app.post('/registrar',function(req, res){
  var nome = req.body.nome;
  var sobrenome = req.body.sobrenome;
  var email = req.body.email;
  var senha = req.body.senha;
  var genero = req.body.genero;
  var hash = bcrypt.hashSync(senha); //criptografia
  connection.query('INSERT INTO usuario(nome, sobrenome, genero, email, senha) VALUES (?,?,?,?,?);',
    [nome, sobrenome, genero, email, hash ] ,
    function(err, res){
      if(err) throw err;
    });
  res.render('iniciar');
});
*/
//metodo altera o jardim - ainda dá para melhorar a query com update inner join
app.post('/alterarJardim', function(req,res){

  var id_usuario = req.session.user.id;

  var nome = req.body.nome;
  var estado = req.body.estado;
  var cidade = req.body.cidade;
  var agua = req.body.agua;
  var valvula = req.body.valvula;

  var planta = req.body.planta;
  var sensor = req.body.sensor;


  connection.query('SELECT * from jardim WHERE id_usuario = ?;', [id_usuario], function(err, rows){
    if (err) {
      console.log('erro select jardim alterarJardim');
      throw err;
    }else{
      var id_jardim = rows[0].id;

      connection.query('UPDATE jardim SET nome_jardim = ?, id_valvula=?, id_agua=?, estado=?, cidade=? WHERE id = ?;',
        [nome, valvula, agua, estado, cidade, id_jardim], function(err){
          if (err) {
            console.log('erro update alteraJardim');
            throw err;
          }else{
            connection.query('delete from jardim_planta where id_jardim = ?',[id_jardim], function(err){
              if (err) {
                console.log('erro delete jardim_planta alterarJardim');
                throw err;
              }else{
                for (var i = 0; i < planta.length; i++) {
                  connection.query('INSERT into jardim_planta(id_jardim, id_planta) VALUES(?,?)',
                    [id_jardim, planta[i]], function(err){
                      if (err) {
                        console.log('erro inserir jardim_planta alterarJardim');
                        throw err;
                      }
                    });
                }

                connection.query('delete from jardim_sensor where id_jardim = ?;',[id_jardim], function(err){
                  if (err) {
                    console.log('erro delete jardim_sensor alterarJardim');
                    throw err;
                  }else{
                    for (var i = 0; i < sensor.length; i++) {
                      connection.query('INSERT into jardim_sensor(id_jardim, id_sensor) VALUES(?,?);',
                        [id_jardim, sensor[i]], function(err){
                          if (err) {
                            console.log('erro inserir jardim_sensor alterarJardim');
                            throw err;
                          }
                        });
                    }
                    res.redirect('viewPrincipal');
                  }
                });
              }
            });
          }
        });
    }
  });
});



//Metodo alterar jardim
app.get('/viewAlterarJardim',function(req,res){
  if(!req.session.user || !req.session.user.nome || !req.session.user.id){
    res.redirect('/viewIniciar');
  }else{
    var id_usuario = req.session.user.id;

    connection.query('SELECT * FROM jardim WHERE id_usuario = ?;', [id_usuario], function(err, rows){
      if (err) {
        onsole.log('erro select id_jardim alterar jardim');
        throw err;
      }else{
        var id_jardim = rows[0].id;

        connection.query('SELECT * FROM planta;', function(err, rows){
          if (err) {
            console.log('erro select planta alterar jardim');
            throw err;
          }else{
            var plantas = rows;

            connection.query('SELECT * from sensor;', function(err, rows){
              if (err) {
                console.log('erro select sensor alterar jardim');
                throw err;
              }else{
                var sensores = rows;

                connection.query('select * from agua;', function(err, rows){
                  if (err) {
                    console.log('erro select agua alterar jardim');
                    throw err;
                  }else{
                    var agua = rows;

                    connection.query('SELECT * from valvula;', function(err, rows){
                      if(err){
                        console.log('erro select valvula alterar jardim');
                        throw err;
                      }else{
                        var valvula = rows;

                        connection.query('SELECT j.serial, j.nome_jardim, j.estado, j.cidade, g.nome_grupo, v.id as id_valvula, v.descricao_valvula, a.id as id_agua, a.descricao_agua '+
                          'from jardim j '+
                          'inner join usuario u on u.id = j.id_usuario '+
                          'inner join jardim_planta jp on jp.id_jardim = j.id '+
                          'inner join planta p on p.id = jp.id_planta '+
                          'inner join grupo_planta gp on gp.id_planta = p.id '+
                          'inner join grupo g on g.id = gp.id_grupo '+
                          'inner join valvula v on v.id = j.id_valvula '+
                          'inner join agua a on a.id = j.id_agua '+
                          'where u.id = ?;',[id_usuario], function(err, rows){
                            if (err) {
                              console.log('erro select jardim alterar jardim');
                              throw err;
                            }else{


                              var jardim = new Jardim(rows[0].serial, rows[0].nome_jardim, rows[0].estado,
                                rows[0].cidade, rows[0].nome_grupo, rows[0].umidade_min, rows[0].id_valvula, rows[0].descricao_valvula,
                                rows[0].id_agua,  rows[0].descricao_agua);


                              connection.query('SELECT p.id, p.nome_planta from planta p '+
                                'inner join jardim_planta jp on jp.id_planta = p.id '+
                                'inner join jardim j on j.id = jp.id_jardim '+
                                'where j.id = ?', [id_jardim], function(err, rows){
                                  if(err){
                                    console.log('erro SELECT jardim_planta alterar jardim');
                                    throw err;
                                  }else{
                                    var arrayPlanta = [];

                                    for(var i=0; i < rows.length; i++){

                                      var res_planta = new Planta(rows[i].id, rows[i].nome_planta, rows[i].descricao_planta);
                                      arrayPlanta.push(res_planta);
                                    }

                                    connection.query('SELECT s.id, s.nome_sensor, s.especificacao_sensor from sensor s '+
                                      'inner join jardim_sensor js on js.id_sensor = s.id '+
                                      'inner join jardim j on j.id = js.id_jardim '+
                                      'WHERE j.id = ?', [id_jardim], function(err, rows){
                                        if (err) {
                                          onsole.log('erro select jardim_sensor alterar jardim');
                                          throw err;
                                        }else{
                                          var arraySensor = [];
                                          for(var i=0; i<rows.length; i++){

                                            var res_sensor = new Sensor(rows[i].id, rows[i].nome_sensor, rows[i].especificacao_sensor);

                                            arraySensor.push(res_sensor);
                                          }

                                          res.render('alterarJardim', {plantas:plantas, sensores:sensores, valvula:valvula,
                                            agua:agua, jardim:jardim, arrayPlanta:arrayPlanta, arraySensor:arraySensor, cidades:" ", estados:" "});
                                        }
                                      });
                                  }
                                });

                            }
                          });
                      }
                    });
                  }

                })
              }
            });
          }
        });
      }
    });
}
});


//metodo deletar jardim
app.get('/deletarJardim', function(req, res){

  var nome = req.session.user.nome;
  var id_usuario = req.session.user.id;

  connection.query('select * from jardim where id_usuario = ?', [id_usuario],
    function(err, rows){
      if (err){
        console.log('erro select jardim em deletar')
        throw err;
      }else{

        var id_jardim = rows[0].id;

        connection.query('delete from jardim_planta where id_jardim = ?;', [id_jardim],
          function(err){
            if(err){
              console.log('erro ao deletar jardim_planta x');
              throw err;
            }else{
              connection.query('delete from jardim_sensor where id_jardim = ?;', [id_jardim],
                function(err){
                  if (err) {
                    console.log('erro ao deletar jardim_sensor');
                    throw err;
                  }else{
                    connection.query('select * from analise WHERE id_jardim = ?;', [id_jardim],
                      function(err, rows){
                        if(err){
                          console.log('erro select analise deletar');
                          throw err;
                        }else{
                          if (rows.length > 0) {
                            connection.query('delete from analise where id_jardim = ?;', [id_jardim], function(err){
                              if (err) {
                                console.log('erro ao deletar analise');
                                throw err;
                              }
                            });
                          }
                        }
                        connection.query('delete from jardim where id_usuario = ?', [id_usuario],
                          function(err){
                            if (err) {
                              console.log('erro ao deletar jardim');
                              throw err;
                            }

                            res.redirect('/viewPrincipal');
                          });


                      });
                  }
                });
            }
          });
      }
    });
});


//metodo registra novo jardim no bano ainda da para melhorar a query com insert inner
app.post('/novoJardim',function(req, res){
  var id_usuario = req.session.user.id;
  var nome = req.body.nome;
  var serial = req.body.serial;
  var pais = req.body.pais;
  var estado = req.body.estado;
  var cidade = req.body.cidade;
  var agua = req.body.agua;
  var valvula = req.body.valvula;

  var planta = req.body.planta;
  var sensor = req.body.sensor;

  connection.query('INSERT into jardim(serial,id_usuario, id_valvula, id_agua, nome_jardim, estado, cidade) '+
    'VALUES(?,?,?,?,?,?,?);', [serial.toUpperCase(), id_usuario, valvula, agua, nome, estado, cidade],
    function(err){
      if(err) {
        console.log('erro inserir novo jardim');
        throw err;
      }
    });

  connection.query('SELECT * FROM jardim WHERE id_usuario = ?', [id_usuario],
    function(err, rows){
      if (err) {
        console.log('erro select idjardim novoJardim');
        throw err;
      }else{
        var id_jardim = rows[0].id;

        if (planta.length > 0) {
          for (var i = 0; i < planta.length; i++) {
            connection.query('INSERT into jardim_planta(id_jardim, id_planta) VALUES(?,?);',
              [id_jardim, planta[i]], function(err){
                if (err) {
                  console.log('erro inserir jardim_planta');
                  throw err;
                }
              });
          }
        }
        if (sensor.length > 0) {
          for (var i = 0; i < sensor.length; i++) {
            connection.query('INSERT into jardim_sensor(id_jardim, id_sensor) VALUES(?,?);',
              [id_jardim, sensor[i]], function(err){
                if (err) {
                  console.log('erro inserir jardim_sensor');
                  throw err;
                }
              });
          }
        }
      }
    });
  res.redirect('viewPrincipal');
});


app.post('/selectPlantas', function(req, res){

  var id = req.session.user.id;

  connection.query('SELECT p.nome_planta, p.nome_cientifico, p.umidade_min, p.temperatura, p.informacao, g.descricao_grupo '+
    'from jardim j '+
    'inner join usuario u on u.id = j.id_usuario '+
    'inner join jardim_planta jp on jp.id_jardim = j.id '+
    'inner join planta p on p.id = jp.id_planta '+
    'inner join grupo_planta gp on gp.id_planta = p.id '+
    'inner join grupo g on g.id = gp.id_grupo '+
    'where u.id = ?;', [id], function(err, rows){
      if(err){
        console.log('erro selectplantas');
        throw err;
      }else{
        if(rows.length > 0){
          var array = [];
          for(var i=0; i<rows.length; i++){
            var planta = new relatorioPlantas(rows[0].nome_planta, rows[0].nome_cientifico, rows[0].umidade_min, rows[0].temperatura,
              rows[0].informacao, rows[0].descricao_grupo);
            array.push(planta);
          }
          res.render('res_planta', {res_plantas:array});
        }else{
          res.render('res_planta', {res_plantas:''});
        }
      }
    });
});



app.post('/selectUmidade', function(req, res){

  var id = req.session.user.id;
  var inicio = req.body.inicio;
  var fim = req.body.fim;

  if(!inicio == '' && !fim == ''){

    var datainicio = inicio.substring(6)+"-"+inicio.substring(3,5)+"-"+inicio.substring(0,2);
    var datafim = fim.substring(6)+"-"+fim.substring(3,5)+"-"+fim.substring(0,2)+" 23:59:59";

    connection.query('select DATE_FORMAT(data_hora, "%d/%m/%Y %H:%i:%s") as "data_hora", a.media, a.status_umidade, a.clima '+
      'from usuario u '+
      'inner join jardim j on j.id_usuario = u.id '+
      'inner join analise a on a.id_jardim = j.id '+
      'where u.id = ? and '+
      'a.data_hora between ? and ?; ', [id, datainicio, datafim], function(err, rows){
        if(err){
          console.log('erro selectUmidade');
          throw err;
        }else{
          if (rows.length > 0) {
            var array = [];

            for (var i = 0; i < rows.length; i++) {
              var umidade = new relatorioUmidade(rows[i].data_hora, rows[i].media, rows[i].status_umidade, rows[i].clima);

              array.push(umidade);
            }

            res.render('res_umidade', {res_umidade:array});

          }else{
            res.render('res_umidade', {res_umidade:''});
          }
        }
      });
  }else{
    connection.query('select DATE_FORMAT(data_hora, "%d/%m/%Y %H:%i:%s") as "data_hora", a.media, a.status_umidade, a.clima '+
      'from usuario u '+
      'inner join jardim j on j.id_usuario = u.id '+
      'inner join analise a on a.id_jardim = j.id '+
      'where u.id = ?;', [id, datainicio, datafim], function(err, rows){
        if(err){
          console.log('erro selectUmidade');
          throw err;
        }else{
          if (rows.length > 0) {
            var array = [];

            for (var i = 0; i < rows.length; i++) {
              var umidade = new relatorioUmidade(rows[i].data_hora, rows[i].media, rows[i].status_umidade, rows[i].clima);
              array.push(umidade);
            }

            res.render('res_umidade', {res_umidade:array});

          }else{
            res.render('res_umidade', {res_umidade:''});
          }
        }
      });
  }
});


app.post('/selectConsumo', function(req, res){

  var id = req.session.user.id;
  var inicio = req.body.inicio;
  var fim = req.body.fim;

  if(!inicio == '' && !fim == ''){

    var datainicio = inicio.substring(6)+"-"+inicio.substring(3,5)+"-"+inicio.substring(0,2);
    var datafim = fim.substring(6)+"-"+fim.substring(3,5)+"-"+fim.substring(0,2)+" 23:59:59";

    connection.query('select DATE_FORMAT(data_hora, "%d/%m/%Y %H:%i:%s") as "data_hora", valvula, consumo, clima '+
      'from usuario u '+
      'inner join jardim j on j.id_usuario = u.id '+
      'inner join analise a on a.id_jardim = j.id '+
      'where u.id = ? and '+
      'a.data_hora between ? and ?; ', [id, datainicio, datafim], function(err, rows){
        if(err){
          console.log('erro selectConsumo');
          throw err;
        }else{
          if (rows.length > 0) {
            var array = [];

            for (var i = 0; i < rows.length; i++) {
              var consumo = new relatorioConsumo(rows[i].data_hora, rows[i].valvula, rows[i].consumo, rows[i].clima);

              array.push(consumo);
            }

            res.render('res_consumo', {res_consumo:array});

          }else{
            res.render('res_consumo', {res_consumo:''});
          }
        }
      });
  }else{

    connection.query('select DATE_FORMAT(data_hora, "%d/%m/%Y %H:%i:%s") as "data_hora", valvula, consumo, clima '+
      'from usuario u '+
      'inner join jardim j on j.id_usuario = u.id '+
      'inner join analise a on a.id_jardim = j.id '+
      'where u.id = ?;', [id], function(err, rows){
        if(err){
          console.log('erro selectConsumo');
          throw err;
        }else{
          if (rows.length > 0) {
            var array = [];

            for (var i = 0; i < rows.length; i++) {
              var consumo = new relatorioConsumo(rows[i].data_hora, rows[i].valvula, rows[i].consumo, rows[i].clima);

              array.push(consumo);
            }

            res.render('res_consumo', {res_consumo:array});

          }else{
            res.render('res_consumo', {res_consumo:''});
          }
        }
      });
  }
});

app.post('/selectCompleto', function(req, res){

  var id = req.session.user.id;
  var inicio = req.body.inicio;
  var fim = req.body.fim;

  if(!inicio == '' && !fim == ''){

    var datainicio = inicio.substring(6)+"-"+inicio.substring(3,5)+"-"+inicio.substring(0,2);
    var datafim = fim.substring(6)+"-"+fim.substring(3,5)+"-"+fim.substring(0,2)+" 23:59:59";

    connection.query('SELECT DATE_FORMAT(data_hora, "%d/%m/%Y %H:%i:%s") as "data_hora", '+
      'valor_S01, valor_S02,valor_S03, valor_S04, status_umidade, clima, probabilidade_chuva, valvula, consumo '+
      'from jardim j '+
      'inner join usuario u on u.id = j.id_usuario '+
      'inner join analise a on a.id_jardim = j.id '+
      'where u.id = ? and '+
      'a.data_hora between ? and ?;', [id, datainicio, datafim], function(err, rows){
        if(err){
          console.log('erro selectCompleto');
          throw err;
        }else{

          if (rows.length > 0) {
            var array = [];

            for (var i = 0; i < rows.length; i++) {

              var completo = new relatorioCompleto(rows[i].data_hora, rows[i].valor_S01,
                rows[i].valor_S02, rows[i].valor_S03, rows[i].valor_S04, rows[i].status_umidade,
                rows[i].clima, rows[i].probabilidade_chuva, rows[i].valvula, rows[i].consumo);

              array.push(completo);
            }

            res.render('res_completo', {res_completo:array});
          }else{
            res.render('res_completo', {res_completo:''});
          }
        }
      });
  }else{
    connection.query('SELECT DATE_FORMAT(data_hora, "%d/%m/%Y %H:%i:%s") as "data_hora", '+
      'valor_S01, valor_S02,valor_S03, valor_S04, status_umidade, clima, probabilidade_chuva, valvula, consumo '+
      'from jardim j '+
      'inner join usuario u on u.id = j.id_usuario '+
      'inner join analise a on a.id_jardim = j.id '+
      'where u.id = ?;', [id], function(err, rows){
        if(err){
          console.log('erro selectCompleto');
          throw err;
        }else{

          if (rows.length > 0) {
            var array = [];

            for (var i = 0; i < rows.length; i++) {

              var completo = new relatorioCompleto(rows[i].data_hora, rows[i].valor_S01,
                rows[i].valor_S02, rows[i].valor_S03, rows[i].valor_S04, rows[i].status_umidade,
                rows[i].clima, rows[i].probabilidade_chuva, rows[i].valvula, rows[i].consumo);

              array.push(completo);
            }

            res.render('res_completo', {res_completo:array});
          }else{
            res.render('res_completo', {res_completo:''});
          }
        }
      });
  }
});


app.get('/analise', function(req,res){

  if(req.query.umidade1==null || Number.isNaN(umidade1)){var umidade1 = 0}else{var umidade1 = parseInt(req.query.umidade1)};
  if(req.query.umidade2==null || Number.isNaN(umidade2)){var umidade2 = 0}else{var umidade2 = parseInt(req.query.umidade2)};
  if(req.query.umidade3==null || Number.isNaN(umidade3)){var umidade3 = 0}else{var umidade3 = parseInt(req.query.umidade3)};
  if(req.query.umidade4==null || Number.isNaN(umidade4)){var umidade4 = 0}else{var umidade4 = parseInt(req.query.umidade4)};
  var valvula = req.query.valvula;
  //var consumo = parseInt(req.query.consumo);
  var serial = req.query.serial;


  connection.query('select * from jardim where serial=?', [serial], function(err, rows){ //identifica o jardim cadastrado com o serial do arduino
    if (err) {
      console.log('erro select jardim em analise');
      throw err;
    }else{
      if(rows.length == 1){
        var id_jardim = rows[0].id; //define id do jardim com serial informado
        //var cidade = rows[0].cidade;

        //definir codigo da cidade
        if(typeof city == 'undefined'){
          city = '3448439';
        }
  //define parametro do API para obter previsao do tempo
  // ----------var path = 'http://api.openweathermap.org/data/2.5/forecast/city?id=' + city + '&APPID=' + keyprevisao + '&units=metric';

  //executa request do API 'openWeatherMap.org'
  //request(path, function (error, response, body) {
//    if (!error && response.statusCode == 200) {
      //res.json(JSON.parse(body));
//      var resposta = JSON.parse(body);
  //console.log(resposta.list);
  //console.log(resposta.list.length);
  //--------------------------var clima = resposta.list[0].weather[0].description;
  var clima = 'rain';

  //console.log(resposta.list[0].main.temp_max);
  //console.log(resposta.list[0].main.humidity);
//}else{
//  console.log(error)
//}

        //identifica grupo de plantas cadastrados no jardim identificado com o serial informado
        connection.query('select g.id, g.nome_grupo, g.umidade_min, g.umidade_max '+
          'from jardim j '+
          'inner join jardim_planta jp on jp.id_jardim = j.id '+
          'inner join planta p on p.id = jp.id_planta '+
          'inner join grupo_planta gp on gp.id_planta = p.id '+
          'inner join grupo g on g.id = gp.id_grupo '+
          'where id_jardim=?;', [id_jardim], function(err, rows){
            if (err) {
              console.log('erro select grupo_planta em analise');
              throw err;
            }else{
              //cria estância de grupo com as informações obtidas do banco
              var grupo = new Grupo(rows[0].id, rows[0].nome_grupo, rows[0].umidade_min, rows[0].umidade_max);

              //identifica os sensores cadastrados no jardim com o serial informado
              connection.query('select * from jardim_sensor where id_jardim = ?;', [id_jardim], function(err, rows){
                if (err) {
                  console.log('erro select jardim_sensor em analise');
                  throw err;
                }else{
                  var sensores = rows.length; //captura a quantidade de sensores cadastradas no jardim

                  /*
                   com a soma dos valores de umidade recebidos do arduino, divide-se pela quantidade de sensores cadastrados.
                   desse modo, obtem-se a media aritmética dos valores de umidade do solo e defini-se a média de umidade do jardim
                   */
                   //var media_umidade = (umidade1+umidade2+umidade3+umidade4)/sensores;
                   var media_umidade = umidade1;

                   if (media_umidade<grupo.umidade_min) {
                    var status_umidade='umido';
                   }else{
                    var status_umidade='seco';
                   }
                                    /*
                  compara a média de umidade do solo com o valor mínimo de umidade estabelecido no grupo que as plantas pertencem
                  */

                  /*  ------------------------------------
                    acertar valores do banco e converter
                    ------------------------------------
                  if (media_umidade >= grupo.umidade_min) {
                    var status_umidade = "umido";

                  //se a media de umidade do solo for igual ou superior o valor mínimo, entao o status do solo é definido 'umido'
                }else{
                  var status_umidade = "seco";
                  //se a média de umidade do solo for inferior ao valor mínimo, estão o estatus do solo é definido 'seco'
                }

                  /*----------implementação futura por condição do api free----------
                  se o status do solo for seco, analiza-se a condição climática para definir a regra de acionamento do válvula de água.
                  Regra de acionamento:
                    se estiver chovendo, rega-se ate 50% da condição máxima de umidade do solo
                    se não estiver chovendo, mas a probabilidade de chuva é superior a 50%, então rega-se 70% da condição maxima de umidade
                    se não estiver chovendo e a probabilidade de chuva for inferior a 50%, então rega-se completamente até a condição máxima de umidade

                  Se o solo estiver na condição umida, então não aciona a valvula.
                  -------------------------------------------------------------------
                  --atual------------------------------------------------------------

                  se o status de umidade do solo for 'seco', então verifico a condição climática atual:
                    sem chuva = rega até atingir o nivel 100% de humidade máxima da planta
                    com chuva fraca = rega até atingir 70% de umidade maxima da planta
                    com chuva moderada ou forte = rega até atingir 50% da umidade máxima da planta
                    */
                    if(status_umidade == "seco"){
                      if(clima.match(/light rain/)){
                        var response = {'acao':'70'};
                      }else if(clima.match(/rain/)){
                        var response = {'acao':'50'};
                      }else{
                        var response = {'acao':'100'};
                      }
                    }else{
                      var response = {'acao':'0'};
                    }

                  //insere os valores no banco de dados e registra a nalize na hora atual
                  connection.query('insert into analise(id_jardim, data_hora, valor_S01, valor_S02, valor_S03, valor_S04, media, '+
                    'status_umidade, clima, valvula, consumo) VALUES(?, now(), ?, ?, ?, ?, ?, ?, ?,?,?);',[id_jardim, umidade1, 0,
                    0, 0, media_umidade, status_umidade, clima, valvula, 0], function(err){
                      if (err) {
                        console.log('erro insert analise');
                        throw err;
                      }else{
                        res.json(response);
                        console.log(response);
                      }
                    });
                }
              });
            }
          });
//});
      }else{ //fim - não encontrou jardim cadastrado com o serial informado
        res.json('err'); //retorna erro e nao consegue executar nenhuma ação no sistema
      }
    }

  });
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


  app.get('/redefinir',function(req,res){
    var key =req.query.K;
    var id =req.query.I;
    connection.query('SELECT * FROM usuario WHERE id = ?', [ id ] ,
      function(err, rows){
        if(err) throw err;
        if(rows.length === 1){
          var id = rows[0].id;
          var nome = rows[0].nome;
          var pwd = rows[0].senha;
          if(pwd.substr(5,20)==key){
            res.render('redefinir', {key: key, id:id})
          }else {
          res.send("Dados invalidos");//user não cadastrado
        }
      }else{
        res.send("Dados invalidos");//user não cadastrado
      }
    });
  });


  app.post('/redefinirpost',function(req,res){
    var senha = req.body.senha;
    var key = req.body.key;
    var id = req.body.id;
    var hash = bcrypt.hashSync(senha);
    console.log(senha, hash);
    connection.query('SELECT * FROM usuario WHERE id = ?', [ id ] ,
      function(err, rows){
        if(err) throw err;
        if(rows.length === 1){
          var id = rows[0].id;
          var nome = rows[0].nome;
          var pwd = rows[0].senha;
          if(pwd.substr(5,20)==key){
           //criptografia
           connection.query('UPDATE usuario SET senha = ? WHERE id =?',[ hash,id ] ,
            function(err){
              if(err) throw err;
              console.log('update ok',res);
              res.send("Dados atualizados| ");//user não cadastrado
            });

          }else {
          res.send("Dados invalidos");//user não cadastrado
        }
      }else{
        res.send("Dados invalidos");//user não cadastrado
      }
    });

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


//loadWeather('3448439');

/*
function loadWeather(req, res, city) {
  console.log('loadWeather', city)
  var path = 'http://api.openweathermap.org/data/2.5/forecast/city?id=' + city + '&APPID=' + keyprevisao + '&units=metric';
  console.log('path', path);
  request(path, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.json(JSON.parse(body));
      var resposta = JSON.parse(body);
      //console.log(resposta.list);
      //console.log(resposta.list.length);
      console.log(resposta.list[0].main.temp_min);//
      console.log(resposta.list[0].main.temp_max);
      console.log(resposta.list[0].main.humidity);
  }else{
    console.log(error)
  }
});
}
*/

//app.post('/registrar', previsaoController.previsao);
app.post('/registrar', userController.registrar);
app.get('/previsao', previsaoController.previsao);

/*
app.get('/previsao', function(req, res) {
  console.log('previsao get');
  var city = req.query.city;
  if(typeof city == 'undefined') {
    city = '3448439';
  }
  loadWeather(req, res, city);
});
*/


    //Chama Metodo de Conexão ao executar app
    connection.connect(function(err){
      if(err) throw err;
      console.log('Conectado no MySQL');
      app.listen(3000, function(){
        console.log('Servidor Arduino -> http://localhost:3000');
      });
    });


