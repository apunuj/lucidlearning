'use strict';

angular.module('clientApp')

.constant('baseUrl', 'http://localhost:3000/')

.factory('moduleFactory', ['$resource', 'baseUrl', function($resource, baseUrl){
    return $resource(baseUrl+'modules/:id', null, {'update': {method: 'PUT'}});
}]);