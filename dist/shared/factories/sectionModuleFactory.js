'use strict;'

angular.module('clientApp')

.factory('sectionModuleFactory', ['$resource', 'baseUrl', function($resource, baseUrl){
    return $resource(baseUrl+'sections/:id/modules/:mid', null, {'update': {method: 'PUT'}});
}])