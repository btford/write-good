# write good

Naive linter for English prose for developers who can't write good and wanna do other stuff good too.


## Use

```shell
npm install write-good
```


## API

`writeGood` is a function that takes a string and returns an array of suggestions.

```javascript
var writeGood = require('write-good');

var suggestions = writeGood('So the cat was stolen');

// suggestions:
//
// [{
//   suggestion: "omit 'so' from the beginning of sentences",
//   index: 0, offset: 2
// }]
```


## See also

I came across these resources while doing research to make this module.
They might be helpful.

### Code

* [shell script for avoiding "weasel words"](http://matt.might.net/articles/shell-scripts-for-passive-voice-weasel-words-duplicates/) – I based my initial implementation on this
* [Academic Writing Check](https://github.com/devd/Academic-Writing-Check) – a perl script similar to above
* [writegood mode](https://github.com/bnbeckwith/writegood-mode) for emacs
* [natural](https://github.com/NaturalNode/natural) – general purpose NLP toolkit in JavaScript
* [WordNet](http://wordnet.princeton.edu/) – lexical database of the English language

### Prose

* [Elements of Style](http://www.bartleby.com/141/)
* [Flesch–Kincaid readability](http://en.wikipedia.org/wiki/Flesch%E2%80%93Kincaid_readability_test)
* [Fear and Loathing of the English passive](http://www.lel.ed.ac.uk/~gpullum/passive_loathing.pdf)

## License
MIT
