'use strict';

angular.module('clientApp')

.controller('ViewCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'miniCourseFactory', function($scope, $state, $stateParams, moduleFactory, miniCourseFactory) {
    $scope.module = moduleFactory.get({id: $stateParams.id})
    .$promise.then(function(response){
        $scope.module = response;
    },
    function(response){
        console.log(response.status);
    });

   angular.element(document).ready(function(){
       
       loadScript('shared/otherScripts/brav1toolbox.js', function(){
           console.log('script1 loaded')
       });
       
       loadScript('shared/otherScripts/flowtime.js', function(){
           console.log(document.body.innerHTML)
       });

       function loadScript(src, callback){
        var s;
        s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = src;
        s.onload = s.onreadystatechange = function() {
            //console.log( this.readyState ); //uncomment this line to see which ready states are called.
            if (!this.readyState || this.readyState == 'complete') 
            {
            callback();
            }
        };
        document.body.appendChild(s);
        };


   })

}]);