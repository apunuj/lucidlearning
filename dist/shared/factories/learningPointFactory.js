'use strict';

angular.module('clientApp')

.constant('baseUrl', 'http://ec2-54-172-201-85.compute-1.amazonaws.com:3000/')

.factory('learningPointFactory', ['$resource', 'baseUrl', function($resource, baseUrl){
    return $resource(baseUrl+'modules/:id/topics/:tid/learningPoints/:lid', null, {'update': {method: 'PUT'}});
}]);