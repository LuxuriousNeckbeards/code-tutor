
angular.module('codellama.search', [])

  .service('SearchService', function($http, $window) {

    // initialize empty tutor data array that will hold search results
    this.tutorData = [];

    this.getTutors = function(city, subjects) {
      // parsing the strings will be handled sever-side

      return $http({
        method: 'GET',
        url: '/api/users/search',
        params: {
          city: city,
          subjects: subjects
        }
      })
      .then(function (resp) {
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

  .controller('SearchController', function ($scope, SearchService, $location) {

    // show search bar when in root path
    $scope.isActive = function () {
      console.log('location path', $location.path());
      console.log('/' === $location.path());
      return '/' === $location.path();
    };

    // define search on scope
    $scope.search = function(city, subjects) {

      // call function from SearchService
      SearchService.getTutors(city, subjects)

        // upon success, assign returned tutors data to scope's tutorData
        .then(function(tutors) {
          SearchService.tutorData = tutors;
          $location.path('/search');
        })

        // on error, console log error
        .catch(function(error) {
          console.log('There was an error retrieving tutor data: ', error);
        });
    };

    
  })

  .controller('SearchResultsController', function ($scope, $location, SearchService) {

    $scope.tutor = {};
    $scope.tutor.likes = 0;

    $scope.clicked = function() {
      console.log('clicked');
      $scope.tutor.likes++;
      console.log('$scope.tutor.likes is', $scope.tutor.likes);
    };

    $scope.$watch(
      function() { return SearchService.tutorData; },

      function(newVal) {
        $scope.tutorData = newVal;
        $scope.subjectLength = newVal.length;
      }
    );

    // console.log(SearchService.tutorData);
    // console.log('$search results scope.tutorData:', $scope.tutorData);
    $scope.messageTutor = function(tutorName) {
      SearchService.messageTutor(tutorName)
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


  });


