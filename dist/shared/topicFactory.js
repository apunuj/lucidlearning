'use strict';

angular.module('clientApp')

.constant('baseUrl', 'http://localhost:3000/')

.factory('topicFactory', ['$resource', 'baseUrl', function($resource, baseUrl){
    return $resource(baseUrl+'modules/:id/topics/:tid', null, {'update': {method: 'PUT'}});
}]);