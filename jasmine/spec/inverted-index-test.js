describe('Inverted Index class test suite', () => {

  let invIndex;

  // Valid files
  const file1 = `[
    {
      "title": "Alice in Wonderland",
      "text": "Alice falls into a rabbit hole and enters a world full of imagination."
    },
    {
      "title": "The Lord of the Rings: The Fellowship of the Ring.",
      "text": "An unusual alliance of man, elf, dwarf, wizard and hobbit seek to destroy a powerful ring."
    }
  ]`;

  const file2 = `[
    {
      "title": "Black Panther",
      "text": "Tchalla, a wakandian king gets up to hijinks"
    },
    {
      "title": "Constantine: HellBlazer",
      "text": "One man stands between Heaven and Hell. He may be our last hope or a failure"
    },
    {
      "title": "Batman: Year One",
      "text": "A rookie BatMan, Fresh from the League of Assasins tries to find his way"
    }
  ]`;

  // Invalid files
  const file3 = [];

  beforeEach(() => {
    invIndex = new InvertedIndex();
    invIndex.createIndex('file1', file1);
    invIndex.createIndex('file2', file2);
    invIndex.createIndex('file3', file3);
  });

  /**
   * Inverted index object test suite
   */
  describe('Inverted Index Instance', () => {
    describe('When an invertedIndex object is instantiated', () => {
      it('Should be an object type', () => {
        expect(invIndex instanceof InvertedIndex).toBeTruthy();
      });

      it('Should not have any books indexed yet', () => {
        let newInvIndex = new InvertedIndex();
        expect((Object.keys(newInvIndex.indices)).length).toBeFalsy();
      });
    });
  });

  /**
   * Read book data test suite
   */
  describe('Read book data', () => {
    describe('When a file is loaded', () => {
      let result;

      it('Should return true if file is a JSON array and text content is string', () => {
        result = invIndex.createIndex('file1', file1);
        expect(result).toBeTruthy();
        expect(typeof Object.keys(invIndex.getIndex('file1'))[0] == 'string').toBeTruthy();
      });

      it('Should return false if file is empty and/or not a JSON file', () => {
        result = invIndex.createIndex('file3', file3);
        expect(result).toBeFalsy();
      });

    });
  });

  /**
   * Populate index test suite
   */
  describe('Populate index', () => {
    describe('When a file is successfully loaded', () => {

      it('Should be indexed', () => {
        expect(Object.keys(invIndex.getIndex('file1')).length).toEqual(31);
      });

      it('Should return correct index', () => {
        let key = Object.keys(invIndex.getIndex('file1'))[0];
        expect(invIndex.getIndex('file1')[key].length).toEqual(1);
      });

      it('Should not override an existing index when another file is indexed', () => {
        expect(Object.keys(invIndex.getIndex()).length).toBe(2);
      });
    });
  });

  /**
   * Search index test suite
   */
  describe('Get index', () => {
    it('Should return the correct index of any document passed to it', () => {
      let result = invIndex.getIndex('file1');
      expect(result).toEqual(
        {
          alice: [ 0 ],
          in: [ 0 ],
          wonderland: [ 0 ],
          falls: [ 0 ],
          into: [ 0 ],
          a: [ 0, 1 ],
          rabbit: [ 0 ],
          hole: [ 0 ],
          and: [ 0, 1 ],
          enters: [ 0 ],
          world: [ 0 ],
          full: [ 0 ],
          of: [ 0, 1 ],
          imagination: [ 0 ],
          the: [ 1 ],
          lord: [ 1 ],
          rings: [ 1 ],
          fellowship: [ 1 ],
          ring: [ 1 ],
          an: [ 1 ],
          unusual: [ 1 ],
          alliance: [ 1 ],
          man: [ 1 ],
          elf: [ 1 ],
          dwarf: [ 1 ],
          wizard: [ 1 ],
          hobbit: [ 1 ],
          seek: [ 1 ],
          to: [ 1 ],
          destroy: [ 1 ],
          powerful: [ 1 ]
        }
      );
    });
  });

  /**
   * Search index test suite
   */
  describe('Search index', () => {
    let result;

    describe('Single word search', () => {
      it('Should return all documents, with the occurence of the word if no file is specified', () => {
        result = invIndex.searchIndex(null, 'the');
        expect(result).toEqual({ file1: { the: [ 1 ] }, file2: { the: [ 2 ] } });
        expect(result instanceof Object).toBeTruthy();
      });

      it('Should return documents containing the word if a file is specified', () => {
        result = invIndex.searchIndex('file1', 'AliCe');
        expect(result).toEqual({ file1: { alice: [ 0 ] } });
      });

      it('Should return empty search result if word does not exist in the index', () => {
        result = invIndex.searchIndex('file1', 'intel');
        expect(result).toEqual({ file1: {intel: []}});
      });
    });

    describe('Multi-word search', () => {
      it('Should return all documents, with the occurence of the invididual words if no file is specified', () => {
        result = invIndex.searchIndex(null, 'the AliCe in blaCK ConStAntine');
        expect(result).toEqual(
          {
            file1: {
              the: [ 1 ],
              alice: [ 0 ],
              in: [ 0 ],
              black: [],
              constantine: []
            },
            file2: {
              the: [ 2 ],
              alice: [],
              in: [],
              black: [ 0 ],
              constantine: [ 1 ]
            }
          }
        );
      });

      it('Should return documents containing the words if a file is specified', () => {
        result = invIndex.searchIndex('file1', 'AliCe unusual');
        expect(result).toEqual(
          {
            file1: {
              alice: [ 0 ],
              unusual: [ 1 ]
            }
          }
        );
      });

      it('Should accept an array as a search parameter and return documents containing the words if a file is specified', () => {
        result = invIndex.searchIndex('file1', ['AliCe falls unusual Dwarf']);
        expect(result).toEqual(
          {
            file1: {
              alice: [ 0 ],
              falls: [ 0 ],
              unusual: [ 1 ],
              dwarf: [ 1 ]
            }
          }
        );
      });
    });
  });
});