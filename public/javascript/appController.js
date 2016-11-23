 angular.module('app', [])
    .controller('paginaPrincipalController', ['$scope', function($scope) {

      $scope.screenData = {};


    
		     
      $scope.screenData.plantas = ['A - Aglaonema','Antúrio','Begônia','Babosa de Pau'];
      $scope.screenData.sensores = ['movimento','umidade','termometro','wifi'];
      $scope.screenData.valvulas = ['rapida','media','lenta'];




      $scope.gravaDadosUsuario = function(){

      }

      $scope.login = function(){

      }

      $scope.validaDadosUsuario = function(){

      }

      $scope.alteraJardim = function(){ 

      }


}]);




