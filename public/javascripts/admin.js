angular
  .module('paniKusia', [])
  .controller('kusiaCtrl', ['$scope', '$http', function($scope, $http){
    /* Section displayed */
    $scope.tab = {
      dashboard: true,
      products: false,
      users: false,
      about: false
    };

    $scope.informationTab = function (){
      $scope.tab.dashboard = true;
      $scope.tab.products = false;
      $scope.tab.users = false;
      $scope.tab.about = false;
    }

    $scope.productsTab = function (){
      $scope.tab.dashboard = false;
      $scope.tab.products = true;
      $scope.tab.users = false;
      $scope.tab.about = false;
    }

    $scope.userTab = function(){
      $scope.tab.dashboard = false;
      $scope.tab.products = false;
      $scope.tab.users = true;
      $scope.tab.about = false;
    }

    $scope.aboutTab = function(){
      $scope.tab.dashboard = false;
      $scope.tab.products = false;
      $scope.tab.users = false;
      $scope.tab.about = true;
    }
    /* Section displayed */

    $scope.newProduct = {
      title: '',
      description: '',
      price: '',
      image: '',
      CategoryId: null
    }

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

    $scope.about = {
      title: '',
      content: ''
    }
    // get about
    $http.get('/get/about')
      .then( res => {
        $scope.about = {
          title: res.data[0].title,
          content: res.data[0].content
        }
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

    $scope.editAbout = function (){
      let about = {
        title: $scope.about.title,
        content: $scope.about.content
      }

      $http.put('/edit/about', about)
        .then(function (){
          location.reload();
        });
    }
  }]);
