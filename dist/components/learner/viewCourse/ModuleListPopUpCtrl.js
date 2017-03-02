'use strict;'

angular.module ('clientApp')

.controller('ModuleListPopUpCtrl', ['$scope', '$state', '$stateParams', 'miniCourseFactory', 'ngDialog', function($scope, $state, $stateParams, miniCourseFactory, ngDialog) {
    $scope.miniCourse = miniCourseFactory.get({id:$scope.ngDialogData.miniCourseId})
    .$promise.then(function(response){
        $scope.miniCourse = response;
    }, function(response){
        console.log(response.status);
    });

    $scope.readModule = function(mid){
        $scope.closeThisDialog();
        $state.go('viewModule', {id:mid});
    }
}])