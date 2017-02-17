'use strict';

angular.module('clientApp')

.controller('LucidViewCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'miniCourseFactory', '$ocLazyLoad', function($scope, $state, $stateParams, moduleFactory, miniCourseFactory, $ocLazyLoad) {
    $scope.module = moduleFactory.get({id: $stateParams.id})
    .$promise.then(function(response){
        $scope.module = response;
    },
    function(response){
        console.log(response.status);
    });

   angular.element(document).ready(function(){
       $ocLazyLoad.load(['assets/styles/flowtime.css','assets/styles/default.css','shared/otherScripts/brav1toolbox.js','shared/otherScripts/flowtime.js'])
       .then(function(){
            Flowtime.start();
            Flowtime.updateNavigation(true);
            Flowtime.showProgress(true);
       })
       

   })

}]);