'use strict';

var symbolize = function(str) {
    function convert(match) {
        return '&'+match.slice(-1);
    }
    return str.replace(/&amp;\S/g, convert);
};
module.exports = symbolize;

/**
 * Usage:
 * destStr = symbolize (srcStr);
 */