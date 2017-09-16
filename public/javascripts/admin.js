angular
  .module('adminKusia', [])
  .controller('adminKusiaCtrl', ['$scope', '$http', function($scope, $http){
    /* Section displayed */
    $scope.tab = {
      dashboard: true,
      products: false,
      users: false
    };
    
    $scope.informationTab = function (){
      $scope.tab.dashboard = true;
      $scope.tab.products = false;
      $scope.tab.users = false;
    }

    $scope.productsTab = function (){
      $scope.tab.dashboard = false;
      $scope.tab.products = true;
      $scope.tab.users = false;
    }

    $scope.userTab = function(){
      $scope.tab.dashboard = false;
      $scope.tab.products = false;
      $scope.tab.users = true;
    }
    /* Section displayed */

    $scope.newProduct = {
      title: '',
      description: '',
      price: '',
      image: '',
      CategoryId: null
    }

    $scope.filterFunction = function(element) {
      return element.name.match(/^Ma/) ? true : false;
    };

    // get products
    $http.get('/get/products')
    .then( res => {
      $scope.products = res.data;
    });

    // get categories
    $http.get('/get/categories')
    .then( res => {
      $scope.categories = res.data;
    });

    // get users
    $http.get('/get/users')
      .then( res => {
        $scope.users = res.data;
      });

    $scope.addProduct = function (){
      console.log($scope.newProduct);
      $http.post('/add/product', $scope.newProduct)
        .then(function (){
          location.reload();
        });
    }

    $scope.addCategory = function (){
      console.log($scope.newCategory);
      $http.post('/add/category', $scope.newCategory)
        .then(function (){
          location.reload();
        });
    }
  }]);
