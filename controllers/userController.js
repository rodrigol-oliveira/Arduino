var _this = {};
var bcrypt = require('bcrypt-nodejs'); //<!-- criptografia-->
module.exports = {
  
  setup: function(connection) {
    _this.connection = connection;
  },

  viewAlterarUsuario: function(req, res) {
    if(!req.session.user || !req.session.user.nome || !req.session.user.id){
      res.redirect('/viewIniciar');
    }else{
      var id_usuario = req.session.user.id;

      _this.connection.query('SELECT * from usuario where id=?;', [id_usuario], function(err, rows){
        if(err){
          conosole.log('erro select usuario viewAlterarUsuario');
          throw err;
        }else{
          var usuario = new Usuario(rows[0].id, rows[0].nome, rows[0].sobrenome, rows[0].genero, rows[0].email);
          res.render('alterarUsuario', {usuario:usuario});
        }
      });
    }
  },

  registrar:function(req, res){
  var nome = req.body.nome;
  var sobrenome = req.body.sobrenome;
  var email = req.body.email;
  var senha = req.body.senha;
  var genero = req.body.genero;
  var hash = bcrypt.hashSync(senha); //criptografia
  _this.connection.query('INSERT INTO usuario(nome, sobrenome, genero, email, senha) VALUES (?,?,?,?,?);',
    [nome, sobrenome, genero, email, hash ] ,
    function(err, res){
      if(err) throw err;
    });
  res.render('iniciar');
  },




};
