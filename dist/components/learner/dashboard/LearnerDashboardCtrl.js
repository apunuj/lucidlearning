angular.module ('clientApp')

.controller('LearnerDashboardCtrl', ['$scope','$state', '$stateParams', 'miniCourseFactory', 'moduleFactory', 'ngDialog', function($scope, $state, $stateParams, miniCourseFactory, moduleFactory, ngDialog){
   
   $scope.miniCourseListReady = false;
   $scope.moduleListReady = false;
   $scope.messageMC = 'This is just a brief pause designed to emphasize the gravity of this moment. Take a look at the spinning wheel meanwhile.';
   $scope.messageM = 'Our computers are still figuring out what you would like to read today. How about staring at the spinning wheel meanwhile?';

    $scope.miniCourses = miniCourseFactory.query()
    .$promise.then(function(miniCourses) {
        $scope.miniCourses = miniCourses;
        $scope.miniCourseListReady = true;
        $scope.modules = moduleFactory.query()
        .$promise.then(function(modules) {
            $scope.modules = modules;
            $scope.moduleListReady = true;
        }, function(response) {
            $scope.messageMC = '"'+response.status+'"'+'-Sincerely, Server';
        })
    }, function(reponse) {
        $scope.messageM = '"'+response.status+'"'+'-Sincerely, Server';
    });

    $scope.openModuleListPopUp = function(id) {
         ngDialog.open({ template: 'components/learner/viewCourse/moduleListPopUp.html', data: {miniCourseId: id}, scope: $scope, className: 'ngdialog-theme-default', controller:"ModuleListPopUpCtrl" });
    };

}]);