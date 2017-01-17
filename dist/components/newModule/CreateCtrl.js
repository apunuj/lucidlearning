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
                        
                        $scope.showLearningPoint = [];
                        for (var index = 0; index < $scope.module.topics.length; index++) {
                            $scope.showLearningPoint.push(false);
                        }
                       
                        $scope.editTopicToggle=[];
                        for (var index = 0; index < $scope.module.topics.length; index++) {
                            $scope.editTopicToggle.push(false);
                        }
                    },
                    function(response){
                        console.log(response.status);
                    });

//Toggle Functions
    $scope.toggleTopicForm = function(){
        $scope.showTopicForm = !$scope.showTopicForm;
    }
    $scope.toggleShowLearningPoint = function(tindex) {
        $scope.showLearningPoint[tindex] = !$scope.showLearningPoint[tindex];
    }
    $scope.editTopic = function(tindex) {
        $scope.editTopicToggle[tindex] = !$scope.editTopicToggle[tindex];
        console.log($scope.editTopicToggle[tindex]);
    };

//Structure Edit Functions
    $scope.removeTopic = function(tindex) {
        topicFactory.remove({id:$stateParams.id, tid: $scope.module.topics[tindex]._id})
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
            $scope.module.topics[tindex].learningPoints.push($scope.module.topics[tindex].newLearningPointObject);
            $scope.module.topics[tindex].newLearningPointObject = {
                name: "",
                content: ""
            };
            //$state.go($state.current, {}, {reload: true});
        },
        function(response){
            console.log(response.status);
        });
    };

    $scope.moveTopicUp = function(tindex) {
        topicFactory.get({id: $stateParams.id, tid: $scope.module.topics[tindex-1]._id})
        .$promise.then(function(previousTopic) {
            topicFactory.update({id: $stateParams.id, tid: $scope.module.topics[tindex-1]._id}, {name: $scope.module.topics[tindex].name, learningPoints: $scope.module.topics[tindex].learningPoints})
            .$promise.then(function(movingTopic) {
                console.log(movingTopic);
                topicFactory.update({id: $stateParams.id, tid: $scope.module.topics[tindex]._id}, {name: previousTopic.name, learningPoints: previousTopic.learningPoints})
                .$promise.then(function(previousTopic) {
                    console.log(previousTopic);
                    $state.go($state.current, {}, {reload: true});
                },
                function(previousTopic) {
                    console.log(previousTopic.status);
                });
            },
            function(movingTopic){
                console.log(movingTopic.status);
            });
        }, 
        function(previousTopic){
            console.log(previousTopic.status);
        });
    };

    $scope.moveTopicDown = function(tindex) {
        topicFactory.get({id: $stateParams.id, tid: $scope.module.topics[tindex+1]._id})
        .$promise.then(function(previousTopic) {
            topicFactory.update({id: $stateParams.id, tid: $scope.module.topics[tindex+1]._id}, {name: $scope.module.topics[tindex].name, learningPoints: $scope.module.topics[tindex].learningPoints})
            .$promise.then(function(movingTopic) {
                console.log(movingTopic);
                topicFactory.update({id: $stateParams.id, tid: $scope.module.topics[tindex]._id}, {name: previousTopic.name, learningPoints: previousTopic.learningPoints})
                .$promise.then(function(previousTopic) {
                    console.log(previousTopic);
                    $state.go($state.current, {}, {reload: true});
                },
                function(previousTopic) {
                    console.log(previousTopic.status);
                });
            },
            function(movingTopic){
                console.log(movingTopic.status);
            });
        }, 
        function(previousTopic){
            console.log(previousTopic.status);
        });
    };

    $scope.submitNewTopicName = function(tindex) {
        topicFactory.update({id: $stateParams.id, tid: $scope.module.topics[tindex]._id}, {name: $scope.module.topics[tindex].name, learningPoints: $scope.module.topics[tindex].learningPoints})
        .$promise.then(function(updatedTopic){
            console.log(updatedTopic);
            $scope.editTopic(tindex);
        },
        function(updatedTopic){
            console.log(updatedTopic.status);
        });
    };

}]);