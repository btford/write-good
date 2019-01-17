function repeatChar(ch, times) {
  let str = '';
  for (let i = times; i > 0; i--) {
    str += ch;
  }
  return str;
}

function generateStartOfLineIndex(line, lines) {
  const x = lines.slice(0);
  x.splice(line - 1);
  return x.join('\n').length + (x.length > 0);
}

function findLineColumn(contents, lines, index) {
  const line = contents.substr(0, index).split('\n').length;
  const startOfLineIndex = generateStartOfLineIndex(line, lines);
  const col = index - startOfLineIndex;

  return { line, col };
}

// annotate file contents with suggestions
module.exports = function annotate(contents, suggestions, parse) {
  const lines = contents.split('\n');

  return suggestions.map((suggestion) => {
    const lineColumn = findLineColumn(contents, lines, suggestion.index);

    let fix = 0;

    if (lineColumn.col > 25) {
      fix = lineColumn.col - 25;
    }

    if (parse) {
      return {
        reason: suggestion.reason,
        line: lineColumn.line,
        col: lineColumn.col,
      };
    }
    const lineSegment = lines[lineColumn.line - 1].substr(fix, 80);

    return [
      lineSegment,
      repeatChar(' ', lineColumn.col - fix) + repeatChar('^', suggestion.offset),
      `${suggestion.reason} on line ${lineColumn.line} at column ${lineColumn.col}`
    ].join('\n');
  });
};
