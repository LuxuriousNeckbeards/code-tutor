angular.module('codellama.messages', [])
.controller('MessagesController', function($scope, $window, $location, $rootScope) {
  $scope.message = 'WHARBLE GARBLE';
  $scope.data = [{user: 'bill', recentMessage: 'wef wefowf wefoidnqk w ergpow  uh iug g f h oih iu ut ytrd o j n bui uvytcyaiojhuvgyb  iy gftyu uief'},
                 {user: 'dave', recentMessage: 'taco poop fart butt'},
                 {user: 'sarah', recentMessage: 'wiubwefwe fwooisna speoq we erhpsj'},
                 {user: 'vini', recentMessage: 'bush did 9/11'},
                 {user: 'skye', recentMessage: 'abc 123 do re mi'},
                 {user: 'rane', recentMessage: 'q vovpg e ebf we e t went toofnvovbpweig'},
                 {user: 'liam', recentMessage: 'oansdfoigfw we gw eg weg ewg'},
                 {user: 'chucknorris', recentMessage: 'vvvvv vvv vv vvv vv vvv vv vvv'},
               ];
})
