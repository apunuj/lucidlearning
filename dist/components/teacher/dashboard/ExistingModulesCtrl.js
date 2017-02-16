'use strict';

angular.module('clientApp')

.controller('ExistingModulesCtrl', ['$scope', '$state', 'moduleFactory', 'AuthFactory', function($scope, $state, moduleFactory, AuthFactory){
    
    var user = AuthFactory.getUserDetails();

    if (user.admin) {
        var filter = {};
    } else {
        var filter = {
            createdBy: user._id
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