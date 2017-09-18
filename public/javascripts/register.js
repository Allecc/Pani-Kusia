angular
  .module('paniKusia', [])
  .controller('kusiaCtrl', ['$scope', '$http', function($scope, $http){
    $scope.user = {
      name: '',
      password: '',
      repeatPassword: ''
    }

    $scope.details = {
      name: '',
      forname: '',
      street: '',
      post: '',
      city: '',
      phone: '',
      mail: '',
      additional: ''
    }

    $scope.repeatPassword = '';
    $scope.wrongRepeat = false;
    $scope.wrongName = false;
    $scope.register = function () {
      // check passwords
      if($scope.user.password !== $scope.user.repeatPassword){
        $scope.wrongRepeat = true;
      } else {
        $scope.wrongRepeat = false;
      }

      // check username
      if($scope.user.name == ''){
        $scope.wrongName = true;
      } else {
        $scope.wrongName = false;
      }

      if($scope.wrongRepeat){
        $('#wrongRepeat').addClass('animated flash').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          $(this).removeClass('animated flash');
        });
      }

      if($scope.wrongName){
        $('#wrongName').addClass('animated flash').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
          $(this).removeClass('animated flash');
        });
      }

      if(!$scope.wrongName && !$scope.wrongRepeat){
        addUser();
      }
    }

    function addUser(){
      console.log($scope.user);

      let user = {
        username: $scope.user.name,
        password: $scope.user.password
      }

      $http.post('/add/user', user)
        .then(function (){
          location.href = './';
        });
    }

    $scope.basic = true;
    $scope.next = function(){
      $scope.basic = false;
    }
  }]);
