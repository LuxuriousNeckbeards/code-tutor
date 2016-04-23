angular.module('codellama.video', [])
.factory('VideoChat', function($http) {
  var getSessionInfo = function() {
    return $http({
      method: 'GET',
      url: '/api/videochat',
    }).then(function(data) {
      console.log('OpenTok Session Data: ', data);
      return data;
    }, function(err) {
      console.log('Could not retrieve OpenTok session info.');
      console.error(err);
    });
  };

  return {
    getSessionInfo: getSessionInfo,
  };

})
.controller('VideoChatController', ['$scope','VideoChat', function($scope, VideoChat) {

  var socket = io.connect('http://159.203.209.83:8080/');
  socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
  });

  socket.on('updatedState', function(data) {
    console.log('DATA object: ', data);
    console.log('STATE: ', data.state);

    // console.log(localStorage.username, '--', data.user);
    if (localStorage.username !== data.user) {
      editor.setValue(data.state);
    }
  });

  /* Text Editor Session: */
  $scope.setEditorLanguage = function(selector) {
    editor.getSession().setMode('ace/mode/' + selector.languageSelector);
  };

  $scope.saveFileLocally = function() {
    var filename = prompt('Enter a name for this file, including an extension.');
    if(filename.length > 0) {
      var blob = new Blob([editor.getValue()], {type: "text/plain;charset=utf-8"});
      saveAs(blob, filename);
    }
  }

  var editorState = {
    current: '',
    last: '',
    update: function(state) {
      this.last = this.current;
      this.current = state;
    },
    hasChanged: function() {
      return this.current !== this.last;
    },
  };

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setUseWrapMode(true);
  editor.getSession().setTabSize(2);
  editor.getSession().on('change', function(e) {
    editorState.update(editor.getValue());

    if (editorState.hasChanged()) {
      socket.emit('updateEditor', {user: localStorage.username, newState: editor.getValue()});
    }
  });

  /* Video Chat Session: */
  $scope.hidePublisher = true;

  VideoChat.getSessionInfo()
  .then(function(data) {
    var apiKey = data.data.apiKey,
        sessionId = data.data.sessionId,
        token = data.data.token;

    var session = OT.initSession(apiKey, sessionId);
      session.on({
          streamCreated: function(event) {
            session.subscribe(event.stream, 'subscribers');
          }
      });
      session.connect(token, function(error) {
        if (error) {
          console.log(error.message);
        } else {
          session.publish('publisher');
        }
      });

      /* End Video Chat Session: */
      $scope.endVideoSession = function() {
        session.disconnect();
      };
  });
}]);
