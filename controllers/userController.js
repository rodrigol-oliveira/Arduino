var _this = {};
module.exports = {

  setup: function(connection, bcrypt) {
    _this.connection = connection;
    _this.bcrypt = bcrypt;
    

  },

  viewAlterarUsuario: function(req, res) {
    if(!req.session.user || !req.session.user.nome || !req.session.user.id){
      res.redirect('/viewIniciar');
    }else{
      var id_usuario = req.session.user.id;
      _this.connection.query('SELECT nome,sobrenome,email from usuario where id=?;', [id_usuario], function(err, rows){
        if(err){
          conosole.log('erro select usuario view AlterarUsuario');
          throw err;
        }else{
          var usuario = {id:id_usuario, nome:rows[0].nome, sobrenome:rows[0].sobrenome, email:rows[0].email};
          console.log(usuario);
          res.json(usuario);
          //res.render('alterarUsuario', {usuario:usuario});
        }
      });
    }
  },

  registrar:function(req, res){
    if(!req.session.user || !req.session.user.nome || !req.session.user.id){
      var nome = req.body.nome;
  var sobrenome = req.body.sobrenome;
  var email = req.body.email;
  var senha = req.body.senha;
  var hash = _this.bcrypt.hashSync(senha); //criptografia
  _this.connection.query('INSERT INTO usuario(nome, sobrenome, email, senha) VALUES (?,?,?,?);',
    [nome, sobrenome, email, hash ] ,
    function(err, res){
      if(err) throw err;
    });
  res.render('iniciar');
    }else{
      res.redirect('/viewAlterarUsuario');
    }
  
  },




};
