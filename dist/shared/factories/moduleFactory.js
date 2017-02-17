'use strict';

angular.module('clientApp')

.factory('moduleFactory', ['$resource', 'baseUrl', function($resource, baseUrl){
    return $resource(baseUrl+'modules/:id', null, {'update': {method: 'PUT'}});
}]);

