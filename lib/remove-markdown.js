// Based on Strip Markdown Service Tools by Brett Terpstra
module.exports = function (md, config) {
  config = config || {};
  config.listUnicodeChar = config.hasOwnProperty('listUnicodeChar') ? config.listUnicodeChar : false;
  config.stripListLeaders = config.hasOwnProperty('stripListLeaders') ? config.stripListLeaders : true;
  config.gfm = config.hasOwnProperty('gfm') ? config.gfm : true;
  config.useImgAltText = config.hasOwnProperty('useImgAltText') ? config.useImgAltText : true;

  let output = md || '';

  output = output.replace(/^(-\s*?|\*\s*?|_\s*?){3,}\s*$/gm, '');

  try {
    if (config.stripListLeaders) {
      if (config.listUnicodeChar)
        output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, config.listUnicodeChar + ' $1');
      else
        output = output.replace(/^([\s\t]*)([\*\-\+]|\d+\.)\s+/gm, '$1');
    }
    if (config.gfm) {
      output = output
        // Header
        .replace(/\n={2,}/g, '\n')
        // Fenced codeblocks
        .replace(/~{3}.*\n/g, '')
        // Strikethrough
        .replace(/~~/g, '')
        // Fenced codeblocks
        .replace(/`{3}.*\n/g, '');
    }
    output = output
      // Remove HTML tags
      .replace(/<[^>]*>/g, '')
      // Remove setext-style headers
      .replace(/^[=\-]{2,}\s*$/g, '')
      // Remove footnotes?
      .replace(/\[\^.+?\](\: .*?$)?/g, '')
      .replace(/\s{0,2}\[.*?\]: .*?$/g, '')
      // Remove images
      .replace(/\!\[(.*?)\][\[\(].*?[\]\)]/g, options.useImgAltText ? '$1' : '')
      // Remove inline links
      .replace(/\[(.*?)\][\[\(].*?[\]\)]/g, '$1')
      // Remove blockquotes
      .replace(/^\s{0,3}>\s?/g, '')
      // Remove reference-style links?
      .replace(/^\s{1,2}\[(.*?)\]: (\S+)( ".*?")?\s*$/g, '')
      // Remove atx-style headers
      .replace(/^(\n)?\s{0,}#{1,6}\s+| {0,}(\n)?\s{0,}#{0,} {0,}(\n)?\s{0,}$/gm, '$1$2$3')
      // Remove emphasis (repeat the line to remove double emphasis)
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      .replace(/([\*_]{1,3})(\S.*?\S{0,1})\1/g, '$2')
      // Remove code blocks
      .replace(/(`{3,})(.*?)\1/gm, '$2')
      // Remove inline code
      .replace(/`(.+?)`/g, '$1')
  } catch (e) {
    console.error(e);
    return md;
  }
  return output;
};
