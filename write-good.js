var weasels  = require('weasel-words'),
    illusion = require('./lib/lexical-illusions'),
    passive  = require('passive-voice');

module.exports = function (text, opts) {
  return weasels(text).map(reasonable('is a weasel word')).
      concat(passive(text).map(reasonable('is passive voice'))).
      concat(illusion(text).map(reasonable('is repeated'))).
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
