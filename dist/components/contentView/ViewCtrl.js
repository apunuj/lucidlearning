'use strict';

angular.module('clientApp')

.controller('ViewCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'miniCourseFactory', function($scope, $state, $stateParams, moduleFactory, miniCourseFactory) {
    $scope.module = moduleFactory.get({id: $stateParams.id})
    .$promise.then(function(response){
        $scope.module = response;
    },
    function(response){
        console.log(response.status);
    });

}]);