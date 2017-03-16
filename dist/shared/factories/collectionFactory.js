'use strict';

angular.module('clientApp')

.factory('collectionFactory', ['$resource', 'baseUrl', function($resource, baseUrl) {
    return $resource(baseUrl+'collections/:id', null, {'update': {method: 'PUT'}});
}]);