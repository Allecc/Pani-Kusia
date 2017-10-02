angular
  .module('paniKusia', ['ui.router'])
  .config(function($locationProvider, $urlRouterProvider, $stateProvider, $anchorScrollProvider) {
    let categoryState = {
      name: 'categoryState',
      url: '/',
      templateUrl: '/partials/category.html'
    }

    let productsState = {
      name: 'productsState',
      url: '/products',
      templateUrl: '/partials/products.html'
    }

    $stateProvider.state(categoryState);
    $stateProvider.state(productsState);

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/');
    $anchorScrollProvider.disableAutoScrolling()
  })
  .controller('kusiaCtrl', function ($scope, $window, $http, $location, $anchorScroll) {
    $scope.scrollTo = function(id) {
      $location.hash(id);
      $anchorScroll();
     }

    var screenWidth = $window.innerWidth;
    if(screenWidth < 1024){
      $scope.displayText = 'true'
    } else {
      $scope.displayText = 'false';
    }

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

      $scope.contact = {
        street: '',
        post: '',
        telephone: '',
        mail: '',
        targetMail: ''
      }

      // get contact
      $http.get('/get/contact')
        .then( res => {
          $scope.contact = {
            street: res.data.street,
            post: res.data.post,
            telephone: res.data.telephone,
            mail: res.data.mail,
            targetMail: res.data.targetMail
          }
        });

    // Loading categories
    $http.get('/get/categories')
      .then( res => {
        $scope.categories = res.data;
      });

    let lastCategory = -1
    // display last selected category

    // load products from selected category, set proper history state
    $scope.displayProduct = function (id){
      if(lastCategory != id){
        delete $scope.products;

        $http.get('/get/products/' + id)
        .then( res => {
            $scope.products = res.data;
            lastCategory = id;
        });
      }
    };

    /*----------- Cart section ---------*/
    $scope.addToCart = function( id ){
      $http.post('/add/cart', {id: id})
      .then( () => {
        getCart();
      });
    }

    $().ready(function(){
      getCart();
    });

    function calculateLiHeight(){
      let rowsNumber = 0;
      $().ready(function(){
        $('#modalCartBody li').each(function(){
          rowsNumber++;
        });

        $('#modalCartBody').height(rowsNumber * 20); // calculate height of the products in cart
      });
    }

    /* get cart */
    function getCart(){
      $http.get('/get/cart')
      .then( cart => {
        $scope.cart = cart.data;
        calculateLiHeight();
      });
    }

    $scope.deleteFromCart = function(id){
      $http.post('/delete/cart',  {id: id})
        .then( () => {
          getCart();
        });
    }
    /*----------- End cart section ---------*/
});
//.value('$anchorScroll', angular.noop);
