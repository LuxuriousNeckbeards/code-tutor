/* This module handles updating the profile, including photo upload, subjects, and cities */
var app = angular.module('codellama.fileUpload', ['ngFileUpload', 'checklist-model']);

app.controller('uploadCtrl', ['$scope', 'Upload', '$timeout', '$location', '$window', '$rootScope', function ($scope, Upload, $timeout, $location, $window, $rootScope) {
  $scope.data = {};
  $scope.data.subjects = [];
  $scope.data.location = {};

  $scope.subjects = [
    'Javascript',
    'C',
    'Python',
    'Ruby',
    'Angular',
    'React',
    'Backbone',
    'HTML',
    'CSS'
  ];

  $scope.cities = [
    'San Francisco',
    'San Jose',
    'San Mateo',
    'Cupertino',
    'Mountain View',
    'Sunnyvale',
    'Berkeley',
    'Oakland'
  ];

  $scope.uploadPic = function(file) { //uploads pic and/or new profile information

    // data.isTutor is assigned conditionally in update.html
    // but we want it to be default true for becometutor.html
    // console.log('$scope.data.isTutor is',$scope.data.isTutor);
    // if ($scope.data.isTutor === undefined) {
    //   $scope.data.isTutor = true;
    // }
    console.log('$scope.data.isTutor is',$scope.data.isTutor);

    // $scope.data.isTutor = $scope.data.isTutor || true;

    if (!file) { var file = {}; } else {  $scope.data.file = file;  }

    file.upload = Upload.upload({
      url: 'api/users/profile',
      data: $scope.data
    });

    file.upload.then(function (response) {
      $timeout(function () {
        file.result = response.data;
      });
      // reset become tutor option, if the tutor form 'is tutor' checkbox is checked
      if ($scope.data.isTutor) {
        $rootScope.isTutor = true;
        $window.localStorage.setItem('isTutor', true);
      }
      // redirect to home
      $location.path('/users/' + $window.localStorage.getItem('username'));

    }, function (response) {
      if (response.status > 0) {
        $scope.errorMsg = response.status + ': ' + response.data;
      }
    }, function (evt) {
      // Math.min is to fix IE which reports 200% sometimes
      file.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
    });
  };
}]);
