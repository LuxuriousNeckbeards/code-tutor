angular.module('codellama.messages', [])
.factory('Conversations', function($http) {
  var getMessages = function(username, clickedName, isTutor) {
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

  var getConversations = function (listType) {
    return $http({
      method: 'GET',
      url: '/api/' + listType,
    }).then(function(data) {
      return data.data;
    }, function(err) {
      console.error(err);
    });
  };

  return {
    getMessages: getMessages,
    createMessage: createMessage,
    getConversations: getConversations,
  };
})
.controller('MessagesController', function($scope, $window, $location, $rootScope, Conversations) {
  $scope.convoList;
  $scope.chats = [];
  $scope.currentConversation = '';

  var init = function() {
    var isTutor = $window.localStorage.getItem('isTutor');
    Conversations.getConversations(isTutor ? 'tutorList' : 'studentList')
      .then(function(data) {
        if (data.allTutors.length > 0) {
          $scope.convoList = data;
        }
      });
  };

  $scope.loadConversation = function() {
    var username = $window.localStorage.getItem('username');
    var clickedName = this.convo.user;
    var isTutor = $window.localStorage.getItem('isTutor');
    $scope.currentConversation = clickedName;
    // $scope.chats = Conversations.getMessages(username, clickedName, isTutor);
  };

  $scope.send = function() {
    var messageObj = {
      username: $window.localStorage.getItem('username'),
      clickedName: $scope.currentConversation,
      isTutor: $window.localStorage.getItem('isTutor'),
      messageBody: $scope.newMessage,
    };
    if (messageObj.clickedName) {
      // Conversations.createMessage(JSON.stringify(messageObj));
    }
    $scope.newMessage = '';
  };
  init();
});
