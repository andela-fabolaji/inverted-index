'use strict';
/**
 * The Inverted Index class
 */
class InvertedIndex {

  /**
   * Constructor initialises the indeces to an empty object
   *
   * @constructor
   */
  constructor() {
    this.indeces = {};
    this.indexed = {}
  }

  /**
   * createIndex method takes a single document param
   * and builds an index from it
   *
   * @param {String} document
   * @param {Object} file
   */
  createIndex(fileName, file) {

    file = this._verifyFile(file);
    if (!file) return false;

    const words = []
        , indexed = {};

    file.forEach((eachFileDoc) => {
      words.push(this._tokenize(this._stringify(eachFileDoc)));
    });

    words.forEach((eachWordsArray, index) => {
      for (let i = 0; i < eachWordsArray.length; i++) {
        if (!indexed.hasOwnProperty(eachWordsArray[i])) {
          indexed[eachWordsArray[i]] = [];
        }
        indexed[eachWordsArray[i]].push(index);
      }
    });

    if (!this.indeces.hasOwnProperty(fileName)) this.indeces[fileName] = indexed;
    this.indexed[fileName] = file;
    return true;
  }

  /**
   * getIndex method returns the indeces object
   *
   * @param {String} fileName
   * @return {Object} indeces
   */
  getIndex(fileName) {
    try {
      return typeof fileName == 'undefined'
        || typeof fileName !== 'string' ? this.indeces : this.indeces[fileName];
    } catch(e) {
      throw new Error('something went wrong', e);
    }
  }

  /**
   * searchIndex method looks up searchTerm
   * in the document and returns an indeces
   *
   * @param {String} document
   * @param {String} searchTerm
   * @return {Object} result
   */
  searchIndex(file, searchTerm) {
    let result = {}
      , termsArr = [];

    termsArr = this._tokenize(searchTerm);

    if (!file) {
      for (let eachFile in this.indeces) {
        result[eachFile] = this._fetchResult(termsArr, this.indeces[eachFile]);
      }
    } else {
      let fileDoc = this.indeces[file];
      result[file] = this._fetchResult(termsArr, fileDoc);
    }
    return result;
  }

  getDocCount(filename) {
    let docs = [],
    file = this.indexed[filename];

    for (let i = 0; i < (Object.keys(file)).length; i++) {
      docs.push(i)
    }
    return docs;
  }

  /**
   * _verifyFile private method checks for validity of json file
   *
   * @param {Array} file
   * @return {Bool} || {Array} flag
   */
	_verifyFile(file) {

    // try {
    //   file = JSON.parse(file);
    // } catch(exception) {
    //   return false;
    // }

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
   * _fetchResult private method
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
   * _stringify private method combines the title and
   * text of each document into a single string
   *
   * @param {String} document
   * @return {String} stringified
   */
  _stringify(document) {
    let stringified = document.title + " " + document.text;
    return stringified;
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
   * @param {array} tokenArray
   * @return {array}e uniqueArray
   */
  _makeUnique(tokenArray) {
    const uniqueArray = [];
    for (let i = 0; i < tokenArray.length; i++) {
      if (uniqueArray.indexOf(tokenArray[i]) < 0) uniqueArray.push(tokenArray[i]);
    }
    return uniqueArray;
  }

}