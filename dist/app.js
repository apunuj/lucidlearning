'use strict';

angular.module('clientApp', [
    'ngCookies',
    'ngResource',
    'textAngular',
    'ui.router'
  ])

.config(function($provide){
    $provide.decorator('taOptions', ['$delegate', function(taOptions){
        taOptions.toolbar = [
        ['p','pre', 'quote','bold', 'italics', 'underline'], ['ul', 'ol', 'clear', 'justifyLeft', 'justifyCenter', 'justifyFull', 'justifyRight'], ['html', 'insertImage','insertLink', 'insertVideo']
        ];

        return taOptions;
    }]);

})

.config(function($stateProvider, $urlRouterProvider){
    $stateProvider

    .state('home', {
        url: '/',
        templateUrl: 'components/home/home.html',
        controller: 'HomeCtrl'
    })

    .state('existing', {
        url: '/existingModules',
        templateUrl: 'components/moduleDashboard/existingModules.html',
        controller: 'ExistingModulesCtrl'
    })

    .state('newModule', {
        url: '/newModule',
        templateUrl: 'components/newModule/moduleName.html',
        controller: 'ModuleNameCtrl'
    })

    .state('topics', {
        url: '/topics',
        templateUrl: 'components/newModule/topicsList.html',
        controller: 'TopicsCtrl'
    })

    .state('learningPoints', {
        url: '/learningPoints',
        templateUrl: 'components/newModule/learningPointsList.html',
        controller: 'learningPointCtrl'
    })

    .state('createModule', {
        url: '/createModule/:id',
        templateUrl: 'components/newModule/createModule.html',
        controller: 'CreateCtrl'
    })

    .state('content', {
        url: '/content/:id',
        templateUrl: 'components/editModule/contentEdit.html',
        controller: 'ContentCtrl'
    })

    .state('view', {
        url: '/view/:id',
        templateUrl: 'components/editModule/contentView.html',
        controller: 'ViewCtrl'
    });

    $urlRouterProvider.otherwise('/');

});

