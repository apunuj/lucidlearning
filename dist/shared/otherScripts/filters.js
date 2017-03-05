'use strict';

angular.module('clientApp')

.filter('symbols',function() {
    return function(str){
        return str.replace(/&amp;/g,'&');
    };
})

.filter('capitalize', function() {
    return function(input) {
      return (!!input) ? input.charAt(0).toUpperCase() + input.substr(1).toLowerCase() : '';
    };
})

.filter('stripStyles', function() {
  return function(str) {
    return str.replace(/style=['"].*["']/, '');
  };
});
