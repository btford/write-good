#!/usr/bin/env node
/* eslint-disable no-console */

const program = require('commander');
const fs = require('fs');
const packageJson = require('../package.json');
const writeGood = require('../write-good');
const annotate = require('../lib/annotate');

program
  .version(packageJson.version)
  .usage('[options] <file ...>')
  .description('write-good is a naive linter for English prose.')
  .option('--checks <module>',
    `add a custom checks module.
    If you specify such a module, write-good will support additional options to (de)activate checks of the custom module.`,
    { isDefault: true })
  .option(
    '--text <text>',
    'provide direct text input instead of glob/file name'
  )
  .option(
    '--parse',
    'activate parse-happy output and a more conventional Unix exit code'
  );

const args = process.argv.slice(2);
const checksArg = args.find(arg => arg.startsWith('--checks'));

const checksModule = checksArg ? checksArg.replace('--checks=', '') : undefined;

const checks = [ // default checks
  ['weasel', 'weasel word'],
  ['illusion', 'lexical illusion'],
  ['so', 'so'],
  ['thereIs', 'there is'],
  ['passive', 'passive voice'],
  ['adverb', 'adverb weakens meaning'],
  ['tooWordy', 'too wordy'],
  ['cliches', 'clichés']
];

function generateDeactivationDescription(checkName) {
  return `deactivate the '${checkName}' check`;
}

function generateActivationDescription(checkName) {
  return `activate the '${checkName}' check and `
    + 'deactivate all other checks that aren\'t explicitly activated';
}
let opts = {};

function generateCheckOptions(checkParams) {
  const checkOption = Array.isArray(checkParams) ? checkParams[0] : checkParams;
  const checkName = Array.isArray(checkParams) ? checkParams[1] : checkParams;
  program
    .option(
      `--no-${checkOption}`,
      generateDeactivationDescription(checkName),
      { isDefault: true }
    )
    .option(
      `--${checkOption}`,
      generateActivationDescription(checkName),
      { isDefault: true }
    );
  opts[checkOption] = null;
}

if (!checksModule) {
  opts = {
    eprime: false // user must opt-in
  };
  program
    .option(
      '--eprime',
      generateActivationDescription('E-Prime')
    )
    .option(
      '--yes-eprime',
      "activate 'E-Prime' check, without deactivating the other checks"
    );
  checks.forEach(generateCheckOptions);
} else { // set custom ops, for example to lint a non-English document
  try {
    /* eslint-disable-next-line import/no-dynamic-require, global-require */
    opts.checks = require(checksModule);
  } catch (e) {
    console.log(
      'Could not import custom check module. '
      + 'Check for spelling errors and make sure you have the module installed.'
    );
    process.exit(1);
  }
  // dynamically set up custom options
  Object.keys(opts.checks).forEach(generateCheckOptions);
}

const files = program.parse(process.argv).args;
// 'parse' is a commander.js edge case:
const shouldParse = Object.keys(program).indexOf('parse') !== -1;

const hasTextArg = args.some(arg => arg.startsWith('--text'));
if (files.length === 0 && !hasTextArg) {
  console.log('You did not provide any files to check.');
  process.exit(1);
}

const hasChecks = args.some(arg => arg.startsWith('--checks'));

function handleInvalidArgument(arg) {
  console.log(`"${arg}" is not a valid argument.`);
  process.exit(1);
}

if (hasChecks) {
  // validate base args and infer valid check args from the imported custom check module
  args.slice(1).forEach((arg) => {
    if (arg.startsWith('--text') || arg.startsWith('--checks') || arg === '--parse') return;
    const isValid = Object.keys(opts.checks).some(check => arg === `--${check}` || arg === `--no-${check}`);
    if (!isValid) {
      handleInvalidArgument(arg);
    }
  });
} else {
  const optionArgs = args.filter(arg => !files.includes(arg));
  // validate default args if no custom checks module is provided
  optionArgs.forEach((arg) => {
    if (arg.startsWith('--text')) return;
    const isValid = program.options.some(option => arg === option.long || arg === option.short);
    if (!isValid) {
      handleInvalidArgument(arg);
    }
  });
}

let include = true;
let inputSupplied = files.length;
let textInputSupplied = false;

args.filter(arg => arg.substr(0, 2) === '--').map(arg => arg.substr(2)).forEach((arg) => {
  if (arg.indexOf('text=') !== -1) {
    opts[arg.substr(0, 4)] = arg.substr(5);
    // eslint-disable-next-line no-multi-assign
    textInputSupplied = inputSupplied = true;
  } else if (arg.substr(0, 3) === 'no-') {
    opts[arg.substr(3)] = false;
  } else if (arg.substr(0, 4) === 'yes-') {
    opts[arg.substr(4)] = true;
  } else if (arg === 'parse') {
    // no opt
  } else if (arg.indexOf('checks=') === -1) {
    opts[arg] = true;
    include = false;
  }
});

Object.keys(opts).forEach((name) => {
  if (typeof opts[name] !== 'boolean'
  && name !== 'text' // --text="text to check"
  && name !== 'checks') { // --checks="custom-check-module"
    opts[name] = include;
  }
});

if (!inputSupplied) {
  console.log('You did not provide any input (file or text) to check');
  process.exit(1);
}

let exitCode = 0;

function displaySuggestions(source, contents, options) {
  const suggestions = writeGood(contents, options);

  if (shouldParse) {
    exitCode = suggestions.length > 0 ? -1 : 0;
    console.log(annotate(contents, suggestions, true).map(ann => [source, ann.line, ann.col, ann.reason.replace('\n', ' ')].join(':')).join('\n'));
  } else {
    exitCode += suggestions.length;
    if (suggestions.length) {
      console.log(`In ${source}`);
      console.log('=============');
      console.log(annotate(contents, suggestions).join('\n-------------\n'));
    }
  }
}

if (textInputSupplied) {
  displaySuggestions('text', opts.text, opts);
} else {
  files.forEach((file) => {
    if (fs.lstatSync(file).isFile()) {
      const contents = fs.readFileSync(file, 'utf8');
      displaySuggestions(file, contents, opts);
    }
  });
}

process.exit(exitCode);
