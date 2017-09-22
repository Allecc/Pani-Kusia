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
        console.log(res.data[0]);
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
    $http.get('/get/products')
      .then( res => {
        $scope.categories = res.data;
      });

    $scope.addToCart = function( id ){
      $http.post('/add/cart', {id: id})
      .then( () => {
        console.log('Added: ' + id);
      });
    }
  });
