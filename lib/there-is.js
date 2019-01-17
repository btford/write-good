
// Opinion: I think it's gross to start written English sentences with "there (is|are)"
//          (most of the time)

// this implementation is really naive
const re = new RegExp('([^\n\\.;!?]+)([\\.;!?]+)', 'gi');
const startsWithThereIs = new RegExp('^(\\s)*there\\b\\s(is|are)\\b', 'i');
module.exports = function (text) {
  const suggestions = [];
  let match,
    innerMatch;

  while (match = re.exec(text)) {
    if (innerMatch = startsWithThereIs.exec(match[1])) {
      suggestions.push({
        index: match.index + (innerMatch[1] || '').length,
        offset: innerMatch[0].length - (innerMatch[1] || '').length
      });
    }
  }
  return suggestions;
};
