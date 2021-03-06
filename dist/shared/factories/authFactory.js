'use strict';

angular.module('clientApp')

.factory('AuthFactory', ['$resource', '$http', '$localStorage', '$rootScope', '$window', 'baseUrl', 'ngDialog', function($resource, $http, $localStorage, $rootScope, $window, baseUrl, ngDialog){
    
    var authFac = {};
    var TOKEN_KEY = 'Token';
    var isAuthenticated = false;
    var email = '';
    var authToken = undefined;
    var userId = '';
    var friends = [];
    var userName = '';
    var learner = false;
    var teacher = false;
    var moderator = false;
    var admin =false;

  function loadUserCredentials() {
    var credentials = $localStorage.getObject(TOKEN_KEY,'{}');
    if (credentials.email != undefined) {
      useCredentials(credentials);
    }
  }
 
  function storeUserCredentials(credentials) {
    $localStorage.storeObject(TOKEN_KEY, credentials);
    useCredentials(credentials);
  }
 
  function useCredentials(credentials) {
    isAuthenticated = true;
    email = credentials.email;
    authToken = credentials.token;
    userId = credentials._id;
    friends = credentials.friends;
    userName = credentials.userName;
    learner = credentials.learner;
    teacher = credentials.teacher;
    moderator = credentials.moderator;
    admin = credentials.admin;
 
    // Set the token as header for your requests!
    $http.defaults.headers.common['x-access-token'] = authToken;
  }
 
  function destroyUserCredentials() {
    authToken = undefined;
    email = '';
    userId = '';
    friends = '';
    userName = '';
    learner = false;
    teacher = false;
    moderator = false;
    admin = false;

    isAuthenticated = false;
    $http.defaults.headers.common['x-access-token'] = authToken;
    $localStorage.remove(TOKEN_KEY);
  }
     
    authFac.login = function(loginData) {
        
        $resource(baseUrl + "users/login")
        .save(loginData,
           function(response) {
             response.user.token = response.token;
              storeUserCredentials(response.user);
              $rootScope.$broadcast('login:Successful');
           },
           function(response){
              isAuthenticated = false;
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Login Unsuccessful</h3></div>' +
                  '<div><p>' +  response.data.err.message + '</p><p>' +
                    response.data.err.name + '</p></div>' +
                '<div class="ngdialog-buttons">\
                    <button type="button" class="ngdialog-button ngdialog-button-primary" ng-click=confirm("OK")>OK</button>\
                </div>'
            
                ngDialog.openConfirm({ template: message, plain: 'true'});
           }
        
        );

    };
    
    authFac.logout = function() {
        $resource(baseUrl + "users/logout").get(function(response){
        });
        destroyUserCredentials();
    };
    
    authFac.register = function(registerData) {
        
        $resource(baseUrl + "users/signup")
        .save(registerData,
           function(response) {
              authFac.login({email:registerData.email, password:registerData.password});
            if (registerData.rememberMe) {
                $localStorage.storeObject('userinfo',
                    {email:registerData.email, password:registerData.password});
            }
           
              $rootScope.$broadcast('registration:Successful');
           },
           function(response){
            
              var message = '\
                <div class="ngdialog-message">\
                <div><h3>Registration Unsuccessful</h3></div>' +
                  '<div><p>' +  response.status.message + 
                  '</p><p>' + response.status.name + '</p></div>';

                ngDialog.openConfirm({ template: message, plain: 'true'});

           }
        
        );
    };
    
    authFac.isAuthenticated = function() {
        return isAuthenticated;
    };
    
    authFac.getEmail = function() {
        return email;  
    };

    authFac.getUserDetails = function() {
        var userDetails = {
                    _id: userId,
                    email: email,
                    friends: friends,
                    userName: userName,
                    learner: learner,
                    teacher: teacher,
                    moderator: moderator,
                    admin: admin
        };

        return userDetails;
    };

    loadUserCredentials();
    
    return authFac;
    
}]);