'use strict';

angular.module('clientApp')

.controller('TeacherDashboardCtrl', ['$scope','$state','moduleFactory','brainStormingSessionFactory','miniCourseFactory','AuthFactory',function($scope, $state, moduleFactory, brainStormingSessionFactory, miniCourseFactory, AuthFactory){

    $scope.user = AuthFactory.getUserDetails();

    if ($scope.user.moderator) {
        var filter = {};
    } else {
        var filter = {
            createdBy: $scope.user._id
        }
    }

    $scope.miniCourses = miniCourseFactory.query(filter)
    .$promise.then(function(response){
        $scope.miniCourses = response;
    }, function(response){
        console.log(response.status);
    });

    $scope.initializeModule = function(){
        moduleFactory.save({name: '', topics: [], createdBy: $scope.user._id})
        .$promise.then(function(module){
            initializeBrainStormingSession(module._id);
        }, function(error){
            console.log(error.status);
        });
    };

    var initializeBrainStormingSession = function(mid){
        brainStormingSessionFactory.save({moduleId: mid, Points:[]})
        .$promise.then(function(brainStormingSession){
            $state.go('createModule',{id: mid});
        }, function(response){
            console.log(response.status);
        });
    };

    $scope.initializeMiniCourse = function(){
        miniCourseFactory.save({name: '', modules: [], createdBy: $scope.user._id})
        .$promise.then(function(miniCourse){
            console.log(miniCourse);
            $state.go('makeCourse', {id:miniCourse._id});
        }, function(error){
            console.log(error.status);
        });
    };
    


}]);