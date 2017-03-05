angular.module('clientApp')

.controller('ViewCourseCtrl',['$scope', '$state', '$stateParams', 'miniCourseFactory', function($scope, $state, $stateParams, miniCourseFactory){
    
    $scope.moduleListReady = false;

    $scope.miniCourse = miniCourseFactory.get({id:$stateParams.id})
    .$promise.then(function(response){
        $scope.miniCourse = response;
        $scope.moduleListReady = true;
    }, function(response){
        console.log(response.status);
    });
}]);