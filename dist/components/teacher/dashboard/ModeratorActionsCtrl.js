'use strict;'

angular.module('clientApp')

.controller('ModeratorActionsCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', function($scope, $state, $stateParams, moduleFactory) {

    $scope.modules = moduleFactory.query({reviewRequested: true, approved: false})
    .$promise.then(function(response) {
        $scope.modules = response;
    }, function(response) {
        console.log(response.status);
    })
}])