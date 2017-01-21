'use strict';

angular.module('clientApp', [
    'ngDialog',
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
        templateUrl: 'components/dashboard/existingModules.html',
        controller: 'ExistingModulesCtrl'
    })

    .state('newModule', {
        url: '/newModule',
        templateUrl: 'components/brainstorm/views/moduleName.html',
        controller: 'ModuleNameCtrl'
    })

    .state('topics', {
        url: '/topics',
        templateUrl: 'components/brainstorm/views/topicsList.html',
        controller: 'TopicsCtrl'
    })

    .state('learningPoints', {
        url: '/learningPoints',
        templateUrl: 'components/brainstorm/views/learningPointsList.html',
        controller: 'learningPointCtrl'
    })

    .state('createModule', {
        url: '/createModule/:id',
        templateUrl: 'components/organize/createModule.html',
        controller: 'CreateCtrl'
    })

    .state('content', {
        url: '/content/:id',
        templateUrl: 'components/create/views/contentEdit.html',
        controller: 'ContentCtrl'
    })

    .state('learning', {
        url: '/mini-courses',
        templateUrl: 'components/learner/learnerMenu.html'
    })

    .state('view', {
        url: '/view/:id',
        templateUrl: 'components/preview/contentView.html',
        controller: 'ViewCtrl'
    });

    $urlRouterProvider.otherwise('/');

});

