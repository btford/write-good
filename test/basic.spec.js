var writeGood = require('../write-good');

describe('writeGood', function () {
  it('should detect weasel words', function () {
    expect(writeGood('Remarkably few developers write well.')).toEqual([
      { index: 0, offset: 10, reason: '"Remarkably" is a weasel word' },
      { index: 11, offset: 3, reason: '"few" is a weasel word' }
    ]);
  });

  it('should detect passive voice', function () {
    expect(writeGood('The script was killed')).toEqual([
      { index: 11, offset: 10, reason: '"was killed" is passive voice' }
    ]);
  });

  it('should not detect passive voice if that check is disabled', function () {
    expect(writeGood('The script was killed', { passive: false })).toEqual([]);
  });

  it('should detect lexical illusions', function () {
    expect(writeGood('the the')).toEqual([
      { index: 4, offset: 3, reason: '"the" is repeated' }
    ]);
  });

  it('should not detect lexical illusions if that check is disabled', function () {
    expect(writeGood('the the', { illusion: false })).toEqual([]);
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

  it('should not detect lexical illusions for non-words', function () {
    expect(writeGood('// //')).toEqual([]);
  });

  it('should detect sentences that start with "so"', function () {
    expect(writeGood('So the best thing to do is wait.')).toEqual([
      { index: 0, offset: 2, reason: '"So" adds no meaning' }
    ]);
  });

  it('should not detect sentences that start with "so" if that check is disabled', function () {
    expect(writeGood('So the best thing to do is wait.', { so: false })).toEqual([]);
  });

  it('should not detect "So?"', function () {
    expect(writeGood('So?')).toEqual([]);
  });

  it('should not detect "so" in the middle of a sentence', function () {
    expect(writeGood('This changes the code so that it works.')).toEqual([]);
  });

  it('should detect clauses after a semicolon that start with "so"', function () {
    expect(writeGood('This is a test; so it should pass or fail.')).toEqual([
      { index: 16, offset: 2, reason: '"so" adds no meaning' }
    ]);
  });

  it('should order suggestions by index', function () {
    expect(writeGood('It has been said that few developers write well.')).toEqual([
      { index: 7, offset: 9, reason: '"been said" is passive voice' },
      { index: 22, offset: 3, reason: '"few" is a weasel word' }
    ]);
  });
});

describe('annotate', function () {
  var annotate = writeGood.annotate;

  it('should detect weasel words', function () {
    var text = 'Remarkably few developers write well.'
    var suggestions = writeGood(text);
    var annotations = annotate(text, suggestions);

    expect(annotations[0]).toBe(
      'Remarkably few developers write well.\n' +
      '^^^^^^^^^^\n' +
      '"Remarkably" is a weasel word on line 1 at column 0');

    expect(annotations[1]).toBe(
      'Remarkably few developers write well.\n' +
      '           ^^^\n' +
      '"few" is a weasel word on line 1 at column 11');
  });
});
