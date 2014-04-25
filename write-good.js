var weasels = require('weasel-words'),
    passive = require('passive-voice');

module.exports = function (text, opts) {
  return weasels(text).map(reasonable('is a weasel word')).
      concat(passive(text).map(reasonable('is passive voice'))).
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
