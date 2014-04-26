#!/usr/bin/env node

var glob      = require('glob');
var fs        = require('fs');
var writeGood = require('../write-good');
var annotate  = require('../lib/annotate');
var patterns  = process.argv.slice(2);

// default
if (patterns.length === 0) {
  patterns.push('**/*.md');
}

patterns.forEach(function (pattern) {
  glob(pattern, function (err, files) {
    if (err) {
      return console.log(err);
    } else {
      files.forEach(function (file) {
        var contents = fs.readFileSync(file, 'utf8');
        var suggestions = writeGood(contents);

        if (suggestions.length) {
          console.log('In ' + file);
          console.log('=============');
          console.log(annotate(contents, suggestions).join('\n-------------\n'));
        }
      });
    }
  });
});

