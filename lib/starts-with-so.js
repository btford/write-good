
// Opinion: I think it's gross to start written English independent clauses with "so"
//          most of the time. Maybe it's okay in spoken English.
//
// More on "so:"
// * http://www.nytimes.com/2010/05/22/us/22iht-currents.html?_r=0
// * http://comminfo.rutgers.edu/images/comprofiler/plug_profilegallery/84/pg_2103855866.pdf

// this implementation is really naive
var re = new RegExp('([^\n\\.;!?]+)([\\.;!?]+)', 'gi');
var startsWithSo = new RegExp('^(\\s)*so\\b[\\s\\S]', 'i');
module.exports = function (text) {
  var suggestions = [];
  var match, innerMatch;

  while (match = re.exec(text)) {
    if (innerMatch = startsWithSo.exec(match[1])) {
      suggestions.push({
        index: match.index + (innerMatch[1] || '').length,
        offset: 2
      });
    }
  }
  return suggestions;
};
