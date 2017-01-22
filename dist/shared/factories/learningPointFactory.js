'use strict';

angular.module('clientApp')

.factory('learningPointFactory', ['$resource', 'baseUrl', function($resource, baseUrl){
    return $resource(baseUrl+'modules/:id/topics/:tid/learningPoints/:lid', null, {'update': {method: 'PUT'}});
}]);