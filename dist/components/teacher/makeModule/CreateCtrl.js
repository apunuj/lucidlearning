'use strict';

angular.module('clientApp')

.controller('CreateCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'topicFactory', 'learningPointFactory', 'brainStormingSessionFactory', function($scope, $state, $stateParams, moduleFactory, topicFactory, learningPointFactory, brainStormingSessionFactory) {
    
    //toggle functions
    $scope.editModuleName = editModuleName;
    $scope.editTopic = editTopic;
    $scope.editLearningPoint = editLearningPoint; 
    $scope.toggleTopicForm = toggleTopicForm;
    $scope.toggleShowLearningPoint = toggleShowLearningPoint; 

    //functions for changing module structure
    $scope.setModuleName = setModuleName;

    $scope.removeTopic = removeTopic;
    $scope.moveTopicUp = moveTopicUp;
    $scope.moveTopicDown = moveTopicDown;
    $scope.submitNewTopicName = submitNewTopicName;
    $scope.addTopic = addTopic; 

    $scope.removeLearningPoint = removeLearningPoint;
    $scope.moveLearningPointUp = moveLearningPointUp;
    $scope.moveLearningPointDown = moveLearningPointDown;
    $scope.submitNewLearningPointName = submitNewLearningPointName;
    $scope.addLearningPoint = addLearningPoint;

    $scope.openClosedPoint = openClosedPoint;
    $scope.closeOpenPoint = closeOpenPoint;
    $scope.addBrainStormingPoint = addBrainStormingPoint;
    $scope.removePoint = removePoint;

    /**
     * Helper functions:
     * 1. updateBrainStormingSession
     * 2. updateHelperVariables
     */

    
    //fetching data from factory
    $scope.module = moduleFactory.get({id: $stateParams.id})
    .$promise.then(function(response){
        
        $scope.module = response;
        
        updateHelperVariables();

        $scope.brainStormingSession = brainStormingSessionFactory.query({moduleId:response._id})
        .$promise.then(function(response){
            console.log(response);
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
function editModuleName() {
    $scope.moduleNameSet = !$scope.moduleNameSet;
};

function editTopic(tindex) {
    $scope.editTopicToggle[tindex] = !$scope.editTopicToggle[tindex];
};

function editLearningPoint(tindex, lindex) {
    $scope.editLearningPointToggle[tindex][lindex] = !$scope.editLearningPointToggle[tindex][lindex];
};

function toggleTopicForm(){
    $scope.showTopicForm = !$scope.showTopicForm;
};

function toggleShowLearningPoint(tindex) {
    $scope.showLearningPoint[tindex] = !$scope.showLearningPoint[tindex];
};

//Structure Edit Functions

//module name function(s)
function setModuleName(){
    moduleFactory.update({id:$stateParams.id},{name: $scope.module.name})
    .$promise.then(function(response){
        $scope.editModuleName();
    }, function(response){
        console.log(err.status);
    });
};

// Topic Functions
function removeTopic(tindex) {
    topicFactory.remove({id:$stateParams.id, tid: $scope.module.topics[tindex]._id})
    .$promise.then(function(response){
        console.log(response);
        $scope.module.topics.splice(tindex, 1);
        updateHelperVariables();
    },
    function(response){
        console.log(response.status);
    });
};

function addTopic() {
    topicFactory.save({id:$stateParams.id},$scope.module.newTopicObject)
    .$promise.then(function(response){
        $scope.module.topics.push(response);
        updateHelperVariables();
    },
    function(response){
        console.log(response.status);
    });
};

function moveTopicUp(tindex) {
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
        updateHelperVariables();

    }, function(response){
        console.log(response.status);
    });
};

function moveTopicDown(tindex) {
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
        updateHelperVariables();

    }, function(response){
        console.log(response.status);
    });
};

function submitNewTopicName(tindex) {
    topicFactory.update({id: $stateParams.id, tid: $scope.module.topics[tindex]._id}, {name: $scope.module.topics[tindex].name})
    .$promise.then(function(updatedTopic){
        $scope.editTopic(tindex);
    },
    function(updatedTopic){
        console.log(updatedTopic.status);
    });
};

//LearningPointFunctions
function removeLearningPoint(tindex, lindex) {
    learningPointFactory.remove({id:$stateParams.id, tid: $scope.module.topics[tindex]._id, lid: $scope.module.topics[tindex].learningPoints[lindex]._id})
    .$promise.then(function(response){
        $scope.module.topics[tindex].learningPoints.splice(lindex, 1);
        updateHelperVariables();
    },
    function(response){
        console.log(response.status);
    });
};

function addLearningPoint(tindex, lindex) {
    learningPointFactory.save({id:$stateParams.id, tid:$scope.module.topics[tindex]._id},$scope.module.topics[tindex].newLearningPointObject)
    .$promise.then(function(response){
        console.log(response);
        $scope.module.topics[tindex].learningPoints.push(response);
        updateHelperVariables();
    },
    function(response){
        console.log(response.status);
    });
};

function moveLearningPointUp(tindex, lindex) {
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


function moveLearningPointDown(tindex, lindex) {
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

function submitNewLearningPointName(tindex, lindex) {
    learningPointFactory.update({id: $stateParams.id, tid: $scope.module.topics[tindex]._id, lid: $scope.module.topics[tindex].learningPoints[lindex]._id}, {name: $scope.module.topics[tindex].learningPoints[lindex].name})
    .$promise.then(function(updatedLearningPoint){
        $scope.editLearningPoint(tindex, lindex);
    },
    function(updatedLearningPoint){
        console.log(updatedLearningPoint.status);
    });
};


//BrainStormingSession Functions
function openClosedPoint(index) {
    console.log(index);
    function cb(){
        var bindex = $scope.closedPoints[index].bindex;
        $scope.closedPoints.splice(index, 1);
        $scope.openPoints.push($scope.brainStormingSession.points[bindex]);
    };
    
    updateBrainStormingSession(cb);
};

function closeOpenPoint(index) {
    
    function cb(){
        var bindex = $scope.openPoints[index].bindex;
        $scope.openPoints.splice(index, 1);
        $scope.closedPoints.push($scope.brainStormingSession.points[bindex]);
        console.log($scope.closedPoints[$scope.closedPoints.length - 1]);
    };
    
    updateBrainStormingSession(cb);
};


function addBrainStormingPoint(){
    $scope.brainStormingSession.points.push({name: $scope.brainStormingSession.newPointObject.name, completed:$scope.brainStormingSession.newPointObject.completed, bindex: $scope.brainStormingSession.points.length});
    function cb(){
        $scope.openPoints.push($scope.brainStormingSession.points[$scope.brainStormingSession.points.length - 1]);
        console.log('hi');
        console.log($scope.openPoints[$scope.openPoints.length - 1]);
        $scope.brainStormingSession.newPointObject = {
            name: '',
            completed: false
        };
    };
    console.log('hi1');
    updateBrainStormingSession(cb);
};

function removePoint(index) {
    $scope.brainStormingSession.points.splice(bindex,1);
    function cb(){
        var bindex = $scope.closedPoints[index].bindex;
        $scope.closedPoints.splice(index, 1);
    }
    updateBrainStormingSession(cb);
};

//functions

function updateBrainStormingSession(cb) {
    var pointsArray = [];
    for (var index = 0; index < $scope.brainStormingSession.points.length; index++) {
        pointsArray.push({name: $scope.brainStormingSession.points[index].name, completed: $scope.brainStormingSession.points[index].completed});
    }
    brainStormingSessionFactory.update({id:$scope.brainStormingSession._id}, {points: pointsArray})
    .$promise.then(function(response){
        console.log('update completed');
        cb();
    }, function(response){
        console.log(response.status);
    });
};

function updateHelperVariables() {
    
    //holders for new topics and learning Points (need to make them dynamic to accomodate addition/removal of topics and learning points)
    $scope.module.newTopicObject = {  
        name: '',
        learningPoints: []
    };
    
    for (var tindex = 0; tindex < $scope.module.topics.length; tindex++) {
        $scope.module.topics[tindex].newLearningPointObject = {
            name: '',
            content:''
        };
    }

    //toggle flags for showing/hiding learning Points and topic forms
    $scope.showTopicForm = false;
    $scope.showLearningPoint = [];
    for (var tindex = 0; tindex < $scope.module.topics.length; tindex++) {
        $scope.showLearningPoint.push(true);
    }
    
    //toggle flags for editing names for module, topics and learning points
    $scope.moduleNameSet = ($scope.module.name === '')?false:true;
    
    $scope.editTopicToggle = [];

    $scope.editLearningPointToggle = [];

    for (var tindex = 0; tindex < $scope.module.topics.length; tindex++) {
        $scope.editTopicToggle.push(false);
        $scope.editLearningPointToggle.push([]);
        for (var lindex = 0; lindex < $scope.module.topics[tindex].learningPoints.length; lindex++) {
            $scope.editLearningPointToggle[tindex].push(false);
        }
    }
};

}]);