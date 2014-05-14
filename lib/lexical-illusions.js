
// via http://matt.might.net/articles/shell-scripts-for-passive-voice-weasel-words-duplicates/

// Example:
// Many readers are not aware that the
// the brain will automatically ignore
// a second instance of the word "the"
// when it starts a new line.
var re = new RegExp('(\\s*)([^\\s]+)', 'gi');
var word = /\w+/;

module.exports = function (text) {
  var suggestions = [];
  var lastMatch = '';
  while (match = re.exec(text)) {
    if (word.test(match[2]) && match[2].toLowerCase() === lastMatch) {
      suggestions.push({
        index: match.index + match[1].length,
        offset: match[2].length
      });
    }
    lastMatch = match[2].toLowerCase();
  }
  return suggestions;
}
