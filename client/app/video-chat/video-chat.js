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
  /* Text Editor Session: */
  $scope.setEditorLanguage = function(selector) {
    editor.getSession().setMode('ace/mode/' + selector.languageSelector);
  };

  var editor = ace.edit("editor");
  editor.setTheme("ace/theme/monokai");
  editor.getSession().setMode("ace/mode/javascript");
  editor.getSession().setUseWrapMode(true);

  /* Video Chat Session: */
  VideoChat.getSessionInfo()
  .then(function(data) {
    var apiKey = data.data.apiKey,
        sessionId = data.data.sessionId,
        token = data.data.token;

    var session = OT.initSession(apiKey, sessionId); 
      session.on({ 
          streamCreated: function(event) { 
            session.subscribe(event.stream, 'subscribers', {insertMode: 'append'}); 
          } 
      }); 
      session.connect(token, function(error) {
        if (error) {
          console.log(error.message);
        } else {
          session.publish('publisher'); 
        }
      });
  });
}]);
