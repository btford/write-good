var writeGood = require('../write-good');

describe('writeGood', function () {
  it('should detect weasel words', function () {
    expect(writeGood('Remarkably few developers write well.')).toEqual([
      { index : 0, offset : 10, reason : '"Remarkably" is a weasel word' },
      { index : 11, offset : 3, reason : '"few" is a weasel word' }
    ]);
  });
});
