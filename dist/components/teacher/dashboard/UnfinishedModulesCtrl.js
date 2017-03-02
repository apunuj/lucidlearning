'use strict';

angular.module('clientApp')

.controller('UnfinishedModulesCtrl', ['$scope', '$state', 'moduleFactory', 'AuthFactory', function($scope, $state, moduleFactory, AuthFactory){
    
    $scope.user = AuthFactory.getUserDetails();

    if ($scope.user.moderator) {
        var filter = {};
    } else {
        var filter = {
            createdBy: $scope.user._id,
            approved: false
        }
    }

    $scope.modules = moduleFactory.query(filter)
                    .$promise.then(function(response){
                        $scope.modules = response;
                    },
                    function(response){
                        console.log(response.status);
                    });
    
    $scope.remove = function(mid){
        moduleFactory.remove({id:mid})
        .$promise.then(function(response){
            console.log(response);
            $state.go($state.current, {}, {reload: true});
        },
        function(response){
            console.log(response.status);
        });
    };

}]);