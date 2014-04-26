var writeGood = require('../write-good');

describe('writeGood', function () {
  it('should detect weasel words', function () {
    expect(writeGood('Remarkably few developers write well.')).toEqual([
      { index: 0, offset: 10, reason: '"Remarkably" is a weasel word' },
      { index: 11, offset: 3, reason: '"few" is a weasel word' }
    ]);
  });

  it('should detect lexical illusions', function () {
    expect(writeGood('the the')).toEqual([
      { index: 4, offset: 3, reason: '"the" is repeated' }
    ]);
  });

  it('should detect lexical illusions with line breaks', function () {
    expect(writeGood('the\nthe')).toEqual([
      { index: 4, offset: 3, reason: '"the" is repeated' }
    ]);
  });

  it('should detect lexical illusions with case insensitivity', function () {
    expect(writeGood('The the')).toEqual([
      { index: 4, offset: 3, reason: '"the" is repeated' }
    ]);
  });

  it('should detect sentences that start with "so"', function () {
    expect(writeGood('So the best thing to do is wait.')).toEqual([
      { index: 0, offset: 2, reason: '"So" adds no meaning' }
    ]);
  });

  it('should not detect "So?"', function () {
    expect(writeGood('So?')).toEqual([]);
  });

  it('should detect clauses after a semicolon that start with "so"', function () {
    expect(writeGood('This is a test; so it should pass or fail.')).toEqual([
      { index: 16, offset: 2, reason: '"so" adds no meaning' }
    ]);
  });

  it('should order suggestions by index', function () {
    expect(writeGood('It has been said that few developers write well.')).toEqual([
      { index: 22, offset: 3, reason: '"few" is a weasel word' }
    ]);
  });
});
