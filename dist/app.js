'use strict';

//http://localhost:3000/
//http://ec2-35-154-158-206.ap-south-1.compute.amazonaws.com:3000/

angular.module('clientApp', [
    'ngDialog',
    'ngResource',
    'textAngular',
    'ui.router'
  ])


.constant('baseUrl', 'http://ec2-35-154-158-206.ap-south-1.compute.amazonaws.com:3000/')


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

    .state ('home', {
        url: '',
        abstract: 'true',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/home/home-layout.html'
            }
        }
    })

    .state('home.intro', {
        url: '/',
        views: {
            'learnerIntro': {
                templateUrl: 'components/home/learnerIntro/learnerIntro.html'
                
            },
            'teacherIntro': {
                templateUrl: 'components/home/teacherIntro/teacherIntro.html'
                
            }
        }

    })

    .state('teacher-dashboard', {
        url: '/teacher-dashboard',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/teacher/dashboard/teacherDashboard.html',
                controller: 'TeacherDashboardCtrl'
            }
        }
    })

    .state('createModule', {
        url: '/createModule/:id',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/teacher/makeModule/createModule.html',
                controller: 'CreateCtrl'  
            }
        }
    })

     .state('writeContent', {
        url: '/writeContent/:id',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/teacher/makeModule/contentEdit.html',
                controller: 'ContentCtrl'
            }
        }
    })

    .state('finishedModules', {
        url: '/finishedModules/:id',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/teacher/dashboard/finishedModules.html',
                controller: 'FinishedModulesCtrl'
            }
        }
    })

     .state('unfinishedModules', {
        url: '/unfinishedModules/:id',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/teacher/dashboard/unfinishedModules.html',
                controller: 'UnfinishedModulesCtrl'
            }
        }
    })

    .state('makeCourse', {
        url: '/make-course/:id',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/teacher/makeCourse/makeCourse.html',
                controller: 'MakeCourseCtrl'
            }
        }
    })

    .state('learner-dashboard', {
        url: '/learner-dashboard',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/learner/dashboard/learnerDashboard.html',
                controller: 'LearnerDashboardCtrl'
            }
        }
    })

    .state('viewModule', {
        url: '/viewModule/:id',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/contentView/contentView.html',
                controller: 'ViewCtrl'
            }
        }
    })

    .state('viewCourse', {
        url: '/viewCourse/:id',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/learner/viewCourse/viewCourse.html',
                controller: 'ViewCourseCtrl'
            }
        }
    })

    .state('moderatorActions', {
        url: '/moderatorActions/:id',
        views: {
            'navbar': {
                templateUrl: 'shared/navbar/navBarView.html',
                controller: 'NavBarCtrl'
            },
            'body': {
                templateUrl: 'components/teacher/dashboard/moderatorActions.html',
                controller: 'ModeratorActionsCtrl'
            }
        }
    })

    $urlRouterProvider.otherwise('/');

});

