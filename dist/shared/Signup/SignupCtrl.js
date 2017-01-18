'use strict';

angular.module('clientApp')

.controller('RegisterController', ['$scope', 'ngDialog', 'AuthFactory', function ($scope, ngDialog, AuthFactory) {
    
    $scope.registration={};
    $scope.registration.teacher = false;
    
    $scope.doRegister = function() {
        console.log('Doing registration', $scope.registration);

        AuthFactory.register($scope.registration);
        
        ngDialog.close();

    };
}]);