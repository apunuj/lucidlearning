'use strict';

angular.module('clientApp')

.controller('ModuleNameCtrl', ['$scope', '$state', 'dataFactory', function($scope, $state, dataFactory){
    $scope.moduleName = dataFactory.getModuleName();
    $scope.isModuleNameSet = ($scope.moduleName === '')?false:true;
    $scope.next = function(){
        dataFactory.setModuleName($scope.moduleName, function(){
            $state.go('topics');
        });
    };
}]);