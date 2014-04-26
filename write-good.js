var weasels  = require('weasel-words'),
    illusion = require('./lib/lexical-illusions'),
    so       = require('./lib/starts-with-so');

module.exports = function (text, opts) {
  return weasels(text).map(reasonable('is a weasel word')).
      concat(illusion(text).map(reasonable('is repeated'))).
      concat(so(text).map(reasonable('adds no meaning'))).
      sort(function (a, b) {
        return a.index < b.index ? -1 : 1;
      });

  function reasonable (reason) {
    return function (suggestion) {
      suggestion.reason = '"' +
          text.substr(suggestion.index, suggestion.offset) +
          '" ' + reason;
      return suggestion;
    };
  }
};
