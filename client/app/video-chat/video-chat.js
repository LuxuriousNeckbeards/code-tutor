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

  var socket = io.connect('http://localhost:8080/');
  socket.on('connect', function(data) {
    socket.emit('join', 'Hello World from client');
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
  };

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

  socket.on('updatedState', function(data) {
    editorState.update(data.state);
    if (localStorage.username !== data.user && editorState.hasChanged()) {
      editor.setValue(data.state);
      var row = editor.session.getLength() - 1;
      var column = editor.session.getLine(row).length;
      editor.gotoLine(row + 1, column);
    }
  });


  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setUseWrapMode(true);
  editor.getSession().setTabSize(2);

  editor.getSession().on('change', function(e) {
    setTimeout(function() {
      editorState.update(editor.getValue());
      if (editorState.hasChanged()) {
        socket.emit('updateEditor', {user: localStorage.username, newState: editor.getValue()});
      }
    }, 100);
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
            session.subscribe(event.stream, 'subscribers', {height: 300, width: 300});
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
