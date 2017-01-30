'use strict';

angular.module('clientApp')

.controller('CreateCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'topicFactory', 'learningPointFactory', 'brainStormingSessionFactory', function($scope, $state, $stateParams, moduleFactory, topicFactory, learningPointFactory, brainStormingSessionFactory) {
    
    $scope.module = moduleFactory.get({id: $stateParams.id})
                    .$promise.then(function(response){
                        $scope.module = response;
                        
                        
                        //holders for new topics and learning Points
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

                        //toggle flags for showing/hiding learning Points topic forms
                        $scope.showTopicForm = false;
                        $scope.showLearningPoint = [];
                        for (var index = 0; index < $scope.module.topics.length; index++) {
                            $scope.showLearningPoint.push(true);
                        }
                       
                        //toggle flags for editing names for module, topics and learning points
                        $scope.moduleNameSet = ($scope.module.name === '')?false:true;

                        $scope.editTopicToggle=[];
                        for (var index = 0; index < $scope.module.topics.length; index++) {
                            $scope.editTopicToggle.push(false);
                        }

                        $scope.editLearningPointToggle = [];
                        for (var tindex = 0; tindex < $scope.module.topics.length; tindex++){
                            $scope.editLearningPointToggle.push([]);
                            for (var lindex = 0; lindex < $scope.module.topics[tindex].learningPoints.length; lindex++){
                                $scope.editLearningPointToggle[tindex].push(false);
                            }
                        }

                        //initializing the brainstorming session
                        $scope.brainStormingSession = brainStormingSessionFactory.query({moduleId:response._id})
                        .$promise.then(function(response){
                            $scope.brainStormingSession = response[0];
                            $scope.brainStormingSession.newPointObject = {
                                name: '',
                                completed: false
                            };
                            $scope.openPoints = [];
                            $scope.closedPoints = [];
                            for (var index = 0; index < $scope.brainStormingSession.points.length; index++) {
                                $scope.brainStormingSession.points[index].bindex = index;
                                if ($scope.brainStormingSession.points[index].completed === true) {
                                    $scope.closedPoints.push($scope.brainStormingSession.points[index]);
                                } else {
                                    $scope.openPoints.push($scope.brainStormingSession.points[index]);
                                }
                            }
                        }, function(response){
                            console.log(response.status);
                        });

                    },
                    function(response){
                        console.log(response.status);
                    });

//Toggle Functions
    $scope.editModuleName = function() {
        $scope.moduleNameSet = !$scope.moduleNameSet;
    };
    $scope.editTopic = function(tindex) {
        $scope.editTopicToggle[tindex] = !$scope.editTopicToggle[tindex];
    };
    $scope.editLearningPoint = function(tindex, lindex) {
        $scope.editLearningPointToggle[tindex][lindex] = !$scope.editLearningPointToggle[tindex][lindex];
    }
    $scope.toggleTopicForm = function(){
        $scope.showTopicForm = !$scope.showTopicForm;
    }
    $scope.toggleShowLearningPoint = function(tindex) {
        $scope.showLearningPoint[tindex] = !$scope.showLearningPoint[tindex];
    }

//Structure Edit Functions

//module name function(s)
$scope.setModuleName = function(){
    moduleFactory.update({id:$stateParams.id},{name: $scope.module.name})
    .$promise.then(function(response){
        $scope.editModuleName();
    }, function(response){
        console.log(err.status);
    });
};

// Topic Functions
    $scope.removeTopic = function(tindex) {
        topicFactory.remove({id:$stateParams.id, tid: $scope.module.topics[tindex]._id})
        .$promise.then(function(response){
            console.log(response);
            $scope.module.topics.splice(tindex, 1);
        },
        function(response){
            console.log(response.status);
        });
    };

     $scope.addTopic = function() {
        topicFactory.save({id:$stateParams.id},$scope.module.newTopicObject)
        .$promise.then(function(response){
            $scope.module.topics.push(response);
            $scope.module.newTopicObject = {
                name: "",
                learningPoints: []
            };
            $scope.showTopicForm = false;
        },
        function(response){
            console.log(response.status);
        });
    };

    $scope.moveTopicUp = function(tindex) {
        //ensuring that the topic is not already at the top
        if (tindex === 0) {
            alert("This topic is already at the top");
            return;
        }
        //sending the updated topicId Array to the server
        var topicIdArray = [];
        for (var index = 0; index < $scope.module.topics.length; index++) {
            topicIdArray.push($scope.module.topics[index]._id);
        }
        topicIdArray.splice(tindex,1);
        topicIdArray.splice(tindex-1, 0, $scope.module.topics[tindex]._id);
        moduleFactory.update({id:$stateParams.id}, {topics: topicIdArray})
        .$promise.then(function(response){
            //After successfully updating the server, we are updating $scope here
            var tempTopic = {
                name: $scope.module.topics[tindex].name,
                _id: $scope.module.topics[tindex]._id,
                learningPoints: [],
                tags: [],
                createdBy: []
            };
            for (var index = 0; index < $scope.module.topics[tindex].learningPoints.length; index++) {
                tempTopic.learningPoints.push($scope.module.topics[tindex].learningPoints[index]);
            }
            for (var index = 0; index < $scope.module.topics[tindex].tags.length; index++) {
                tempTopic.tags.push($scope.module.topics[tindex].tags[index]);
            }
            for (var index = 0; index < $scope.module.topics[tindex].createdBy.length; index++) {
                tempTopic.createdBy.push($scope.module.topics[tindex].createdBy[index]);
            }

            $scope.module.topics.splice(tindex, 1);
            $scope.module.topics.splice(tindex-1, 0, tempTopic);

        }, function(response){
            console.log(response.status);
        });
    };

    $scope.moveTopicDown = function(tindex) {
        //ensuring that the topic is not already at the bottom
        if (tindex === $scope.module.topics.length-1) {
            alert("This topic is already at the bottom");
            return;
        }
        //sending the updated topicId Array to the server
        var topicIdArray = [];
        for (var index = 0; index < $scope.module.topics.length; index++) {
            topicIdArray.push($scope.module.topics[index]._id);
        }
        topicIdArray.splice(tindex,1);
        topicIdArray.splice(tindex+1, 0, $scope.module.topics[tindex]._id);
        moduleFactory.update({id:$stateParams.id}, {topics: topicIdArray})
        .$promise.then(function(response){
            //After successfully updating the server, we are updating $scope here
            var tempTopic = {
                name: $scope.module.topics[tindex].name,
                _id: $scope.module.topics[tindex]._id,
                learningPoints: [],
                tags: [],
                createdBy: []
            };
            for (var index = 0; index < $scope.module.topics[tindex].learningPoints.length; index++) {
                tempTopic.learningPoints.push($scope.module.topics[tindex].learningPoints[index]);
            }
            for (var index = 0; index < $scope.module.topics[tindex].tags.length; index++) {
                tempTopic.tags.push($scope.module.topics[tindex].tags[index]);
            }
            for (var index = 0; index < $scope.module.topics[tindex].createdBy.length; index++) {
                tempTopic.createdBy.push($scope.module.topics[tindex].createdBy[index]);
            }

            $scope.module.topics.splice(tindex, 1);
            $scope.module.topics.splice(tindex+1, 0, tempTopic);

        }, function(response){
            console.log(response.status);
        });
    };

    $scope.submitNewTopicName = function(tindex) {
        topicFactory.update({id: $stateParams.id, tid: $scope.module.topics[tindex]._id}, {name: $scope.module.topics[tindex].name})
        .$promise.then(function(updatedTopic){
            $scope.editTopic(tindex);
        },
        function(updatedTopic){
            console.log(updatedTopic.status);
        });
    };

//LearningPointFunctions
    $scope.removeLearningPoint = function(tindex, lindex) {
        learningPointFactory.remove({id:$stateParams.id, tid: $scope.module.topics[tindex]._id, lid: $scope.module.topics[tindex].learningPoints[lindex]._id})
        .$promise.then(function(response){
            $scope.module.topics[tindex].learningPoints.splice($scope.module.topics[tindex].learningPoints[lindex], 1);
        },
        function(response){
            console.log(response.status);
        });
    };

    $scope.addLearningPoint = function(tindex, lindex) {
        learningPointFactory.save({id:$stateParams.id, tid:$scope.module.topics[tindex]._id},$scope.module.topics[tindex].newLearningPointObject)
        .$promise.then(function(response){
            console.log(response);
            $scope.module.topics[tindex].learningPoints.push(response);
            $scope.module.topics[tindex].newLearningPointObject = {
                name: "",
                content: ""
            };
        },
        function(response){
            console.log(response.status);
        });
    };

    $scope.moveLearningPointUp = function(tindex, lindex) {
         if (lindex === 0) {
            alert("This learningPoint is already at the top");
            return;
        }
        //sending the updated learningPointId Array to the server
        var learningPointIdArray = [];
        for (var index = 0; index < $scope.module.topics[tindex].learningPoints.length; index++) {
            learningPointIdArray.push($scope.module.topics[tindex].learningPoints[index]._id);
        }
        learningPointIdArray.splice(lindex,1);
        learningPointIdArray.splice(lindex-1, 0, $scope.module.topics[tindex].learningPoints[lindex]._id);
        topicFactory.update({id:$stateParams.id, tid:$scope.module.topics[tindex]._id}, {learningPoints: learningPointIdArray})
        .$promise.then(function(response){
            //After successfully updating the server, we are updating $scope here
            var templearningPoint = {
                name: $scope.module.topics[tindex].learningPoints[lindex].name,
                _id: $scope.module.topics[tindex].learningPoints[lindex]._id,
                content: $scope.module.topics[tindex].learningPoints[lindex].content,
                tags: [],
                createdBy: []
            };
            for (var index = 0; index < $scope.module.topics[tindex].learningPoints[lindex].tags.length; index++) {
                templearningPoint.tags.push($scope.module.topics[tindex].learningPoints[lindex].tags[index]);
            }
            for (var index = 0; index < $scope.module.topics[tindex].learningPoints[lindex].createdBy.length; index++) {
                templearningPoint.createdBy.push($scope.module.topics[tindex].learningPoints[lindex].createdBy[index]);
            }

           $scope.module.topics[tindex].learningPoints.splice(lindex, 1);
           $scope.module.topics[tindex].learningPoints.splice(lindex-1, 0, templearningPoint);

        }, function(response){
            console.log(response.status);
        });
    };

    $scope.moveLearningPointDown = function(tindex, lindex) {
        //ensuring that the learning point is not already at the bottom
        if (lindex === $scope.module.topics.length-1) {
            alert("This learning point is already at the bottom");
            return;
        }
        //sending the updated learningPointId Array to the server
        var learningPointIdArray = [];
        for (var index = 0; index < $scope.module.topics[tindex].learningPoints.length; index++) {
            learningPointIdArray.push($scope.module.topics[tindex].learningPoints[index]._id);
        }
        learningPointIdArray.splice(lindex,1);
        learningPointIdArray.splice(lindex+1, 0, $scope.module.topics[tindex].learningPoints[lindex]._id);
        topicFactory.update({id:$stateParams.id, tid:$scope.module.topics[tindex]._id}, {learningPoints: learningPointIdArray})
        .$promise.then(function(response){
            //After successfully updating the server, we are updating $scope here
            var templearningPoint = {
                name: $scope.module.topics[tindex].learningPoints[lindex].name,
                _id: $scope.module.topics[tindex].learningPoints[lindex]._id,
                content: $scope.module.topics[tindex].learningPoints[lindex].content,
                tags: [],
                createdBy: []
            };
            for (var index = 0; index < $scope.module.topics[tindex].learningPoints[lindex].tags.length; index++) {
                templearningPoint.tags.push($scope.module.topics[tindex].learningPoints[lindex].tags[index]);
            }
            for (var index = 0; index < $scope.module.topics[tindex].learningPoints[lindex].createdBy.length; index++) {
                templearningPoint.createdBy.push($scope.module.topics[tindex].learningPoints[lindex].createdBy[index]);
            }

           $scope.module.topics[tindex].learningPoints.splice(lindex, 1);
           $scope.module.topics[tindex].learningPoints.splice(lindex+1, 0, templearningPoint);

        }, function(response){
            console.log(response.status);
        });
    };

     $scope.submitNewLearningPointName = function(tindex, lindex) {
        learningPointFactory.update({id: $stateParams.id, tid: $scope.module.topics[tindex]._id, lid:$scope.module.topics[tindex].learningPoints[lindex]._id}, {name: $scope.module.topics[tindex].learningPoints[lindex].name})
        .$promise.then(function(updatedLearningPoint){
            $scope.editLearningPoint(tindex, lindex);
        },
        function(updatedLearningPoint){
            console.log(updatedLearningPoint.status);
        });
    };


    //BrainStormingSession Functions
    $scope.openClosedPoint = function(index) {
        var bindex = $scope.closedPoints[index].bindex;
        $scope.closedPoints.splice(index, 1);
        $scope.openPoints.push($scope.brainStormingSession.points[bindex]);
        updateBrainStormingSession();
    };

    $scope.closeOpenPoint = function(index) {
        var bindex = $scope.openPoints[index].bindex;
        $scope.openPoints.splice(index, 1);
        $scope.closedPoints.push($scope.brainStormingSession.points[bindex]);
        updateBrainStormingSession();
    };

    $scope.addBrainStormingPoint = function(){
        console.log($scope.brainStormingSession.newPointObject);
        $scope.brainStormingSession.points.push({name: $scope.brainStormingSession.newPointObject.name, completed:$scope.brainStormingSession.newPointObject.completed, bindex: $scope.brainStormingSession.points.length});
        $scope.openPoints.push({name: $scope.brainStormingSession.newPointObject.name, completed:$scope.brainStormingSession.newPointObject.completed, bindex: $scope.brainStormingSession.points.length});
        $scope.brainStormingSession.newPointObject = {
            name: '',
            completed: false
        };
        updateBrainStormingSession();
    };

    $scope.removePoint = function(index) {
        console.log("entering function")
        var bindex = $scope.closedPoints[index].bindex;
        $scope.closedPoints.splice(index, 1);
        $scope.brainStormingSession.points.splice(bindex,1);
        updateBrainStormingSession();
    };

    var updateBrainStormingSession = function(){
       var pointsArray = [];
       for (var index = 0; index < $scope.brainStormingSession.points.length; index++) {
           pointsArray.push({name: $scope.brainStormingSession.points[index].name, completed: $scope.brainStormingSession.points[index].completed});
       }
       brainStormingSessionFactory.update({id:$scope.brainStormingSession._id}, {points: pointsArray})
       .$promise.then(function(response){
           console.log('update completed');
       }, function(response){
           console.log(response.status);
       })
    };

}]);