# Inverted Index
# [![Build Status](https://travis-ci.org/andela-fabolaji/inverted-index.svg?branch=develop)](https://travis-ci.org/andela-fabolaji/inverted-index) [![Coverage Status](https://coveralls.io/repos/github/andela-fabolaji/inverted-index/badge.svg?branch=master)](https://coveralls.io/github/andela-fabolaji/inverted-index?branch=master)

Inverted index is designed to allow very fast full-text searches. An inverted index consists of a list of all the unique words that appear in any document, and for each word, a list of the documents in which it appears.

### App Features
```
[
    {
        "title": "This is a sample title",
        "text": "And this is a sample text"
    }
]
```
- Allows single/multiple JSON files upload
- Full indexing of words
- Cross-file text/words search

### Installation & Usage
The system currently implements local hosting i.e Users can install this app on their local machines only. Follow the steps below to install:

1.  Download this repository via [Inverted-Index] (https://github.com/andela-fabolaji/inverted-index.git)
2.  Switch to the project directory on your machine eg.
    - Mac users `cd ~path/to/the/app/directory`
    - Win users `cd c:/path/to/the/app/directory`
3.  From the directory, pull up your terminal/cmd and run this command `npm install` to install the app dependencies. This takes a few secs.
4.  To start the app, run `npm start`. The terminal/cmd will respond with a port eg. `localhost:3000`
5.  To test the app, run `npm test`

### Quick note
This version of Inverted Index App does not distinguish between singular and plural form of words, neither does it recommend search options.

### Contributing
- Clone this app via [Inverted-Index](https://github.com/andela-fabolaji/inverted-index.git)
- Install the dependencies
- Use the keyword `feature/` to create a new branch for a new feature eg. `git checkout -b feature/add-stuff`
- Make your first commit eg. `git commit -m 'commit-message'`
- Raise a PR

### More
- [Inverted Index - Wikipedia](https://en.wikipedia.org/wiki/Inverted_index)
- [Inverted Index](https://www.elastic.co/guide/en/elasticsearch/guide/current/inverted-index.html)