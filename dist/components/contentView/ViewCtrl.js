'use strict';

angular.module('clientApp')

.controller('ViewCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'miniCourseFactory', 'AuthFactory', function($scope, $state, $stateParams, moduleFactory, miniCourseFactory, AuthFactory) {
    
    $scope.contentReady = false;

    $scope.user = AuthFactory.getUserDetails();
    
    $scope.module = moduleFactory.get({id: $stateParams.id})
    .$promise.then(function(response){
        $scope.contentReady = true;
        $scope.module = response;
    },
    function(response){
        console.log(response.status);
    });

}]);