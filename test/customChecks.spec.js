const schreibGut = require('schreib-gut');
const writeGood = require('../write-good');

describe('if we use a custom German language check', () => {
  it('should detect German weasel words', () => {
    expect(writeGood('Das Projekt ist noch nicht komplett beendet.',
      { checks: schreibGut })).toEqual([
      { index: 27, offset: 8, reason: '"komplett" is a weasel word' }
    ]);
  });

  it('should detect German wordy phrases', () => {
    expect(writeGood('Aller Wahrscheinlichkeit nach können Entwickler nicht gut schreiben.',
      { checks: schreibGut })).toEqual([
      { index: 0, offset: 29, reason: '"Aller Wahrscheinlichkeit nach" is wordy or unneeded' }
    ]);
  });

  it('should not detect English weasel words', () => {
    expect(writeGood('Remarkably few developers write well.',
      { checks: schreibGut })).toEqual([]);
  });
});
