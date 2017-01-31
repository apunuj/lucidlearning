'use strict;'

angular.module('clientApp')

.controller('MakeCourseCtrl', ['$scope', '$state', '$stateParams', 'miniCourseFactory', 'moduleFactory', function($scope, $state, $stateParams, miniCourseFactory, moduleFactory){
    $scope.miniCourse = miniCourseFactory.get({id:$stateParams.id})
    .$promise.then(function(response){
        
        $scope.miniCourse = response;
        console.log(response);
        if ($scope.miniCourse.name === ''){
            $scope.miniCourseNameSet = false;
        } else {
            $scope.miniCourseNameSet = true;
        }
        $scope.moduleIdArray = [];
        for (var index = 0; index < $scope.miniCourse.modules.length; index++) {
            $scope.moduleIdArray.push($scope.miniCourse.modules[index]._id);
        }
  
        $scope.modules = moduleFactory.query()
        .$promise.then(function(modulesArray){
            $scope.modules = modulesArray;
            for (var index = 0; index < $scope.modules.length; index++) {
                if ($scope.moduleIdArray.indexOf($scope.modules[index]._id) >= 0) {
                    $scope.modules[index].isSelected = true;
                    console.log($scope.modules[index].isSelected);
                } else {
                    $scope.modules[index].isSelected = false;
                } 
            }

        }, function(response){
            console.log(response.status);
        });

    }, function(response){
        console.log(response);
    });
    
    $scope.selectModule = function(index) {
        if ($scope.modules[index].isSelected){
            $scope.moduleIdArray.push($scope.modules[index]._id);
            updateMiniCourse(function(){
                $scope.miniCourse.modules.push({_id:$scope.modules[index]._id, name: $scope.modules[index].name});
            });
            
        } else {
            var mcindex = $scope.moduleIdArray.indexOf($scope.modules[index]._id);
            $scope.moduleIdArray.splice(mcindex,1);
            updateMiniCourse(function(){
                $scope.miniCourse.modules.splice(mcindex,1);
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
    };

    var updateMiniCourse = function(cb) {
        miniCourseFactory.update({id: $stateParams.id},{modules: $scope.moduleIdArray})
        .$promise.then(function(response){
            console.log("update done");
            cb();
        }, function(response){
            console.log(response.status);
        });
    };

    $scope.deleteMiniCourse = function(){
        miniCourseFactory.remove({id:$stateParams.id})
        .$promise.then(function(response){
            $state.go('teacher-dashboard');
        }, function(response){
            console.log(response.status);
        })
    }

    
}])