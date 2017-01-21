'use strict';

angular.module('clientApp')

.controller('ContentCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'learningPointFactory', function($scope, $state, $stateParams, moduleFactory, learningPointFactory) {
   
   $scope.equation = "";
    $scope.module = moduleFactory.get({id: $stateParams.id})
                .$promise.then(function(response){
                    $scope.module = response;
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
        
        console.log($scope.equation);
        $scope.module.topics[tindex].learningPoints[lindex].content = $scope.module.topics[tindex].learningPoints[lindex].content + $scope.equation;
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
        $state.go('view', {id:$stateParams.id});
    };
    
}]);