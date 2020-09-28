# write good [![Build Status](https://travis-ci.org/btford/write-good.svg?branch=master)](https://travis-ci.org/btford/write-good)

Naive linter for English prose for developers who can't write good and wanna learn to do other stuff good too.


## Use

```shell
npm install write-good
```

**Important:** Do not use this tool to be a jerk to other people about their writing.


## API

`writeGood` is a function that takes a string and returns an array of suggestions.

```javascript
var writeGood = require('write-good');

var suggestions = writeGood('So the cat was stolen.');

// suggestions:
//
// [{
//   reason: "omit 'So' from the beginning of sentences",
//   index: 0, offset: 2
// }, {
//   reason: "'was stolen' is passive voice",
//   index: 11, offset: 10
// }]
```

`writeGood` takes an optional second argument that allows you to disable certain checks.

You can disable checking for passive voice like this:

```javascript
var writeGood = require('write-good');

var suggestions = writeGood('So the cat was stolen', { passive: false});
// suggestions: []
```

You can use the second argument's `checks` property to pass in custom checks instead of `write-good`'s default linting configuration.
Like this, you can check non-English documents, for example with the linter extension for German, [schreib-gut](https://github.com/TimKam/schreib-gut):


```javascript
var schreibGut = require('schreib-gut');

writeGood('Aller Wahrscheinlichkeit nach können Entwickler nicht gut schreiben', { weasel-words: false, checks: schreibGut});

// suggestions
// [{index : 0, offset : 29, reason : '"Aller Wahrscheinlichkeit nach" is wordy or unneeded' }]
```

You can use the second argument's `whitelist` property to pass in a list of strings to whitelist from suggestions.
For example, normally `only` would be picked up as a bad word to use, but you might want to exempt `read-only` from that:

```javascript
var writeGood = require('write-good');

var suggestions = writeGood('Never write read-only sentences.');
// suggestions: [{ index: 17, offset: 4, reason: '"only" can weaken meaning' }]

var filtered = writeGood('Never write read-only sentences.', { whitelist: ['read-only'] });
// filtered: []

```

## CLI

You can use `write-good` as a command-line tool by installing it globally:

```shell
npm install -g write-good
```

If you have npm version 5.2.0 or later installed, you can use npx to run write-good without installing it:

```shell
npx write-good *.md
```

`write-good` takes a [glob](https://github.com/isaacs/node-glob) and prints suggestions to stdout:

```shell
$ write-good *.md

In README.md
=============
 = writeGood('So the cat was stolen.');
                         ^^^^^^^^^^
"was stolen" is passive voice on line 20 at column 40
-------------
//   suggestion: "'was stolen' is passive voice",
                   ^^^^^^^^^^
"was stolen" is passive voice on line 28 at column 19
```

You can run just specific checks like this:

```shell
write-good *.md --weasel --so
```

Or exclude checks like this:

```shell
write-good *.md --no-passive
```

Or include checks like this:

```shell
# E-Prime is disabled by default.
write-good *.md --yes-eprime
```

**Note:** The ``--yes`` prefix only works for *E-Prime*, because the other checks are included by default, anyway.

You can run just with text without supplying files:

```shell
write-good --text="It should have been defined there."
```

You can even supply multi-line text:

```shell
write-good --text="I can't see a problem there that's not been defined yet.
Should be defined again."
```

You can also pass other arguments:

```shell
write-good --text="It should have been defined there." --no-passive
```

You can even fetch output from a remote file:

```shell
write-good --text="$(curl https://raw.githubusercontent.com/btford/write-good/master/README.md)"
```

Use the ``--parse`` option to activate parse-happy output and a more conventional Unix exit code:

```shell
write-good *.md --parse
```

To specify a custom checks extension, for example [schreib-gut](https://github.com/TimKam/schreib-gut), run:

```shell
npm install -g schreib-gut
write-good *.md --checks=schreib-gut
```

To view all available options use the ``--help`` option:

```shell
write-good --help
```

## Checks

You can disable any combination of the following by providing a key with value `false` as the second argument to `writeGood`.

### `passive`
Checks for passive voice.

### `illusion`
Checks for lexical illusions – cases where a word is repeated.

### `so`
Checks for `so` at the beginning of the sentence.

### `thereIs`
Checks for `there is` or `there are` at the beginning of the sentence.

### `weasel`
Checks for "weasel words."

### `adverb`
Checks for adverbs that can weaken meaning: really, very, extremely, etc.

### `tooWordy`
Checks for wordy phrases and unnecessary words.

### `cliches`
Checks for common cliches.

### `eprime`
Checks for ["to-be"](https://en.wikipedia.org/wiki/E-Prime) verbs. _Disabled by default_

## Extensions
Users can create their own `write-good` language checks. As described above,
you can specify such extensions when running `write-good` on the command line
or calling it in your JavaScript code.

The following 3rd-party `write-good` extensions are available:

* [schreib-gut](https://github.com/timkam/schreib-gut): A basic extension for
  the German language

If you know of any `write-good` extensions that are not in this list, please open a pull request!

### Interface
An extension is a Node.js module that exposes an object containing a check
function (``fn``) and an ``explanation`` string for each new check:

```javascript
module.exports = {
  check1: {
    fn: function(text) {
      …
    },
    explanation: '…'
  },
  check2: {
    fn: function(text) {
      …
    },
    explanation: '…'
  }
}
```

Each check function takes a string input and determines a list of style
violation objects, each with an ``index`` and an ``offset``:

```javascript
/**
* @param {text} text  Input text
* @return {{index:number, offset:number}[]}  List of all violations
*/
```

The ``index`` defines the position of the match in the input text, whereas the
``offset`` specifies the length of the match.

The following example extension provides a check that determines if the input
text contains a set of forbidden terms (*Tom Riddle* and *Voldemort*):

```javascript
module.exports = {
  voldemort: {
    fn: function (text) {
      var positives = ['Tom Riddle', 'Voldemort']
      var re = new RegExp('\\b(' + positives.join('|') + ')\\b', 'gi');
      var suggestions = [];
      while (match = re.exec(text)) {
        suggestions.push({
          index: match.index,
          offset: match[0].length,
        });
      }
      return suggestions;
    },
    explanation: 'You must not name Him-Who-Must-Not-Be-Named'
  }
}
```

## Docker

### From Dockerhub

You can also run this application in [Docker](https://www.docker.com). Using a pre-built [image from Dockerhub](https://hub.docker.com/r/hochzehn/write-good/), the write-good can be run with this command:

`docker run --rm --volume $PWD:/app hochzehn/write-good *.md`

### Building locally

Or you can first build the image locally:

`docker build -t btford/write-good .`

And then run using:

`docker run -it --rm -v "$(pwd)":/srv/app -w /srv/app btford/write-good:latest *.md`

## See also

I came across these resources while doing research to make this module.
They might be helpful.

### Code

* [shell script for avoiding "weasel words"](http://matt.might.net/articles/shell-scripts-for-passive-voice-weasel-words-duplicates/) – I based my initial implementation on this
* [Academic Writing Check](https://github.com/devd/Academic-Writing-Check) – a perl script similar to above
* [writegood mode](https://github.com/bnbeckwith/writegood-mode) for emacs
* [natural](https://github.com/NaturalNode/natural) – general purpose NLP toolkit in JavaScript
* [WordNet](http://wordnet.princeton.edu/) – lexical database of the English language
* [LanguageTool](https://languagetool.org/) – style and grammar checker implemented in Java

### Prose

* [Elements of Style](http://www.bartleby.com/141/)
* [Flesch–Kincaid readability](http://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_test)
* [Fear and Loathing of the English passive](http://www.lel.ed.ac.uk/~gpullum/passive_loathing.pdf)
* [Words to Avoid in Educational Writing](http://css-tricks.com/words-avoid-educational-writing/)

### Apps

This is not an endorsement.
These apps have similar functionality that you may find useful.

* [Hemingway App](http://www.hemingwayapp.com/)
* [Nitpicker](http://nitpickertool.com)
* [Grammarly](https://app.grammarly.com)

## Other projects using write good

* [linter-write-good](https://github.com/gepoch/linter-write-good) for [Atom](https://atom.io/)
* [Write Good action](https://actions.getdrafts.com/a/1RA) for [Drafts](https://getdrafts.com) iOS App
* [Write Good Linter](https://marketplace.visualstudio.com/items?itemName=travisthetechie.write-good-linter) for [Visual Studio Code](https://code.visualstudio.com)
* [Vim ALE](https://github.com/w0rp/ale) realtime linter for [Vim](http://www.vim.org/) with included support for write-good.
* [Write Better](https://github.com/justiceo/write-better) A [Chrome extension](https://chrome.google.com/webstore/detail/write-better/nnnnnpmcdcloafmfkiihafnjidjkfmek) for Google Docs.

## License
MIT
