var writeGood = require('../write-good');

describe('writeGood', function () {
  it('should detect weasel words', function () {
    expect(writeGood('Remarkably few developers write well.')).toEqual([
      { index: 0, offset: 10, reason: '"Remarkably" is a weasel word' },
      { index: 11, offset: 3, reason: '"few" is a weasel word' }
    ]);
  });

  it('should detect passive voice', function () {
    expect(writeGood('The scipt was killed')).toEqual([
      { index: 10, offset: 10, reason: '"was killed" is passive voice' }
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

  it('should order suggestions by index', function () {
    expect(writeGood('It has been said that few developers write well.')).toEqual([
      { index: 7, offset: 9, reason: '"been said" is passive voice' },
      { index: 22, offset: 3, reason: '"few" is a weasel word' }
    ]);
  });
});
