'use strict';

angular.module('clientApp')

.controller('StructureCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'topicFactory', 'learningPointFactory', function($scope, $state, $stateParams, moduleFactory, topicFactory, learningPointFactory) {
    $scope.module = moduleFactory.get({id: $stateParams.id})
                    .$promise.then(function(response){
                        $scope.module = response;
                    },
                    function(response){
                        console.log(response.status);
                    });
 
    $scope.removeTopic = function(topicId) {
        topicFactory.remove({id:$stateParams.id, tid: topicId})
        .$promise.then(function(response){
            console.log(response);
            $state.go($state.current, {}, {reload: true});
        },
        function(response){
            console.log(response.status);
        });
    };
    
    $scope.removeLearningPoint = function(topicId, lpId) {
        learningPointFactory.remove({id:$stateParams.id, tid: topicId, lid: lpId})
        .$promise.then(function(response){
            console.log(response);
            $state.go($state.current, {}, {reload: true});
        },
        function(response){
            console.log(response.status);
        });
    };

}]);