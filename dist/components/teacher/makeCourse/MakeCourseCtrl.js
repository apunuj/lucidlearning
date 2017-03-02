'use strict;'

angular.module('clientApp')

.controller('MakeCourseCtrl', ['$scope', '$state', '$stateParams', 'miniCourseFactory', 'sectionFactory', 'moduleFactory', 'sectionModuleFactory', 'ngDialog', function($scope, $state, $stateParams, miniCourseFactory, sectionFactory, moduleFactory, sectionModuleFactory, ngDialog){
    
    ////////////////////////
    //scope functions-list//
    ///////////////////////

    //1. higher-level functions for mini-course (setting/updating name, deleting the course, setting the module list)
    $scope.setMiniCourseName = setMiniCourseName;
    $scope.toggleMiniCourseName = toggleMiniCourseName;
    $scope.deleteMiniCourse = deleteMiniCourse;
    $scope.selectModule = selectModule;


    /////////////////////
    //helper functions//
    ///////////////////

    //1. used to update the list of modules in the mini-course (everytime a new module array is passed)
    function updateMiniCourse(cb) {
        miniCourseFactory.update({id: $stateParams.id},{modules: $scope.moduleIdArray})
        .$promise.then(function(response){
            console.log("update done");
            cb();
        }, function(response){
            console.log(response.status);
        });
    };

  
    ////////////////////////////////////////
    //Fetching factory data into the model//
    ////////////////////////////////////////


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

    ////////////////////////
    //Function Definitions//
    ///////////////////////

    function selectModule(index) {
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

    function setMiniCourseName() {
        miniCourseFactory.update({id:$stateParams.id},{name:$scope.miniCourse.name})
        .$promise.then(function(response){
            console.log("name updated");
            $scope.miniCourseNameSet = true;
        }, function(response){
            console.log(response.status);
        })
    };

    function toggleMiniCourseName() {
        $scope.miniCourseNameSet = !$scope.miniCourseNameSet;
    };

    function deleteMiniCourse(){
        miniCourseFactory.remove({id:$stateParams.id})
        .$promise.then(function(response){
            $state.go('teacher-dashboard');
        }, function(response){
            console.log(response.status);
        })
    };
  
}]);