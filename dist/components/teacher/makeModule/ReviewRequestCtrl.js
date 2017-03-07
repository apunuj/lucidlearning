'use strict;'

angular.module('clientApp')

.controller('ReviewRequestCtrl',['$state', '$scope', 'ngDialog', function($state, $scope, ngDialog) {
    $scope.goToDashboard = function() {
        $state.go('teacher-dashboard');
        ngDialog.close();
    }
}])