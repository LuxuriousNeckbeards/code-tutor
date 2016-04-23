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

  var removeConversation = function(clickedName, isTutor) {
    return $http({
      method: 'PUT',
      url: '/api/removeFromList',
      data: {
        clickedName: clickedName,
        isTutor: isTutor
      }
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
    removeConversation: removeConversation
  };
})
.controller('MessagesController', function($scope, $rootScope, $window, Conversations) {
  $scope.currentConversation = '';
  $rootScope.chats = [];

  var socket = io.connect('http://10.6.30.207:8080/');
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

  $scope.getClass = function(index, chats) {
    return chats[index].username === localStorage.username ? 'chat-message-send' : 'chat-message-recieve';
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

  $scope.removeConversation = function() {
    var clickedName = this.convo;
    var isTutor = $window.localStorage.getItem('isTutor');
    Conversations.removeConversation(clickedName, isTutor)
      .then(function(data) {
        $scope.convoList = [];

        /* Reset view to initial empty view: */
        init();
        $rootScope.chats = [];
        $scope.currentConversation = '';
      });
  };

  init();
});
