/* This module handles the tutor's profile view */
angular.module('codellama.tutor', [])

  .service('TutorService', function($http, $window) {
    this.tutorData = null;

    this.getTutorProfile = function(username) {
      return $http({
        method: 'GET',
        url: '/api/users/' + username
      })
      .then(function (resp) {
        return resp.data;
      });
    };

    this.likeTutor = function(username) {
      return $http({
        method: 'PUT',
        data: {username: username},
        url: '/api/users/addLike'
      })
      .then(function(resp) {
        return resp.data;
      });
    };

    this.messageTutor = function(tutorName) {
      var username = $window.localStorage.getItem('username');
      return $http({
        method: 'PUT',
        data: {username: username,
               tutorName: tutorName},
        url: '/api/tutorlist'
      })
      .then(function(resp) {
        return resp.data;
      });
    };
  })

  .controller('TutorController', function ($scope, TutorService, $routeParams, $location, $window) {
    TutorService.getTutorProfile($routeParams.username)
    .then(function(data) {
      TutorService.tutorData = data;
    });

    $scope.messageTutor = function(tutorName) {
      TutorService.messageTutor(tutorName)
      .then(function(resp) {
        $location.path('/messages');
      })
      .catch(function(error) {
        console.log('Error updating the messageTutor', error);
        if (error.data === 'Tutor Exists') {
          $location.path('/messages');
        }
      });
    };

    $scope.likeTutor = function(username) {
      TutorService.likeTutor(username)
      .then(function(resp) {
        $scope.tutor.likes = resp.likes;
      })
      .catch(function(error) {
        console.log('there was an error updating number of likes', error);
      });
    };

    $scope.$watch(
      function() { return TutorService.tutorData; },

      function(newVal) {
        $scope.tutor = newVal;
      }
    );

    $scope.isOwnProfile = function(tutorName) {
      var username = $window.localStorage.getItem('username');
      return tutorName === username;
    };

    $scope.updateProfile = function() {
      $location.path('/update');
    };
  });


