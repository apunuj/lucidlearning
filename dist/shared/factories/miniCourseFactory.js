'use strict;'

angular.module('clientApp')

.factory('miniCourseFactory', ['$resource', 'baseUrl', function($resource, baseUrl){
    return $resource(baseUrl+'miniCourses/:id', null, {'update': {method: 'PUT'}});
}])