var writeGood = require('../write-good');
var schreibGut = require('schreib-gut');

describe('if the language is set to German', function() {
  it('should detect German weasel words', function () {
    expect(writeGood('Das Projekt ist noch nicht komplett beendet.', schreibGut)).toEqual([
      { index : 27, offset : 8, reason : '"komplett" is a weasel word' }
    ]);
  });

  it('should detect German wordy phrases', function() {
    expect(writeGood('Aller Wahrscheinlichkeit nach können Entwickler nicht gut schreiben', schreibGut)).toEqual([
      {index : 0, offset : 29, reason : '"Aller Wahrscheinlichkeit nach" is wordy or unneeded' }
    ]);
  });

  it('should not detect English weasel words', function() {
    expect(writeGood('Remarkably few developers write well.', schreibGut)).toEqual([
    ]);
  });
});
