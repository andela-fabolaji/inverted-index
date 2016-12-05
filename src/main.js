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
      displayMsg(`Error! ${selectedFile} is not properly formatted`);
    }
  };

  // Search Index
  $scope.searchIndex = () => {
    let file = $scope.searchFile || null,
      searchTerm = $scope.searchTerm;
    if (!searchTerm) {
      displayMsg('Error! Please type in your search term');
    } else if (Object.keys($scope.indexedFiles).length === 0) {
      displayMsg('No files indexed yet');
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
    const exp = /\.json/;
    if (!exp.test(file.name.toString())) {
      displayMsg(`Error! ${file.name} is not a json file`);
      return 0;
    }
    const reader = new FileReader();
    let fileContent;
    reader.readAsText(file);
    reader.onload =  (loadEvent) => {
      let fileContent = loadEvent.target.result;
      $scope.uploadedFiles[file.name] = fileContent;
      $scope.$apply();
    };
  };

  function displayMsg (msg) {
    $scope.message = msg;
    $('.modal').modal();
  }

  let fileUpload = document.getElementById('upload');

  fileUpload.addEventListener('change', (ev) => {
      for (let i = 0; i < (ev.target.files.length); i++ ) {
        $scope.verifyFileType(ev.target.files[i]);
      }
  });

}]);