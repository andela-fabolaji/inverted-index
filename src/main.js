'use strict';

const app = angular.module("InvertedIndex", []);

app.controller('MainController', ['$scope', ($scope) => {
  $scope.indexObj = new InvertedIndex();
  $scope.uploadedFiles = {};
  $scope.indexedFiles = {};
  $scope.searchedFiles = {};
  $scope.showIndex = false;
  $scope.showResult = false;
  $scope.getCount = (num) => {
    return new Array(num);
  };
  // Create index
  $scope.createIndex = () => {
    let selectedFile = $scope.selectedFile;
    if (!selectedFile) {
      displayMsg('Error! No file selected');
      return false;
    }
    if ($scope.indexObj.createIndex(selectedFile, $scope.uploadedFiles[selectedFile])) {
      $scope.showIndex = true;
      $scope.showResult = false;
      $scope.indexedFiles[selectedFile] = {
        name: selectedFile,
        indeces: $scope.indexObj.getIndex(selectedFile),
        docNum: $scope.indexObj.indexedFiles[selectedFile]
      }
    } else {
      displayMsg('Error! Invalid document format');
    }
  };

  // Search Index
  $scope.searchIndex = () => {
    let file = $scope.searchFile || null,
      searchTerm = $scope.searchTerm;
    if (!searchTerm) {
      displayMsg('I can\'t  search for nothing! Please type in your search term');
      return false;
    } else {
      $scope.result = $scope.indexObj.searchIndex(file, searchTerm);
    }

    for (let eachResult in $scope.result) {
      $scope.searchedFiles[eachResult] = {
        name: eachResult,
        indeces: $scope.result[eachResult],
        docNum: $scope.indexObj.indexedFiles[eachResult]
      }
    }
    $scope.showIndex = false;
    $scope.showResult = true;

  };
  $scope.verifyFileType = (file) => {
    let exp = /\.json/;
    if (!exp.test(file.name.toString())) {
      displayMsg('Error! Only JSON files can be uploaded');
      return false;
    }
    const reader = new FileReader();
    let fileContent;
    reader.readAsText(file);
    reader.onload =  (loadEvent) => {
      let fileContent = loadEvent.target.result;
      try {
        fileContent = JSON.parse(fileContent);
      } catch(e) {
        displayMsg('Error! Invalid document format');
        return false;
      }
      $scope.uploadedFiles[file.name] = fileContent;
      $scope.$apply();
    };
  };

  function displayMsg (msg) {
    $scope.message = msg;
    $('.modal').modal();
    $scope.$apply();
  }

  let fileUpload = document.getElementById('upload');

  fileUpload.addEventListener('change', (ev) => {
      for (let i = 0; i < (ev.target.files.length); i++ ) {
        $scope.verifyFileType(ev.target.files[i]);
      }
  });

}]);