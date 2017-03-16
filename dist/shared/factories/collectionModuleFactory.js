'use strict';

angular.module('clientApp')

.factory('collectionModuleFactory', ['$resource', 'baseUrl', function($resource, baseUrl) {
    return $resource(baseUrl+'collections/:id/modules/:mid', null, {'update': {method:'PUT'}});
}]);