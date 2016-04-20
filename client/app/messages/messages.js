angular.module('codellama.messages', [])
.factory('Conversations', function($http) {
  var getConversations = function(username, clickedName, isTutor) {
    return $http({
      method: 'GET',
      url: '/api/messages/' + username + '/' + clickedName + '/'  + isTutor,
    }).then(function(data) {
      return data.data;
    }, function(err) {
      console.log('Could not retrieve messages.');
      console.error(err);
    });
  };

  var createMessage = function(message) {
    return $http({
      method: 'PUT',
      url: 'api/messages',
      data: message,
    }).then(function(data){
      return data.data;
    }, function(err) {
      console.error(err);
    });
  };

  return {
    getConversations: getConversations,
    createMessage: createMessage,
  };
})
.controller('MessagesController', function($scope, $window, $location, $rootScope, Conversations) {
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

  $scope.chats = [];
  $scope.currentConversation = '';

  $scope.getChats = function() {
    var username = $window.localStorage.getItem('username');
    var clickedName = this.obj.user;
    var isTutor = $window.localStorage.getItem('isTutor');
    $scope.currentConversation = clickedName;
    // $scope.chats = Conversations.getConversations(username, clickedName, isTutor);
  };

  $scope.send = function() {
    var messageObj = {
      username: $window.localStorage.getItem('username'),
      clickedName: $scope.currentConversation,
      isTutor: $window.localStorage.getItem('isTutor'),
      messageBody: $scope.newMessage,
    };
    if (messageObj.clickedName) {
      console.log(messageObj);
    }

    // Conversations.createMessage();
    $scope.newMessage = '';
  };

});
