'use strict;'

angular.module('clientApp')

.factory('sectionFactory', ['$resource', 'baseUrl', function($resource, baseUrl){
    return $resource(baseUrl+'sections/:id', null, {'update': {method: 'PUT'}});
}])