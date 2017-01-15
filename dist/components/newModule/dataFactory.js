'use strict';

angular.module('clientApp')

.factory('dataFactory', function() {
//declaring local variables and helper methods
    var newModule = {};
    newModule.name = '';
    newModule.topics = [];

    var dataFac = {};

//declaring factory methods for new module name
    dataFac.setModuleName = function(str, callback) {
        newModule.name = str;
        callback();
    };

    dataFac.getModuleName = function(){
        return newModule.name;
    };


//declaring factory methods for topics list
    dataFac.getTopicsList = function(){
        var topicsArray = [];
        for (var index=0; index < newModule.topics.length; index++) {
            topicsArray.push(newModule.topics[index].name);
        }
        return topicsArray.slice();
    };

    dataFac.setTopicsList = function(topics) {
        for (var tindex = 0; tindex < topics.length; tindex++) {
            var newTopic = {};
            newTopic.name = topics[tindex];
            newTopic.learningPoints = [];
            newModule.topics.push(newTopic);
        }  
    };

//declaring factory methods for learning Points
    dataFac.getLearningPointsList = function() {
        var learningPointsArray = [];
        for (var tindex = 0; tindex < newModule.topics.length; tindex++){
            var learningPointsRow = [];
            for(var lindex = 0; lindex < newModule.topics[tindex].learningPoints.length; lindex++) {
                learningPointsRow.push(newModule.topics[tindex].learningPoints[lindex].name);
            }
            learningPointsArray.push(learningPointsRow);
        }
        return learningPointsArray.slice();
    };

    dataFac.setLearningPointsList = function(learningPoints, tindex) {
        for(var lindex = 0; lindex < learningPoints.length; lindex++) {
            var newLearningPoint = {
                name: learningPoints[lindex],
                content: ''
            };
            newModule.topics[tindex].learningPoints.push(newLearningPoint);
        }
    };

    dataFac.getNewModule = function(){
        return newModule;
    };

    dataFac.resetNewModule = function(){
        newModule.name = '';
        newModule.topics = [];
    };

    return dataFac;

});