#!/usr/bin/env node

var fs        = require('fs');
var writeGood = require('../write-good');
var annotate  = require('../lib/annotate');

var args      = process.argv.slice(2);
var files     = args.filter(function (arg) {
  return arg.substr(0, 2) !== '--';
});

if (args[0] === '--version'){
  var version = require('../package.json').version;
  console.log('write-good version ' + version);
  process.exit(0);
}

if (files.length === 0) {
  console.log('You did not provide any files to check');
  process.exit(1);
}

var opts      = {
  weasel   : null,
  illusion : null,
  so       : null,
  thereIs  : null,
  passive  : null,
  adverb   : null,
  tooWordy : null,
  cliches  : null
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

var exitCode = 0;
files.forEach(function (file) {
  var contents = fs.readFileSync(file, 'utf8');
  var suggestions = writeGood(contents, opts);

  exitCode += suggestions.length;
  if (suggestions.length) {
    console.log('In ' + file);
    console.log('=============');
    console.log(annotate(contents, suggestions).join('\n-------------\n'));
  }
});

process.exit(exitCode);
