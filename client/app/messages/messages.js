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
      console.log('create message client side response ', data.data);

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
  // $scope.convoList = [{user: 'Rane', recentMessage: 'dyv uh u oi hgyut io iuyf i'},{user: 'Liam', recentMessage: 'df wefwefo84htb 343984fw3 34 '}];
  $scope.chats = [];
  $scope.currentConversation = '';

  var init = function() {
    var isTutor = $window.localStorage.getItem('isTutor');

    Conversations.getConversations(isTutor === 'true' ? 'studentList' : 'tutorList')
      .then(function(data) {
        var listType = isTutor === 'true' ? 'allStudents' : 'allTutors';
        if (data[listType].length > 0) {
          $scope.convoList = data[listType];
        }
      });
  };

  $scope.loadConversation = function() {
    $scope.chats = undefined;
    var username = $window.localStorage.getItem('username');
    var clickedName = this.convo;
    var isTutor = $window.localStorage.getItem('isTutor');
    $scope.currentConversation = clickedName;
    Conversations.getMessages(username, clickedName, isTutor)
      .then(function(data) {
        if (data[0]) {
          $scope.chats = data[0].messages.reverse();
        }
      });
  };

  $scope.send = function() {
    var messageObj = {
      username: $window.localStorage.getItem('username'),
      clickedName: $scope.currentConversation,
      isTutor: $window.localStorage.getItem('isTutor'),
      messageBody: $scope.newMessage,
    };
    if (messageObj.clickedName && messageObj.messageBody) {
      Conversations.createMessage(JSON.stringify(messageObj));

      // TODO: use sockets instead of this
      Conversations.getMessages(messageObj.username, messageObj.clickedName, messageObj.isTutor)
      .then(function(data) {
        if (data[0]) {
          $scope.chats = data[0].messages.reverse();
        }
      });
    }
    $scope.newMessage = '';
  };
  init();
});
