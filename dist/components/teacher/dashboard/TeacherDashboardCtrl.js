'use strict';

angular.module('clientApp')

.controller('TeacherDashboardCtrl', ['$scope','$state','moduleFactory','brainStormingSessionFactory','miniCourseFactory','AuthFactory',function($scope, $state, moduleFactory, brainStormingSessionFactory, miniCourseFactory, AuthFactory){

    $scope.initializeModule = function(){
        moduleFactory.save({name: '', topics: []})
        .$promise.then(function(module){
            initializeBrainStormingSession(module._id);
        }, function(error){
            console.log(error.status);
        });
    };

    var initializeBrainStormingSession = function(mid){
        brainStormingSessionFactory.save({moduleId: mid, Points:[]})
        .$promise.then(function(brainStorminSession){
            $state.go('createModule',{id: mid});
        }, function(response){
            console.log(response.status);
        });
    };

    $scope.initializeMiniCourse = function(){
        miniCourseFactory.save({name: '', modules: []})
        .$promise.then(function(miniCourse){
            console.log(miniCourse);
            $state.go('makeCourse', {id:miniCourse._id});
        }, function(error){
            console.log(error.status);
        });
    };
    


}]);