'use strict';

angular.module('clientApp')

.controller('learningPointCtrl', ['$scope', '$state', 'dataFactory', 'moduleFactory', function ($scope, $state, dataFactory, moduleFactory){
    $scope.moduleName = dataFactory.getModuleName();
    $scope.topics = dataFactory.getTopicsList();
    $scope.lp = dataFactory.getLearningPointsList();

    //creating topic objects for ng-repeat
    $scope.topicObjects = [];
    for (var tindex = 0; tindex < $scope.topics.length; tindex++) {
        var topicObject = {
            name: $scope.topics[tindex],
            learningPoints: [],
            newLearningPoint: '',
            learningPointsUpdate: []
        };
        for(var lindex = 0; lindex < $scope.lp[tindex].length; lindex++) {
            var learningPointObject = {
                name: $scope.lp[tindex][lindex],
                content: ''
            };
            topicObject.learningPoints.push(learningPointObject);
        }
        $scope.topicObjects.push(topicObject);
    }


    $scope.addLearningPoint = function(tindex) {
        $scope.topicObjects[tindex].learningPoints.push({name: $scope.topicObjects[tindex].newLearningPoint, content:''});
        $scope.topicObjects[tindex].learningPointsUpdate.push({name: $scope.topicObjects[tindex].newLearningPoint, content:''});
        $scope.topicObjects[tindex].newLearningPoint = '';
    };


/**
 * In submit learning points function, we need to figure out a mechanism 
 * to upload the module into the db
 * and empty the new module object defined in the dataFac
 */
    $scope.submitLearningPoints = function() {
        /**
         * Creating a temp 2-D array to store learning points updates
         */
        var tempLp = [];

        for(var tindex = 0; tindex < $scope.topics.length; tindex++) {
            tempLp.push([]);
        }

        for(tindex = 0; tindex < $scope.topics.length; tindex++) {
            for(var lindex = 0; lindex < $scope.topicObjects[tindex].learningPointsUpdate.length; lindex++) {
                tempLp[tindex].push($scope.topicObjects[tindex].learningPointsUpdate[lindex].name);
            }
        }
        /**
         * updating the new module object in dataFac
         * with the learning points updates
         */
        for(tindex = 0; tindex < $scope.topics.length; tindex++) {
            dataFactory.setLearningPointsList(tempLp[tindex], tindex);
            $scope.topicObjects[tindex].learningPointsUpdate = [];
        }
        /**
         * Sending the created module to the server
         */
        var newModule = dataFactory.getNewModule();
        moduleFactory.save(newModule)
        .$promise.then(function(response){
            console.log(response);
            dataFactory.resetNewModule();
            $state.go('createModule', {id:response._id});
        },
        function(response){
            console.log(response.status);
        });    
    };
}]);