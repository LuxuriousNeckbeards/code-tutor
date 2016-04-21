angular.module('codellama.video', [])
.factory('VideoChat', function($http) {


  var example = function() {

  };

  return {
    example: example,
  };

})
.controller('VideoChatController', ['$scope','VideoChat', function($scope, VideoChat) {

    $scope.setEditorLanguage = function(selector) {
      editor.getSession().setMode('ace/mode/' + selector.languageSelector);
    };

    var editor = ace.edit("editor");
    editor.setTheme("ace/theme/monokai");
    editor.getSession().setMode("ace/mode/javascript");
    editor.getSession().setUseWrapMode(true);
}]);
