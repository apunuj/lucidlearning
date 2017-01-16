'use strict';

angular.module('clientApp')

.controller('CreateCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'topicFactory', 'learningPointFactory', function($scope, $state, $stateParams, moduleFactory, topicFactory, learningPointFactory) {
    
    $scope.module = moduleFactory.get({id: $stateParams.id})
                    .$promise.then(function(response){
                        $scope.module = response;
                        $scope.module.newTopicObject = {
                            name: "",
                            learningPoints: []
                        };
                        for (var index = 0; index < $scope.module.topics.length; index++) {
                            $scope.module.topics[index].newLearningPointObject = {
                                name: "",
                                content:""
                            };
                        }
                        $scope.showTopicForm = false;
                        $scope.toggleTopicForm = function(){
                            $scope.showTopicForm = !$scope.showTopicForm;
                        }
                        
                        $scope.showLearningPoint = [];
                        for (var index = 0; index < $scope.module.topics.length; index++) {
                            $scope.showLearningPoint.push(false);
                        }
                        $scope.toggleShowLearningPoint = function(tindex) {
                            $scope.showLearningPoint[tindex] = !$scope.showLearningPoint[tindex];
                        }
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

    $scope.addTopic = function() {
        topicFactory.save({id:$stateParams.id},$scope.module.newTopicObject)
        .$promise.then(function(response){
            console.log(response);
            $scope.module.newTopicObject = {
                name: "",
                learningPoints: []
            };
            $scope.showTopicForm = false;
            $state.go($state.current, {}, {reload: true});
        },
        function(response){
            console.log(response.status);
        });
    };

    $scope.addLearningPoint = function(tindex) {
        learningPointFactory.save({id:$stateParams.id, tid:$scope.module.topics[tindex]._id},$scope.module.topics[tindex].newLearningPointObject)
        .$promise.then(function(response){
            console.log(response);
            $scope.module.topics[tindex].newLearningPointObject = {
                name: "",
                content: ""
            };
            $state.go($state.current, {}, {reload: true});
        },
        function(response){
            console.log(response.status);
        });
    };

}]);