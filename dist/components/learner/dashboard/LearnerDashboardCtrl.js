angular.module ('clientApp')

.controller('LearnerDashboardCtrl', ['$scope','$state', '$stateParams', 'miniCourseFactory', 'moduleFactory', function($scope, $state, $stateParams, miniCourseFactory, moduleFactory){
   
    $scope.modules = moduleFactory.query()
    .$promise.then(function(response){
        $scope.modules = response;
        $scope.miniCourses = miniCourseFactory.query()
        .$promise.then(function(response){
            $scope.miniCourses = response;
        }, function(response){
            console.log(response.status);
        });
    }, function(response) {
        console.log(response.status);
    })
}]);