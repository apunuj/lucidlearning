'use strict';

angular.module('clientApp')

.controller('ContentCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'learningPointFactory', 'brainStormingSessionFactory', function($scope, $state, $stateParams, moduleFactory, learningPointFactory, brainStormingSessionFactory) {
   var html = katex.renderToString("c = \\pm\\sqrt{a^2 + b^2}");
   document.getElementById("hello").innerHTML = html;
    $scope.module = moduleFactory.get({id: $stateParams.id})
                    .$promise.then(function(response){
                    $scope.module = response;

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

    //function for updating symbols used in the editors
    var symbolize = function(str) {
        function convert(match) {
            return '&'+match.slice(-1);
        }
        return str.replace(/&amp;\S/g, convert);
    };
    
    //for updating the content of individual learning points and refreshing the symbols
    $scope.updateContent = function(tindex, lindex) {
        
        //$scope.module.topics[tindex].learningPoints[lindex].content = $scope.module.topics[tindex].learningPoints[lindex].content + html;
        $scope.module.topics[tindex].learningPoints[lindex].content = symbolize($scope.module.topics[tindex].learningPoints[lindex].content);
        learningPointFactory.update({
            id: $stateParams.id,
            tid: $scope.module.topics[tindex]._id,
            lid: $scope.module.topics[tindex].learningPoints[lindex]._id
        }, $scope.module.topics[tindex].learningPoints[lindex])
        .$promise.then(function(response){
            console.log(response);
        },
        function(response){
            console.log(response);
        });

    };
    
    //for updating all the content together
    $scope.submitContent = function() {
        $scope.recursiveUpdate = function(tindex, lindex) {
            learningPointFactory.update({
                id: $stateParams.id,
                tid: $scope.module.topics[tindex]._id,
                lid: $scope.module.topics[tindex].learningPoints[lindex]._id
            }, $scope.module.topics[tindex].learningPoints[lindex])
            .$promise.then(function(updatedLearningPoint){
                $scope.module.topics[tindex].learningPoints[lindex]._id = updatedLearningPoint._id;
                lindex++;
                if(lindex < $scope.module.topics[tindex].learningPoints.length) {
                    $scope.recursiveUpdate(tindex, lindex);
                }
                lindex = 0;
                tindex++;
                if(tindex < $scope.module.topics.leangth) {
                    $scope.recursiveUpdate(tindex, lindex);
                }
                $state.go('view', {id:$stateParams.id});
            },
            function(updatedLearningPoint){
                console.log(updatedLearningPoint.status);
            });
        };
        $scope.recursiveUpdate(0,0);
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