angular.module ('clientApp')

.controller('LearnerDashboardCtrl', ['$scope','$state', '$stateParams', 'miniCourseFactory', 'moduleFactory', 'ngDialog', function($scope, $state, $stateParams, miniCourseFactory, moduleFactory, ngDialog){
   
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
    });

    $scope.openModuleListPopUp = function(id) {
         ngDialog.open({ template: 'components/learner/viewCourse/moduleListPopUp.html', data: {miniCourseId: id}, scope: $scope, className: 'ngdialog-theme-default', controller:"ModuleListPopUpCtrl" });
    };

}]);