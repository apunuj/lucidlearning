'use strict';

angular.module('clientApp')

.factory('brainStormingSessionFactory', ['$resource', 'baseUrl', function($resource, baseUrl){
    return $resource(baseUrl+'brainStormingSessions/:id', null, {'update': {method: 'PUT'}});
}]);