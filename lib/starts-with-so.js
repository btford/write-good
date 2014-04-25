
// Opinion: I think it's gross to start written English independant clauses with "so"
//          most of the time. Maybe it's okay in spoken English.
//
// More on "so:"
// * http://www.nytimes.com/2010/05/22/us/22iht-currents.html?_r=0
// * http://comminfo.rutgers.edu/images/comprofiler/plug_profilegallery/84/pg_2103855866.pdf

// this implementation is really naive
var re = new RegExp('(so) ([^\\.;!?]+)([\\.;!?]+)', 'gi');
module.exports = function (text) {
  var suggestions = [];
  while (match = re.exec(text)) {
    suggestions.push({
      index: match.index,
      offset: 2
    });
  }
  return suggestions;
};
