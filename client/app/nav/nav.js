angular.module('codellama.nav', [])

.controller('NavController', function($scope, $rootScope, Auth, $location, $window) {

  // adds bootstrap active class if path matches href value
  $scope.isActive = function (viewLocation) {
    return viewLocation === $location.path();
  };

  $scope.username = $window.localStorage.getItem('username');

});
