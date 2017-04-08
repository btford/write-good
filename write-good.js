var assign = Object.assign || require('object.assign');

var defaultChecks = {
  weasel  : { fn: require('weasel-words'),            explanation: 'is a weasel word' },
  illusion : { fn: require('./lib/lexical-illusions'), explanation: 'is repeated' },
  so       : { fn: require('./lib/starts-with-so'),    explanation: 'adds no meaning' },
  thereIs  : { fn: require('./lib/there-is'),          explanation: 'is unnecessary verbiage' },
  passive  : { fn: require('passive-voice'),           explanation: 'may be passive voice' },
  adverb   : { fn: require('adverb-where'),            explanation: 'can weaken meaning'},
  tooWordy : { fn: require('too-wordy'),               explanation: 'is wordy or unneeded'},
  cliches  : { fn: require('no-cliches'),              explanation: 'is a cliche'},
  eprime   : { fn: require('e-prime'),                 explanation: 'is a form of \'to be\''}
};

// User must explicitly opt-in
var disabledChecks = {
  eprime: false
};

module.exports = function (text, opts) {
  opts = opts ? opts : {};
  var finalOpts = {};
  opts = assign({}, disabledChecks, opts);
  Object.keys(opts).map(function(optKey) {
    if(optKey !== 'checks') {
      finalOpts[optKey] = opts[optKey];
    }
  });

  var finalChecks = opts.checks || defaultChecks;

  var suggestions = [];
  Object.keys(finalChecks).forEach(function (checkName) {
    if (finalOpts[checkName] !== false) {
      suggestions = suggestions.concat(finalChecks[checkName].fn(text).
                          map(reasonable(finalChecks[checkName].explanation)));
    }
  });

  return dedup(suggestions).sort(function (a, b) {
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


function dedup (suggestions) {
  var dupsHash = {};

  return suggestions.reduce(function(memo, suggestion) {
    var key = suggestion.index + ":" + suggestion.offset;
    if (!dupsHash[key]) {
      dupsHash[key] = suggestion;
      memo.push(suggestion);
    } else {
      dupsHash[key].reason += " and " + suggestion.reason.substring(suggestion.offset + 3);
    }
    return memo;
  }, []);
}

module.exports.annotate = require('./lib/annotate');
