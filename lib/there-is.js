
// Opinion: I think it's gross to start written English sentences with "there (is|are)"
//          (most of the time)

// this implementation is really naive
var re = new RegExp('([^\n\\.;!?]+)([\\.;!?]+)', 'gi');
var startsWithThereIs = new RegExp('^(\\s)*there\\b\\s(is|are)\\b', 'i');
module.exports = function (text) {
  var suggestions = [];
  var match, innerMatch;

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
