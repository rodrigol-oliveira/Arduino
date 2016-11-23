var _this = {};

module.exports = {
  setup: function(keyprevisao, request) {
    _this.keyprevisao = keyprevisao;
    _this.request = request;
  },
  loadWeather: function(req, res, city) {
    console.log('loadWeather', city)
    var path = 'http://api.openweathermap.org/data/2.5/forecast/city?id=' + city + '&APPID=' + _this.keyprevisao + '&units=metric';
    console.log('path', path);
    _this.request(path, function (error, response, body) {
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
  },
  previsao: function(req, res){
    console.log('previsao get');
    var city = req.query.city;
    if(typeof city == 'undefined') {
      city = '3448439';
    }
    module.exports.loadWeather(req, res, city);
  }
};
