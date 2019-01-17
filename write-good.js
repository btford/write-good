const weaselWords = require('weasel-words');
const passiveVoice = require('passive-voice');
const adverbWhere = require('adverb-where');
const tooWordy = require('too-wordy');
const noCliches = require('no-cliches');
const ePrime = require('e-prime');

const lexicalIllusions = require('./lib/lexical-illusions');
const startsWithSo = require('./lib/starts-with-so');
const thereIs = require('./lib/there-is');

const defaultChecks = {
  weasel: { fn: weaselWords, explanation: 'is a weasel word' },
  illusion: { fn: lexicalIllusions, explanation: 'is repeated' },
  so: { fn: startsWithSo, explanation: 'adds no meaning' },
  thereIs: { fn: thereIs, explanation: 'is unnecessary verbiage' },
  passive: { fn: passiveVoice, explanation: 'may be passive voice' },
  adverb: { fn: adverbWhere, explanation: 'can weaken meaning' },
  tooWordy: { fn: tooWordy, explanation: 'is wordy or unneeded' },
  cliches: { fn: noCliches, explanation: 'is a cliche' },
  eprime: { fn: ePrime, explanation: 'is a form of \'to be\'' }
};

// User must explicitly opt-in
const disabledChecks = {
  eprime: false
};

function dedup(suggestions) {
  const dupsHash = {};

  return suggestions.reduce((memo, suggestion) => {
    const key = `${suggestion.index}:${suggestion.offset}`;
    if (!dupsHash[key]) {
      dupsHash[key] = suggestion;
      memo.push(suggestion);
    } else {
      dupsHash[key].reason += ` and ${suggestion.reason.substring(suggestion.offset + 3)}`;
    }
    return memo;
  }, []);
}

function reasonable(text, reason) {
  return function reasonableSuggestion(suggestion) {
    // eslint-disable-next-line no-param-reassign
    suggestion.reason = `"${
      text.substr(suggestion.index, suggestion.offset)
    }" ${reason}`;
    return suggestion;
  };
}

module.exports = function writeGood(text, opts = {}) {
  const finalOpts = {};
  const defaultOpts = { ...disabledChecks, ...opts };
  Object.keys(defaultOpts).forEach((optKey) => {
    if (optKey !== 'checks') {
      finalOpts[optKey] = defaultOpts[optKey];
    }
  });

  const finalChecks = opts.checks || defaultChecks;

  let suggestions = [];
  Object.keys(finalChecks).forEach((checkName) => {
    if (finalOpts[checkName] !== false) {
      suggestions = suggestions.concat(
        finalChecks[checkName]
          .fn(text)
          .map(reasonable(text, finalChecks[checkName].explanation))
      );
    }
  });

  return dedup(suggestions).sort((a, b) => (a.index < b.index ? -1 : 1));
};

module.exports.annotate = require('./lib/annotate');
