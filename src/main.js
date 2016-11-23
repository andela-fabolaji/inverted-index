'use strict'

const app = angular.module("InvertedIndex", []);

app.controller('MainController', ['$scope', ($scope) => {
  $scope.indexObj = new InvertedIndex();
  $scope.uploadedFiles = {};
  $scope.indexedFiles = {};
  $scope.searchedFiles = {}
  $scope.showIndex = false;
  $scope.showResult = false;

  $scope.createIndex = () => {
    let selectedFile = $scope.selectedFile;

    if (!selectedFile) {
      alert('no file selected'); return;
    }

    if ($scope.indexObj.createIndex(selectedFile, $scope.uploadedFiles[selectedFile])) {
      $scope.showIndex = true;
      $scope.showResult = false;

      $scope.indexedFiles[selectedFile] = {
        name: selectedFile,
        indeces: $scope.indexObj.getIndex(selectedFile),
        docNum: $scope.indexObj.getDocCount(selectedFile)
      }
    } else {
      alert('Invalid File type');
    }
  };

  $scope.searchIndex = () => {
    let file = $scope.searchFile || null,
      searchTerm = $scope.searchTerm;

    if (!searchTerm) {
      alert('I can\'t  search for nothing! Please type in your search term');
      return false;
    } else {
      $scope.result = $scope.indexObj.searchIndex(file, searchTerm);
    }

    for (let eachResult in $scope.result) {
      $scope.searchedFiles[eachResult] = {
        name: eachResult,
        indeces: $scope.result[eachResult],
        docNum: $scope.indexObj.getDocCount(eachResult)
      }
    }
    $scope.showIndex = false;
    $scope.showResult = true;

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