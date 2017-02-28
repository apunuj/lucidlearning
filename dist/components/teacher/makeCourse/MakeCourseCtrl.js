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

    //2. functions for sections
    $scope.addNewSection = addNewSection;
    $scope.addSectionName = addSectionName;
    $scope.editSectionName = editSectionName;
    $scope.updateSectionName = updateSectionName;
    $scope.editSectionDescription = editSectionDescription;
    $scope.updateSectionDescription = updateSectionDescription;
    $scope.openAddModulesDialog = openAddModulesDialog;
    $scope.deleteModuleFromSection = deleteModuleFromSection;

    //3. functions for course-descriptions
    //$scope.updateCourseDescription = updateCourseDescription;


    
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

    //2. update minicoursewithsectionIds
    function updateMiniCourseWithSections(cb) {
        miniCourseFactory.update({id: $stateParams.id}, {sections: $scope.sectionIdArray})
        .$promise.then(function(response) {
            console.log("update done");
            cb();
        }, function(response) {
            console.log(response.status);
        });
    };

    //3. finding module name given id for populating module names in sections
    function findModuleNameById (mid) {
        for (var index = 0; index < $scope.miniCourse.modules.length; index++) {
            if(mid === $scope.miniCourse.modules[index]._id) {
                return $scope.miniCourse.modules[index].name;
            }
        }
    }

    //4. building section module name array
    function getSectionModuleNameArray() {
        var sectionModuleNameArray = [];
        for (var sindex = 0; sindex < $scope.miniCourse.sections.length; sindex++) {
            sectionModuleNameArray.push([]);
            for (var mindex = 0; mindex < $scope.miniCourse.sections[sindex].modules.length; mindex++) {
                for (var index = 0; index < $scope.miniCourse.modules.length; index++) {
                    if ($scope.miniCourse.sections[sindex].modules[mindex] === $scope.miniCourse.modules[index]._id) {
                        sectionModuleNameArray[sindex].push($scope.miniCourse.modules[index].name);
                    }
                }
            }
        }

        return sectionModuleNameArray;
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

        $scope.sectionIdArray = [];
        for (var index = 0; index < $scope.miniCourse.sections.length; index++) {
            $scope.sectionIdArray.push($scope.miniCourse.sections[index]._id);
        }
        $scope.toggleSectionForm = false;
        $scope.newSectionName = '';

        $scope.sectionModuleNameArray = getSectionModuleNameArray();


        for (var sindex = 0; sindex < $scope.miniCourse.sections.length; sindex++) {
            $scope.miniCourse.sections[sindex].sectionEditToggle = false;
            $scope.miniCourse.sections[sindex].descriptionEditToggle = false;
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

    function addNewSection() {
        $scope.toggleSectionForm = !$scope.toggleSectionForm;
    };

    function addSectionName() {
        console.log($scope.newSectionName);
        sectionFactory.save({name: $scope.newSectionName, modules:[], description:''})
        .$promise.then(function(savedSection) {
            $scope.sectionIdArray.push(savedSection._id);
            updateMiniCourseWithSections(function(){
                $scope.miniCourse.sections.push(savedSection);
                $scope.newSectionName = '';
            }); 
        }, function(response) {
            console.log(response.status);
        });
    };

    function editSectionName(sindex) {
        $scope.miniCourse.sections[sindex].sectionEditToggle = !$scope.miniCourse.sections[sindex].sectionEditToggle;
    };

    function updateSectionName(sindex) {
        sectionFactory.update({id: $scope.miniCourse.sections[sindex]._id}, {name: $scope.miniCourse.sections[sindex].name})
        .$promise.then(function(response) {
            editSectionName(sindex);
        }, function(response) {
            console.log(response.status);
        });
    };

    function editSectionDescription(sindex) {
        $scope.miniCourse.sections[sindex].descriptionEditToggle = !$scope.miniCourse.sections[sindex].descriptionEditToggle;
    };

    function updateSectionDescription(sindex) {
        sectionFactory.update({id: $scope.miniCourse.sections[sindex]._id}, {description: $scope.miniCourse.sections[sindex].description})
        .$promise.then(function(response) {
            editSectionDescription(sindex);
        }, function(response) {
            console.log(response.status);
        });
    };

    function openAddModulesDialog(sindex) {
        ngDialog.open({template:'components/teacher/makeCourse/addModulesToSection.html', data: {miniCourseId:$scope.miniCourse._id, sectionIndex:sindex, parentSection:$scope.miniCourse.sections[sindex]}, scope: $scope, className: 'ngdialog-theme-default', controller: 'AddModulesToSectionCtrl'});
    };

    function deleteModuleFromSection(sindex, mindex) {
        sectionFactory.update
    }

    
}]);