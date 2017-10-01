angular
  .module('paniKusia', [])
  .controller('kusiaCtrl', function ($scope, $window, $http) {
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

      // Set state on page pload
      var stateObj = {
        'categoryToShow': -1,
        'displayProducts': false
      };

    //$().ready(function(){
      if(!window.history.state){
       window.history.pushState(stateObj, '', '');
     }
     console.log(window.history.state);
    //});

    // Show products in CategoryId
    let lastCategory = window.history.state.categoryToShow;
    // display last selected category
    if(lastCategory >= 0 && window.history.state.displayProducts){
      $http.get('/get/products/' + lastCategory)
      .then( res => {
          $scope.products = res.data;
      });
      $scope.showProducts = true;
      stateObj.displayProducts = true;

      window.history.replaceState(stateObj, '', '');
    } else {
      $scope.showProducts = false;
    }

    // load products from selected category, set proper history state
    $scope.displayProduct = function (id){
      $scope.showProducts = !$scope.showProducts;

      stateObj.displayProducts = !stateObj.displayProducts;
      window.history.replaceState(stateObj, '', '');

      if($scope.showProducts && lastCategory != id){
        delete $scope.products;

        stateObj.categoryToShow = id;
        window.history.replaceState(stateObj, '', '');

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
