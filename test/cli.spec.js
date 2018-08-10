var exec = require('child_process').exec;

describe('CLI', function() {

  var expectedWarningsNotWeasel = [
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
  var expectedWarningsOnlyWeasel = [
    '"few" is a weasel word on line 1 at column 11',
    '"few" is a weasel word on line 17 at column 22'
  ];

  // 'weasel' warnings for phrases that cause 'weasel' warnings and other warnings:
  var expectedWarningsPartWeaselOnly = [
    '"Remarkably" is a weasel word on line 1 at column 0',
    '"extremely" is a weasel word on line 15 at column 17'
  ];

  // combined warnings for phrases that cause 'weasel' warnings and other warnings:
  var expectedWarningsPartWeaselPlus = [
    '"Remarkably" is a weasel word and can weaken meaning on line 1 at column 0',
    '"extremely" is a weasel word and can weaken meaning on line 15 at column 17'
  ];

  // other warnings for phrases that cause 'weasel' warnings and other warnings:
  var expectedWarningsPartWeaselMinus = [
    '"Remarkably" can weaken meaning on line 1 at column 0',
    '"extremely" can weaken meaning on line 15 at column 17'
  ];

  var expectedWarningsEprime = [
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

  it('should provide the basic functionality as expected (smoke test)', function(done) {
    exec('./bin/write-good.js ./test/texts/English.md', function(err, stdout, stderr) {
        var expectedWarnings = expectedWarningsNotWeasel
          .concat(expectedWarningsOnlyWeasel)
          .concat(expectedWarningsPartWeaselPlus);
        expectedWarnings.forEach(function(warning) {
          expect(stdout.includes(warning)).toBe(true);
        });
        done();
    });
  });

  it('should support running only the checks provided as command line arguments', function(done) {
    exec('./bin/write-good.js test/texts/English.md --weasel', function(err, stdout, stderr) {
      expectedWarningsNotWeasel.forEach(function(warning) {
        expect(stdout.includes(warning)).toBe(false);
      });
      var expectedWarnings = expectedWarningsOnlyWeasel.concat(expectedWarningsPartWeaselOnly);
      expectedWarnings.forEach(function(warning) {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should support deactivating checks', function(done) {
    exec('./bin/write-good.js test/texts/English.md --no-weasel', function(err, stdout, stderr) {
      var notExpectedWarnings = expectedWarningsOnlyWeasel.concat(expectedWarningsPartWeaselOnly);
      notExpectedWarnings.forEach(function(warning) {
        expect(stdout.includes(warning)).toBe(false);
      });
      var expectedWarnings = expectedWarningsNotWeasel.concat(expectedWarningsPartWeaselMinus);
      expectedWarnings.forEach(function(warning) {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should not check for E-Prime compliance if not explicitly activated', function(done) {
    exec('./bin/write-good.js ./test/texts/English.md', function(err, stdout, stderr) {
      expectedWarningsEprime.forEach(function(warning) {
        expect(stdout.includes(warning)).toBe(false);
      });
      done();
    });
  });

  it('should check for E-Prime compliance if explicitly activated', function(done) {
    exec('./bin/write-good.js ./test/texts/English.md --eprime', function(err, stdout, stderr) {
      expectedWarningsEprime.forEach(function(warning) {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should support extensions', function(done) {
    var expectedWarnings = [
      '"komplett" is a weasel word on line 1 at column 27',
      '"Aller Wahrscheinlichkeit nach" is wordy or unneeded on line 3 at column 0'
    ];
    exec('./bin/write-good.js ./test/texts/German.md --checks=schreib-gut --weasel --tooWordy', function(err, stdout, stderr) {
      expectedWarnings.forEach(function(warning) {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should show a meaningful error message if the user provides invalid command line arguments', function(done) {
    exec('./bin/write-good.js ./test/texts/German.md --nonsense', function(err, stdout, stderr) {
      expect(stdout.trim()).toEqual('"--nonsense" is not a valid argument.');
      done();
    });
  });

  it('should show a meaningful error message if the import of the specified extension fails', function(done) {
    exec('./bin/write-good.js ./test/texts/German.md --checks=nonsense', function(err, stdout, stderr) {
      expect(stdout.trim()).toEqual('Could not import custom check module. Check for spelling errors and make sure you have the module installed.');
      done();
    });
  });

  it('should show a meaningful error message if the user provides invalid command line arguments and extension', function(done) {
    exec('./bin/write-good.js ./test/texts/German.md --checks=schreib-gut --adverb --weasel', function(err, stdout, stderr) {
      expect(stdout.trim()).toEqual('"--adverb" is not a valid argument.');
      done();
    });
  });

  it('should show a meaningful error message if the user does not provide any file to check', function(done) {
  exec('./bin/write-good.js', function(err, stdout, stderr) {
    expect(stdout.trim()).toEqual('You did not provide any files to check.');
    done();
  });
  });

  it('should support globs', function(done) {
    exec('./bin/write-good.js test/**/*.md', function(err, stdout, stderr) {
      var english2Warnings = ['"Playing the field" is a cliche on line 1 at column 0'];
      var expectedWarnings = expectedWarningsNotWeasel
        .concat(expectedWarningsOnlyWeasel)
        .concat(expectedWarningsPartWeaselPlus)
        .concat(english2Warnings);
      expectedWarnings.forEach(function(warning) {
        expect(stdout.includes(warning)).toBe(true);
      });
      done();
    });
  });

  it('should not try to read in directories as files when globs do not specify file ending', function(done) {
    exec('./bin/write-good.js test/** --so', function(err, stdout, stderr) {
      // this error is expected; we have a problem if we get a different error:
      expect(err.toString().trim()).toEqual('Error: Command failed: ./bin/write-good.js test/** --so');
      done();
    });
  });
});
