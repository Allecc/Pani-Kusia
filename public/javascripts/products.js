angular
  .module('paniKusia', [])
  .controller('produktyController', function ($scope, $window, $http) {
    var screenWidth = $window.innerWidth;
    if(screenWidth < 1024){
      $scope.displayText = 'true'
    } else {
      $scope.displayText = 'false';
    }
    $http.get("/load")
      .then(function (response) {
      $scope.produkty = response.data;
      });
  });
