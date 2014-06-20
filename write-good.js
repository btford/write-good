var checks = {
  weasels  : { fn: require('weasel-words'),            explanation: 'is a weasel word' },
  illusion : { fn: require('./lib/lexical-illusions'), explanation: 'is repeated' },
  so       : { fn: require('./lib/starts-with-so'),    explanation: 'adds no meaning' },
  thereIs  : { fn: require('./lib/there-is'),          explanation: 'is unnecessary verbiage' },
  passive  : { fn: require('passive-voice'),           explanation: 'is passive voice' }
};

module.exports = function (text, opts) {
  opts = opts || {};
  var suggestions = [];
  Object.keys(checks).forEach(function (checkName) {
    if (opts[checkName] !== false) {
      suggestions = suggestions.concat(checks[checkName].fn(text).
                          map(reasonable(checks[checkName].explanation)));
    }
  });

  return suggestions.sort(function (a, b) {
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

module.exports.annotate = require('./lib/annotate');
