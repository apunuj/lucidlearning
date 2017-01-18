'use strict';

angular.module('clientApp')

.controller('TopicsCtrl', ['$scope', '$state', 'dataFactory', function($scope, $state, dataFactory){
    $scope.moduleName = dataFactory.getModuleName();
    $scope.topics = dataFactory.getTopicsList();

    $scope.newTopic = '';
    $scope.topicsUpdate = [];

    $scope.addTopic = function(){
        $scope.topics.push($scope.newTopic);
        $scope.topicsUpdate.push($scope.newTopic);
        $scope.newTopic= '';
        $scope.topicForm.$setPristine();
    };

    $scope.submitTopics = function(){
        var tempTopics = $scope.topicsUpdate.slice();
        dataFactory.setTopicsList(tempTopics);
        $state.go('learningPoints');
    };
}]);