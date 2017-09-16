angular
  .module('paniKusia', [])
  .controller('produktyController', function ($scope, $window, $http) {
    var screenWidth = $window.innerWidth;
    if(screenWidth < 1024){
      $scope.displayText = 'true'
    } else {
      $scope.displayText = 'false';
    }

    // Loading about
    $http.get('/get/about')
      .then( res => {
        $scope.about = res.data;
      });

    // Loading categories
    $http.get('/get/categories')
      .then( res => {
        $scope.categories = res.data;
      });

    // Loading contact
  });
