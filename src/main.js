'use strict'

const app = angular.module("InvertedIndex", []);

app.controller('MainController', ['$scope', ($scope) => {
  $scope.indexObj = new InvertedIndex();
  $scope.uploadedFiles = {};
  $scope.showIndex = false;
  $scope.showResult = false;
  $scope.indexedFiles = [];

  $scope.createIndex = () => {
    let file = $scope.selectedFile;

    if (!file) {
      alert('no file selected'); return;
    }

    if ($scope.indexObj.createIndex(file, $scope.uploadedFiles[file])) {

      alert('File successfully indexed');
      $scope.indexedFile = file;
      $scope.showIndex = true;
      $scope.docsLength = $scope.indexObj.getDocCount(file);
      $scope.getIndex(file);
    }
  };

  $scope.getIndex = (file) => {
      $scope.result = $scope.indexObj.getIndex(file);
      $scope.indexKeys = Object.keys($scope.result);
  };

  $scope.searchIndex = () => {
    let file = $scope.searchFile;
    let searchQuery = $scope.searchQuery;

    if (searchQuery == '') alert('Search box cannot be empty'); return;

  };

  $scope.verifyFileType = (file) => {
    if (!file.name.toString().endsWith('.json')) {
      alert('Error, it should be a json file');
      return;
    }

    const reader = new FileReader();
    let fileContent;

    reader.readAsText(file);
    reader.onload =  (loadEvent) => {
      let fileContent = loadEvent.target.result;

      try {
        fileContent = JSON.parse(fileContent);
      } catch(e) {
        return 'invalid json file';
      }

      $scope.uploadedFiles[file.name] = fileContent;

      $scope.$apply();
    };

  };

  let fileUpload = document.getElementById('upload');

  fileUpload.addEventListener('change', (ev) => {
      for (let i = 0; i < (ev.target.files.length); i++ ) {
        $scope.verifyFileType(ev.target.files[i]);
      }
  });

}]);