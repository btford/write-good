/* eslint-disable no-unused-vars */
const { exec } = require('child_process');

describe('CLI', () => {
  const expectedWarningsNotWeasel = [
    '"was killed" may be passive voice on line 3 at column 11',
    '"the" is repeated on line 5 at column 4',
    '"There is" is unnecessary verbiage on line 9 at column 0',
    '"There are" is unnecessary verbiage on line 11 at column 0',
    '"simply" can weaken meaning on line 13 at column 17',
    '"been said" may be passive voice on line 17 at column 7',
    '"As a matter of fact" is wordy or unneeded on line 19 at column 0',
    '"impacted" is wordy or unneeded on line 21 at column 31',
    '"at loose ends" is a cliche on line 23 at column 22'
  ];

  // warnings for phrases that cause only 'weasel' warnings:
  const expectedWarningsOnlyWeasel = [
    '"few" is a weasel word on line 1 at column 11',
    '"few" is a weasel word on line 17 at column 22'
  ];

  // 'weasel' warnings for phrases that cause 'weasel' warnings and other warnings:
  const expectedWarningsPartWeaselOnly = [
    '"Remarkably" is a weasel word on line 1 at column 0',
    '"extremely" is a weasel word on line 15 at column 17'
  ];

  // combined warnings for phrases that cause 'weasel' warnings and other warnings:
  const expectedWarningsPartWeaselPlus = [
    '"Remarkably" is a weasel word and can weaken meaning on line 1 at column 0',
    '"extremely" is a weasel word and can weaken meaning on line 15 at column 17'
  ];

  // other warnings for phrases that cause 'weasel' warnings and other warnings:
  const expectedWarningsPartWeaselMinus = [
    '"Remarkably" can weaken meaning on line 1 at column 0',
    '"extremely" can weaken meaning on line 15 at column 17'
  ];

  const expectedWarningsEprime = [
    '"was" is a form of \'to be\' on line 3 at column 11',
    '"is" is a form of \'to be\' on line 9 at column 6',
    '"are" is a form of \'to be\' on line 11 at column 6',
    '"is" is a form of \'to be\' on line 13 at column 14',
    '"is" is a form of \'to be\' on line 15 at column 14',
    '"been" is a form of \'to be\' on line 17 at column 7',
    '"be" is a form of \'to be\' on line 19 at column 41',
    '"be" is a form of \'to be\' on line 21 at column 18',
    '"is" is a form of \'to be\' on line 25 at column 8'
  ];

  it('should provide the basic functionality as expected (smoke test)', (done) => {
    exec('./bin/write-good.js ./test/texts/English.md', (err, stdout, stderr) => {
      const expectedWarnings = expectedWarningsNotWeasel
        .concat(expectedWarningsOnlyWeasel)
        .concat(expectedWarningsPartWeaselPlus);
      expectedWarnings.forEach((warning) => {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should support running only the checks provided as command line arguments', (done) => {
    exec('./bin/write-good.js test/texts/English.md --weasel', (err, stdout, stderr) => {
      expectedWarningsNotWeasel.forEach((warning) => {
        expect(stdout.includes(warning)).toBe(false);
      });
      const expectedWarnings = expectedWarningsOnlyWeasel.concat(expectedWarningsPartWeaselOnly);
      expectedWarnings.forEach((warning) => {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should support deactivating checks', (done) => {
    exec('./bin/write-good.js test/texts/English.md --no-weasel', (err, stdout, stderr) => {
      const notExpectedWarnings = expectedWarningsOnlyWeasel.concat(expectedWarningsPartWeaselOnly);
      notExpectedWarnings.forEach((warning) => {
        expect(stdout.includes(warning)).toBe(false);
      });
      const expectedWarnings = expectedWarningsNotWeasel.concat(expectedWarningsPartWeaselMinus);
      expectedWarnings.forEach((warning) => {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should not check for E-Prime compliance if not explicitly activated', (done) => {
    exec('./bin/write-good.js ./test/texts/English.md', (err, stdout, stderr) => {
      expectedWarningsEprime.forEach((warning) => {
        expect(stdout.includes(warning)).toBe(false);
      });
      done();
    });
  });

  it('should check for E-Prime compliance if explicitly activated', (done) => {
    exec('./bin/write-good.js ./test/texts/English.md --eprime', (err, stdout, stderr) => {
      expectedWarningsEprime.forEach((warning) => {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should support extensions', (done) => {
    const expectedWarnings = [
      '"komplett" is a weasel word on line 1 at column 27',
      '"Aller Wahrscheinlichkeit nach" is wordy or unneeded on line 3 at column 0'
    ];
    exec('./bin/write-good.js ./test/texts/German.md --checks=schreib-gut --weasel --tooWordy', (err, stdout, stderr) => {
      expectedWarnings.forEach((warning) => {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should show a meaningful error message if the user provides invalid command line arguments', (done) => {
    exec('./bin/write-good.js ./test/texts/German.md --nonsense', (err, stdout, stderr) => {
      expect(stdout.trim()).toEqual('"--nonsense" is not a valid argument.');
      done();
    });
  });

  it('should show a meaningful error message if the import of the specified extension fails', (done) => {
    exec('./bin/write-good.js ./test/texts/German.md --checks=nonsense', (err, stdout, stderr) => {
      expect(stdout.trim()).toEqual('Could not import custom check module. Check for spelling errors and make sure you have the module installed.');
      done();
    });
  });

  it('should show a meaningful error message if the user provides invalid command line arguments and extension', (done) => {
    exec('./bin/write-good.js ./test/texts/German.md --checks=schreib-gut --adverb --weasel', (err, stdout, stderr) => {
      expect(stdout.trim()).toEqual('"--adverb" is not a valid argument.');
      done();
    });
  });

  it('should show a meaningful error message if the user does not provide any file to check', (done) => {
    exec('./bin/write-good.js', (err, stdout, stderr) => {
      expect(stdout.trim()).toEqual('You did not provide any files to check.');
      done();
    });
  });

  it('should support globs', (done) => {
    exec('./bin/write-good.js test/**/*.md', (err, stdout, stderr) => {
      const english2Warnings = ['"Playing the field" is a cliche on line 1 at column 0'];
      const expectedWarnings = expectedWarningsNotWeasel
        .concat(expectedWarningsOnlyWeasel)
        .concat(expectedWarningsPartWeaselPlus)
        .concat(english2Warnings);
      expectedWarnings.forEach((warning) => {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should not try to read in directories as files when globs do not specify file ending', (done) => {
    exec('./bin/write-good.js test/** --so', (err, stdout, stderr) => {
      // this error is expected; we have a problem if we get a different error:
      expect(err.toString().trim()).toEqual('Error: Command failed: ./bin/write-good.js test/** --so');
      done();
    });
  });
});
