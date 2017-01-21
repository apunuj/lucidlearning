'use strict';

angular.module('clientApp')

.factory('topicFactory', ['$resource', 'baseUrl', function($resource, baseUrl){
    return $resource(baseUrl+'modules/:id/topics/:tid', null, {'update': {method: 'PUT'}});
}]);