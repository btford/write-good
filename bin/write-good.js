#!/usr/bin/env node

var glob      = require('glob');
var fs        = require('fs');
var writeGood = require('../write-good');
var annotate  = require('../lib/annotate');

var args      = process.argv.slice(2);
var patterns  = args.filter(function (arg) {
  return arg.substr(0, 2) !== '--';
});

var opts      = {
  illusion : null,
  passive  : null,
  so       : null,
  weasel   : null
};

var include = true;

args.filter(function (arg) {
  return arg.substr(0, 2) === '--';
}).map(function (arg) {
  return arg.substr(2);
}).forEach(function (arg) {
  if (arg.substr(0, 3) === 'no-') {
    opts[arg.substr(3)] = false;
  } else {
    opts[arg] = true;
    include = false;
  }
});

Object.keys(opts).forEach(function (name) {
  if (typeof opts[name] !== 'boolean') {
    opts[name] = include;
  }
});

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
        var suggestions = writeGood(contents, opts);

        if (suggestions.length) {
          console.log('In ' + file);
          console.log('=============');
          console.log(annotate(contents, suggestions).join('\n-------------\n'));
        }
      });
    }
  });
});

