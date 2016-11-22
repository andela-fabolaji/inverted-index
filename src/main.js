'use strict'

const app = angular.module("InvertedIndex", []);

app.controller('MainController', ['$scope', ($scope) => {
  $scope.indexObj = new InvertedIndex();
  $scope.uploadedFiles = {};
  $scope.indexedFiles = {};
  $scope.showIndex = false;
  $scope.showResult = false;

  $scope.createIndex = () => {
    let selectedFile = $scope.selectedFile;

    if (!selectedFile) {
      alert('no file selected'); return;
    }

    if ($scope.indexObj.createIndex(selectedFile, $scope.uploadedFiles[selectedFile])) {
      $scope.showIndex = true;

      // object to hold details about indexed file
      $scope.indexedFiles[selectedFile] = {
        name: selectedFile,
        indeces: $scope.indexObj.getIndex(selectedFile),
        docNum: $scope.indexObj.getDocCount(selectedFile),
        isIndexed: true
      }
    } else {
      alert('Invalid File type');
    }
  };

  $scope.searchIndex = () => {
    let file = $scope.searchFile || null;
    let searchTerm = $scope.searchTerm;

    console.log(`Search for ${searchTerm} in ${file}`);
    if (!searchTerm) {
      alert('I can\'t  search for nothing! Please type in your search term')
    }

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
      // console.log()$scope.uploadedFiles[file.name];
      // console.log(file.name);
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