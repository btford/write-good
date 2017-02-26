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

//set custom ops, i.e. to lint a non-English document
var optsArg = args.find(function (arg) {
    return arg.startsWith('--checks');
});

var checksModule = optsArg ? optsArg.replace('--checks=', '') : undefined;

var checks;
var opts;
if (!checksModule) {
  opts = {
    weasel   : null,
    illusion : null,
    so       : null,
    thereIs  : null,
    passive  : null,
    adverb   : null,
    tooWordy : null,
    cliches  : null
  };
} else {
  checks = require(checksModule);
  opts = {};
  Object.keys(checksModule).forEach(function (name) {
    opts[name] = null;
  });
}


var include = true;
var shouldParse = false;

args.filter(function (arg) {
  return arg.substr(0, 2) === '--';
}).map(function (arg) {
  return arg.substr(2);
}).forEach(function (arg) {
  if (arg.substr(0, 3) === 'no-') {
    opts[arg.substr(3)] = false;
  } else if(arg == 'parse') {
  //overload the lint option logic above, to include
  //an operational flag: --parse, which means parse-happy output
  //and follow a more conventional Unix exit code
    shouldParse = true;
  }else {
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
  var suggestions = writeGood(contents, opts, checks);

  if(shouldParse){
    exitCode = suggestions.length > 0 ? -1 : 0;
    console.log(annotate(contents, suggestions, true).map(function(ann){return [file,ann.line,ann.col, ann.reason.replace("\n", " ")].join(":")}).join("\n"));
  }else{
    exitCode += suggestions.length;
    if (suggestions.length) {
      console.log('In ' + file);
      console.log('=============');
      console.log(annotate(contents, suggestions).join('\n-------------\n'));
    }
  }
});

process.exit(exitCode);
