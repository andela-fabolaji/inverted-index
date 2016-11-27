'use strict';
/**
 * The Inverted Index class
 */
class InvertedIndex {

  /**
   * Constructor initialises the indices to an empty object
   * and keeps track of indexed files
   *
   * @constructor
   */
  constructor() {
    this.indices = {};
    this.indexedFiles = {};
  }

  /**
   * createIndex method takes a single document param
   * and builds an index from it
   *
   * @param {String} document
   * @param {Object} file
   * @return {Bool}
   */
  createIndex(fileName, file) {

    file = this._verifyFile(file);
    if (!file) { return false; }

    const words = [],
          indexedWords = {};

    file.forEach((document) => {
      words.push(this._tokenize(this._stringify(document)));
    });

    words.forEach((documentWords, index) => {
      for (let i = 0; i < documentWords.length; i++) {
        if (!indexedWords.hasOwnProperty(documentWords[i])) {
          indexedWords[documentWords[i]] = [];
        }
        indexedWords[documentWords[i]].push(index);
      }
    });

    if (!this.indices.hasOwnProperty(fileName)) {
      this.indices[fileName] = indexedWords;
    }

    this.indexedFiles[fileName] = file.length;
    return true;
  }

  /**
   * getIndex method returns the indices object
   *
   * @param {String} fileName
   * @return {Object} indices
   */
  getIndex(fileName) {
    if (Object.keys(this.indices).length === 0) {
      return false;
    }

    return typeof fileName === 'undefined'
        || typeof fileName !== 'string' ? this.indices : this.indices[fileName];
  }

  /**
   * searchIndex method looks up searchTerm
   * in the document and returns an indices
   *
   * @param {String} document
   * @param {String} searchTerm
   * @return {Object} result
   */
  searchIndex(fileName, searchTerm) {

    let result = {}
      , termsArr = [];

    if (Array.isArray(searchTerm)) {
      searchTerm = searchTerm.join(',').split(',').join(' ');
    }

    termsArr = this._tokenize(searchTerm);

    if (!fileName) {
      for (let eachFile in this.indices) {
        result[eachFile] = this._fetchResult(termsArr, this.indices[eachFile]);
      }
    } else {
      let fileDoc = this.indices[fileName];
      result[fileName] = this._fetchResult(termsArr, fileDoc);
    }
    return result;
  }

  /**
   * _verifyFile private method checks for validity of json file
   *
   * @param {Array} file
   * @return {Bool} || {Array} flag
   */
  _verifyFile(file) {

    let flag = file;

    if (file.length > 0) {
      for (var i = 0; i < file.length; i++) {
        if (file[i].title === '' || file[i].text === ''
          || !file[i].title || !file[i].text
          || typeof file[i].text !== 'string') {
          flag = false;
        }
      }
    } else flag = false;

    return flag;
  }

  /**
   * _fetchResult private method takes the array of terms
   * and uses each token to fetch it's result
   *
   * @param {Array} termsArr
   * @param {Object} file
   * @return {Object} result
   */
  _fetchResult(termsArr, file) {
    let result = {};
    termsArr.forEach((eachTerm, index) => {
      if (file.hasOwnProperty(eachTerm)) {
          result[termsArr[index]] = file[eachTerm];
      }
    });
    return result;
  }

  /**
   * _stringify private method merges the title and
   * text of each document into a single string
   *
   * @param {String} document
   * @return {String} stringified
   */
  _stringify(document) {
    return document.title + " " + document.text;
  }

  /**
   * _tokenize private method prepares a clean text and
   * converts it into an array of words
   *
   * @param {String} documentText
   * @return {Array} tokenArray
   */
  _tokenize(documentText) {
    let tokenArray = [];
    tokenArray = documentText.replace(/[^a-z0-9\s]+/ig, '').trim().toLowerCase().split(/\s+/);
    return this._makeUnique(tokenArray);
  }

  /**
   * _makeUnique private method converts
   * an array in a unique array
   *
   * @param {Array} tokenArray
   * @return {Array} uniqueArray
   */
  _makeUnique(tokenArray) {
    return tokenArray.filter((value, index, self) => {
      return self.indexOf(value) === index;
    });
  }
}