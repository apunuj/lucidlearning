angular.module('clientApp')

.controller('ViewCourseCtrl',['$scope', '$state', '$stateParams', 'miniCourseFactory', function($scope, $state, $stateParams, miniCourseFactory){
    $scope.miniCourse = miniCourseFactory.get({id:$stateParams.id})
    .$promise.then(function(response){
        $scope.miniCourse = response;
    }, function(response){
        console.log(response.status);
    });
}]);