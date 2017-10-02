angular
  .module('paniKusia', ['ui.router'])
  .config(function($stateProvider, $locationProvider, $urlRouterProvider, $anchorScrollProvider) {
    let confirmCartState = {
      name: 'confirmCart',
      url: '/order',
      templateUrl: '/partials/confirmCart.html'
    }

    let personalFormState = {
      name: 'personalForm',
      url: '/personal-form',
      templateUrl: '/partials/personalForm.html'
    }

    let paymentState = {
      name: 'payment',
      url: '/payment',
      templateUrl: '/partials/payment.html'
    }

    $stateProvider.state(confirmCartState);
    $stateProvider.state(personalFormState);
    $stateProvider.state(paymentState);

    $locationProvider.html5Mode(true);
    $urlRouterProvider.otherwise('/order');
    $anchorScrollProvider.disableAutoScrolling()
  })
  .controller('kusiaCtrl', function ($scope, $window, $http, $location, $anchorScroll) {
    $scope.scrollTo = function(id) {
      location.href = '/#' + id;
     }

    $scope.user = {
      name: '',
      forname: '',
      street: '',
      post: '',
      city: '',
      telephone: '',
      mail: '',
      telephone2: ''
    }

    $scope.testUser = function(){
      console.log($scope.user);
    }

    let myState  = {
      nextCart: false
    }
    $scope.nextCart = false;
    $scope.swapCart = function(){
      $scope.nextCart = !$scope.nextCart;
      myState.nextCart = $scope.nextCart;
      window.history.pushState(myState, '', '');
    }
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

function invalidField(field){
  $(field).addClass('wrongElement');
  $('#warningMessage').show();
}
