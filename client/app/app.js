
  angular.module('codellama', [
    'codellama.services',
    'codellama.tutor',
    'codellama.search',
    'codellama.auth',
    'codellama.fileUpload',
    'codellama.nav',
    'codellama.video',
    'codellama.messages',
    'ngRoute'])

  .config(function ($routeProvider, $locationProvider, $httpProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
      .when('/', {
        templateUrl: 'app/homepage/home.html',
      })
      .when('/search', {
        templateUrl: 'app/search/searchResults.html',
        controller: 'SearchResultsController'
      })
      .when('/messages', {
        templateUrl: 'app/messages/messageview.html',
        controller: 'MessagesController'
      })
      .when('/video', {
        templateUrl: 'app/video-chat/video-chatview.html',
        controller: 'VideoChatController'
      })
      .when('/signup', {
        templateUrl: 'app/auth/signup.html',
        controller: 'AuthController'
      })
      .when('/login', {
        templateUrl: 'app/auth/signin.html',
        controller: 'AuthController'
      })
      .when('/logout', {
        resolve: {
          logoutSuccess: function($location, $window, $route) {
            $window.localStorage.clear();
            $location.path('/');
            $window.location.reload();
          }
        }
      })
      .when('/update', {
        templateUrl: 'app/profile/update.html',
        controller: 'uploadCtrl'
      })
      .when('/users/:username', {
        templateUrl: 'app/tutors/tutor.html',
        controller: 'TutorController'
      })
      .when('/about', {
        templateUrl: 'app/about/about.html'
      })
      .when('/tutorlist', {
        template: 'Hello World'
      })
      .when('/studentlist', {
        template: 'Hello World'
      })
      .otherwise({
        redirectTo: '/'
      });

    // We add our $httpInterceptor into the array
    // of interceptors. Think of it like middleware for your ajax calls
    $httpProvider.interceptors.push('AttachTokens');
  })
    .factory('AttachTokens', function ($window) {
      // this is an $httpInterceptor
      // its job is to stop all out going request
      // then look in local storage and find the user's token
      // then add it to the header so the server can validate the request
      var attach = {
        request: function (object) {
          var jwt = $window.localStorage.getItem('com.codellama');
          if (jwt) {
            object.headers['x-access-token'] = jwt;
          }
          object.headers['Allow-Control-Allow-Origin'] = '*';
          return object;
        }
      };
      return attach;
    })
    .run(function ($rootScope, $location, Auth) {

      $rootScope.loggedIn = Auth.isLoggedIn();
      $rootScope.isTutor = !Auth.isLoggedInButNotTutor();

      // here inside the run phase of angular, our services and controllers
      // have just been registered and our app is ready
      // however, we want to make sure the user is authorized
      // we listen for when angular is trying to change routes
      // when it does change routes, we then look for the token in localstorage
      // and send that token to the server to see if it is a real user or hasn't expired
      // if it's not valid, we then redirect back to signin/signup
      // $rootScope.$on('$routeChangeStart', function (evt, next, current) {
      //   if (next.$$route && next.$$route.authenticate && !Auth.isLoggedIn()) {
      //     $location.path('/signin');
      //   }
      // });
    });
