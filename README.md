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
//   suggestion: "omit 'So' from the beginning of sentences",
//   index: 0, offset: 2
// }, {
//   suggestion: "'was stolen' is passive voice",
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


## CLI

You can use `write-good` as a command-line tool by installing it globally:

```shell
npm install -g write-good
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


## Checks

You can disable any combination of the following by providing a key with value `false` as the second argument to `writeGood`.

### `passive`
Checks for passive voice.  
See [«Is using passive voice “bad form”?»](http://english.stackexchange.com/q/32311/195212)

### `illusion`
Checks for lexical illusions – cases where a word is repeated.  
See [«Communication Design: What are some interesting lexical illusions?»](https://www.quora.com/unanswered/Communication-Design-What-are-some-interesting-lexical-illusions)

### `so`
Checks for `so` at the beginning of the sentence.  
See [«Sentences beginning with “so”?»](http://english.stackexchange.com/q/43273/195212)

### `thereIs`
Checks for `there is` or `there are` at the beginning of the sentence.  
See [«Why should sentences not start with “there is” or “there are”?»](http://english.stackexchange.com/q/157830/195212)

### `weasel`
Checks for "weasel words."  
See [«“Weasel word” — English Wikipedia article»](https://en.wikipedia.org/wiki/Weasel_word).

### `adverb`
Checks for adverbs that can weaken meaning: really, very, extremely, etc.  
See [«Pretty, fairly, really, very, and quite»](http://www.learnersdictionary.com/qa/pretty-fairly-really-very-and-quite).

### `tooWordy`
Checks for wordy phrases and unnecessary words.  
See [«Wordy phrases»](http://grammarist.com/wordiness/).

### `cliches`
Checks for common cliches.  
See [«681 Cliches to Avoid in Your Creative Writing»](http://www.be-a-better-writer.com/cliches.html).

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
* [linter-write-good](https://github.com/gepoch/linter-write-good) for [Atom](https://atom.io/)

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

## License
MIT
