'use strict;'

angular.module('clientApp')

.controller('MakeCourseCtrl', ['$scope', '$state', '$stateParams', 'miniCourseFactory', 'moduleFactory', function($scope, $state, $stateParams, miniCourseFactory, moduleFactory){
    $scope.miniCourse = miniCourseFactory.get({id:$stateParams.id})
    .$promise.then(function(response){
        
        $scope.miniCourse = response;
        console.log(response);
        if ($scope.miniCourse.name === ''){
            $scope.miniCourseNameSet = false;
        }
        $scope.moduleIdArray = [];
        for (var index = 0; index < $scope.miniCourse.modules.length; index++) {
            $scope.moduleIdArray.push($scope.miniCourse.modules[index]._id);
        }
  
        $scope.modules = moduleFactory.query()
        .$promise.then(function(modulesArray){
            $scope.modules = modulesArray;
            for (var index = 0; index < $scope.modules.length; index++) {
                if ($scope.moduleId)
                $scope.modules[index].isSelected = false;
            }
        }, function(response){
            console.log(response.status);
        });
    }, function(response){
        console.log(response);
    });
    
    $scope.selectModule = function(index) {
        if ($scope.modules[index].isSelected){
            $scope.miniCourse.modules.push({_id:$scope.modules[index]._id, name: $scope.modules[index].name});
            $scope.moduleIdArray.push($scope.modules[index]._id);
            
            miniCourseFactory.update({id: $stateParams.id},{modules: $scope.moduleIdArray})
            .$promise.then(function(response){
                console.log("update done");
            }, function(response){
                console.log(response.status);
            });
        } 
        
    };

    $scope.setMiniCourseName = function() {
        miniCourseFactory.update({id:$stateParams.id},{name:$scope.miniCourse.name})
        .$promise.then(function(response){
            console.log("name updated");
            $scope.miniCourseNameSet = true;
        }, function(response){
            console.log(response.status);
        })
        $scope.miniCourseNameSet = true;

    };

    
}])