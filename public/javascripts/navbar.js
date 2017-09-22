angular
  .module('navbarModule', [])
  .controller('navbarCtrl', function($scope, $http){
    /* get cart */
    $http.get('/get/cart')
      .then( cart => {
        $scope.cart = cart;
      });
  });
