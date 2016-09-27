
// annotate file contents with suggestions
module.exports = function (contents, suggestions, parse) {

  var lines = contents.split('\n');

  return suggestions.map(function (suggestion) {
    var lineColumn = findLineColumn(suggestion.index);

    var fix = 0;

    if (lineColumn.col > 25) {
      fix = lineColumn.col - 25;
    }

    if(parse){
      return {
        reason: suggestion.reason,
        line: lineColumn.line,
        col: lineColumn.col,
      }
    }
    var lineSegment = lines[lineColumn.line - 1].substr(fix, 80);

    return [
      lineSegment,
      repeatChar(' ', lineColumn.col - fix) + repeatChar('^', suggestion.offset),
      suggestion.reason + ' on line ' + lineColumn.line + ' at column ' + lineColumn.col
    ].join('\n');
  })

  function findLineColumn (index) {
    var line = contents.substr(0, index).split('\n').length;


    var startOfLineIndex = (function () {
      var x = lines.slice(0);
      x.splice(line - 1);
      return x.join('\n').length + (x.length > 0);
    }());

    var col = index - startOfLineIndex;

    return {
      line: line,
      col: col
    };
  }
}

function repeatChar (ch, times) {
  var str = '';
  for (var i = times; i > 0; i--) {
    str += ch;
  }
  return str;
}
