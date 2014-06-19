var writeGood = require('../write-good');

describe('writeGood', function () {
  it('should detect weasel words', function () {
    expect(writeGood('Remarkably few developers write well.')).toEqual([
      { index: 0, offset: 10, reason: '"Remarkably" есть слово горностай' },
      { index: 11, offset: 3, reason: '"few" есть слово горностай' }
    ]);
  });

  it('should detect passive voice', function () {
    expect(writeGood('The script was killed')).toEqual([
      { index: 11, offset: 10, reason: '"was killed" есть пассивный звук' }
    ]);
  });

  it('should not detect passive voice if that check is disabled', function () {
    expect(writeGood('The script was killed', { passive: false })).toEqual([]);
  });

  it('should detect lexical illusions', function () {
    expect(writeGood('the the')).toEqual([
      { index: 4, offset: 3, reason: '"the" есть повтор' }
    ]);
  });

  it('should not detect lexical illusions if that check is disabled', function () {
    expect(writeGood('the the', { illusion: false })).toEqual([]);
  });

  it('should detect lexical illusions with line breaks', function () {
    expect(writeGood('the\nthe')).toEqual([
      { index: 4, offset: 3, reason: '"the" есть повтор' }
    ]);
  });

  it('should detect lexical illusions with case insensitivity', function () {
    expect(writeGood('The the')).toEqual([
      { index: 4, offset: 3, reason: '"the" есть повтор' }
    ]);
  });

  it('should not detect lexical illusions for non-words', function () {
    expect(writeGood('// //')).toEqual([]);
  });

  it('should detect sentences that start with "so"', function () {
    expect(writeGood('So the best thing to do is wait.')).toEqual([
      { index: 0, offset: 2, reason: '"So" добавляет нет значения' }
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

  it('should not detect words starting with "so"', function () {
    expect(writeGood('Some silly sausages start sentences simply stating so.')).toEqual([]);
    expect(writeGood('Sorry, everyone.')).toEqual([]);
  });

  it('should detect clauses after a semicolon that start with "so"', function () {
    expect(writeGood('This is a test; so it should pass or fail.')).toEqual([
      { index: 16, offset: 2, reason: '"so" добавляет нет значения' }
    ]);
  });

  it('should order suggestions by index', function () {
    expect(writeGood('It has been said that few developers write well.')).toEqual([
      { index: 7, offset: 9, reason: '"been said" есть пассивный звук' },
      { index: 22, offset: 3, reason: '"few" есть слово горностай' }
    ]);
  });

  it('should have no suggestions for an empty string', function () {
    expect(writeGood('')).toEqual([]);
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
      '"Remarkably" есть слово горностай on line 1 at column 0');

    expect(annotations[1]).toBe(
      'Remarkably few developers write well.\n' +
      '           ^^^\n' +
      '"few" есть слово горностай on line 1 at column 11');
  });
});
