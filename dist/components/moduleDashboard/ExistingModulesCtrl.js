'use strict';

angular.module('clientApp')

.controller('ExistingModulesCtrl', ['$scope', '$state', 'moduleFactory', function($scope, $state, moduleFactory){
    $scope.modules = moduleFactory.query({})
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