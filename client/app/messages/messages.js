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
.controller('MessagesController', function($scope, $rootScope, $window, Conversations) {
  $scope.currentConversation = '';
  $rootScope.chats = [];

  var socket = io.connect('http://10.6.31.195:8080/');
  socket.on('connect', function(data) {
    socket.emit('joinChat', 'Hello World from chat client');
  });

  socket.on('updatedChat', function(data) {
    $rootScope.$apply(function() {
      if ($rootScope.chats.length < 1 ||$rootScope.chats[0].messageBody !== data.messageBody) {
        $rootScope.chats.unshift(data);
      }
    });
  });

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
    var username = $window.localStorage.getItem('username');
    var clickedName = this.convo;
    var isTutor = $window.localStorage.getItem('isTutor');
    $scope.currentConversation = clickedName;
    Conversations.getMessages(username, clickedName, isTutor)
      .then(function(data) {
        if (data[0]) {
          $rootScope.chats = data[0].messages.reverse();
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
      socket.emit('chat', {username: messageObj.username, messageBody: messageObj.messageBody});
      Conversations.createMessage(JSON.stringify(messageObj));
    }
    $scope.newMessage = '';
  };

  init();
});
