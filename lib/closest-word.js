const lev = require('levenshtein');

// return the closest match from a list
module.exports = function(word, options) {
    var closest;
    var closestDistance = Infinity;
    var optionsLength = options.length;

    for(var i = 0; i < optionsLength; i++) {
        var option = options[i];
        var distance = lev(word, option);

        if(distance < closestDistance) {
            closest = option;
            closestDistance = distance;
        }
    }

    return closest;
};

// return the closest index from a JSON object.
module.exports.closestIndex = function(word, options) {
    var indices = [];

    for(var index in options) {
        if(options.hasOwnProperty(index)) {
            indices.push(index);
        }
    }

    return module.exports(word, indices);
};
