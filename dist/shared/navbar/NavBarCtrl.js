'use strict';

angular.module('clientApp')

.controller('NavBarCtrl', ['$scope', '$state', '$rootScope', 'ngDialog', 'AuthFactory', function ($scope, $state, $rootScope, ngDialog, AuthFactory) {

    $scope.loggedIn = false;
    $scope.email = '';
    var user = AuthFactory.getUserDetails();

    $scope.isAdmin = user.admin;
    
    if(AuthFactory.isAuthenticated()) {
        $scope.loggedIn = true;
        $scope.email = AuthFactory.getEmail();
    }
        
    $scope.openLogin = function () {
        ngDialog.open({ template: 'shared/login/login.html', scope: $scope, className: 'ngdialog-theme-default', controller:"LoginCtrl" });
    };
    
    $scope.logOut = function() {
       AuthFactory.logout();
        $scope.loggedIn = false;
        $scope.email = '';
    };
    
    $rootScope.$on('login:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.email = AuthFactory.getEmail();
    });
        
    $rootScope.$on('registration:Successful', function () {
        $scope.loggedIn = AuthFactory.isAuthenticated();
        $scope.email = AuthFactory.getEmail();
    });
    
    $scope.stateis = function(curstate) {
       return $state.is(curstate);  
    };
    
}]);
