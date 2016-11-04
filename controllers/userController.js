var _this = {};

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
  }
};
