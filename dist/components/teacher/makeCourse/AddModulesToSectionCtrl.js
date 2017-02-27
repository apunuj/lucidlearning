'use strict;'

angular.module('clientApp')

.controller('AddModulesToSectionCtrl', ['$scope', 'ngDialog', 'miniCourseFactory', 'sectionFactory', function($scope, ngDialog, miniCourseFactory, sectionFactory) {
    
    //function-list
    $scope.selectModule = selectModule;

    function updateSection(cb) {
        sectionFactory.update({id:$scope.miniCourse.sections[$scope.sindex]._id}, {modules: $scope.selectedModuleArray})
        .$promise.then(function(response){
            cb();
        }, function(response) {
            console.log(response.status);
        });
    };

    //fetching data from factory
    $scope.miniCourse = miniCourseFactory.get({id:$scope.ngDialogData.miniCourseId})
    .$promise.then(function(response) {
        $scope.miniCourse = response;
        $scope.sindex = $scope.ngDialogData.sectionIndex;
        $scope.availableModules = [];
        $scope.unavailableModules = [];
        $scope.availableModuleObjects = [];
        $scope.selectedModuleArray = [];

        for (var index = 0; index < $scope.miniCourse.sections[$scope.sindex].modules.length; index++) {
            $scope.selectedModuleArray.push($scope.miniCourse.section[$scope.sindex].modules[index]);
        }

        //finding the list of available modules for this section
        for (var index = 0; index < $scope.miniCourse.modules.length; index++) {
            for (var sindex = 0; sindex < $scope.miniCOurse.sections.length; sindex++) {
                if (sindex !== $scope.sindex) {
                    if ($scope.miniCourse.sections[sindex].modules.indexOf($scope.miniCourse.modules[index]._id) > -1) {
                        $scope.unavailableModules.push($scope.miniCourse.modules[index]._id);
                    }
                }
            }
        }

        //finding the list of available modules
        for (var index = 0; index < $scope.miniCourse.modules.length; index++) {
            if ($scope.unavailableModules.indexOf($scope.miniCourse.modules[index]._id) > -1) {
                $scope.availableModules.push($scope.miniCourse.modules[index]._id);
            }
        }

        //building the array of the available module objects
        for (var index = 0; index < $scope.availableModules.length; index++) {
            for (var mindex = 0; mindex < $scope.miniCourse.modules.length; index++) {
                if ($scope.availableModules[index] === $scope.miniCourse.modules[mindex]._id) {
                    $scope.availableModuleObjects.push({_id: $scope.miniCourse.modules[mindex]._id,name: $scope.miniCourse.modules[mindex].name, isSelected: false});
                }
            }
        }
        
    });

    function selectModule(mindex) {
        if ($scope.availableModuleObjects[mindex].isSelected){
            $scope.selectedModuleArray.push($scope.availableModuleObjects[mindex]._id);
            updateSection(function(){
                $scope.miniCourse.sections[$scope.sindex].modules.push($scope.avalaibleModuleObjects[mindex]._id);
            });
            
        } else {
            var mcindex = $scope.selectedModuleArray.indexOf($scope.availableModuleObjects[mindex]._id);
            $scope.selectedModuleArray.splice(mcindex,1);
            updateSection(function(){
                $scope.miniCourse.sections[$scope.sindex].modules.splice(mcindex,1);
            });
            
        }  
    };

    
}]);