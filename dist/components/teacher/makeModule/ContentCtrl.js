'use strict';

angular.module('clientApp')

.controller('ContentCtrl', ['$scope', '$state', '$stateParams', 'moduleFactory', 'learningPointFactory', 'brainStormingSessionFactory', '$q', 'AuthFactory', function($scope, $state, $stateParams, moduleFactory, learningPointFactory, brainStormingSessionFactory, $q, AuthFactory) {
    
    $scope.user = AuthFactory.getUserDetails();
    
    $scope.module = moduleFactory.get({id: $stateParams.id})
    .$promise.then(function(response){
        $scope.module = response;

        $scope.learningPointUpdateFlag = [];
        for (var tindex = 0; tindex < $scope.module.topics.length; tindex++) {
            $scope.learningPointUpdateFlag.push([]);
            for (var lindex = 0; lindex <$scope.module.topics[tindex].learningPoints.length; lindex++) {
                $scope.learningPointUpdateFlag[tindex].push(false);
                $scope.$watch('$scope.module.topics[tindex].learningPoints[lindex]', function(newValue, oldValue){
                    for (var tindex = 0; tindex < $scope.module.topics.length; tindex++) {
                        var lindex = $scope.module.topics[tindex].learningPoints.indexOf(newValue);
                        if (lindex > -1) {
                            $scope.learningPointUpdateFlag[tindex][lindex] = true;
                        }
                    }
                    
                });
            }
        }

        //initializing the brainstorming session
        $scope.brainStormingSession = brainStormingSessionFactory.query({moduleId:response._id})
        .$promise.then(function(response){
            $scope.brainStormingSession = response[0];
            $scope.brainStormingSession.newPointObject = {
                name: '',
                completed: false
            };
            $scope.openPoints = [];
            $scope.closedPoints = [];
            for (var index = 0; index < $scope.brainStormingSession.points.length; index++) {
                $scope.brainStormingSession.points[index].bindex = index;
                if ($scope.brainStormingSession.points[index].completed === true) {
                    $scope.closedPoints.push($scope.brainStormingSession.points[index]);
                } else {
                    $scope.openPoints.push($scope.brainStormingSession.points[index]);
                }
            }
            
        }, function(response){
            console.log(response.status);
        });
    },
    function(response){
        console.log(response.status);
    });


    //function for updating symbols used in the editors
    var symbolize = function(str) {
        function convert(match) {
            return '&'+match.slice(-1);
        }
        return str.replace(/&amp;\S/g, convert);
    };

    //function that returns the promise of updating the content of a learning point
    $scope.saveOne = function(tindex, lindex) {
        $scope.module.topics[tindex].learningPoints[lindex].content = symbolize($scope.module.topics[tindex].learningPoints[lindex].content);
        return learningPointFactory.update({
            id: $stateParams.id,
            tid: $scope.module.topics[tindex]._id,
            lid: $scope.module.topics[tindex].learningPoints[lindex]._id
        }, $scope.module.topics[tindex].learningPoints[lindex]).$promise;
    };

    
    //for updating the content of individual learning points and refreshing the symbols
    $scope.updateContent = function(tindex, lindex) {
        
        //$scope.module.topics[tindex].learningPoints[lindex].content = $scope.module.topics[tindex].learningPoints[lindex].content + html;
        console.log($scope.saveOne(tindex, lindex))
        $scope.saveOne(tindex, lindex)
        .then(function(response){
            console.log(response);
            $scope.learningPointUpdateFlag[tindex][lindex] = false;
        },
        function(response){
            console.log(response);
        });

    };
    
    //for updating all the content together
    $scope.saveAll = function() {
         var defer = $q.defer();
         var promises = [];
         for (var tindex = 0; tindex < $scope.module.topics.length; tindex++) {
             for (var lindex = 0; lindex < $scope.module.topics[tindex].learningPoints.length; lindex++) {
                 promises.push($scope.saveOne(tindex, lindex));
             }
         }
         $q.all(promises).then(function(){
             defer.resolve();
         });

         return defer.promise;
    };

    $scope.saveAndClose = function() {
        //Question: Is this legal?
        $scope.saveAll()
        .then(function(){
            $state.go('teacher-dashboard');
        });
          
    };

    //BrainStormingSession Functions
    $scope.openClosedPoint = function(index) {
        var bindex = $scope.closedPoints[index].bindex;
        $scope.closedPoints.splice(index, 1);
        $scope.openPoints.push($scope.brainStormingSession.points[bindex]);
        updateBrainStormingSession();
    };

    $scope.closeOpenPoint = function(index) {
        var bindex = $scope.openPoints[index].bindex;
        $scope.openPoints.splice(index, 1);
        $scope.closedPoints.push($scope.brainStormingSession.points[bindex]);
        updateBrainStormingSession();
    };

    $scope.addBrainStormingPoint = function(){
        
        $scope.brainStormingSession.points.push({name: $scope.brainStormingSession.newPointObject.name, completed:$scope.brainStormingSession.newPointObject.completed, bindex: $scope.brainStormingSession.points.length});
        $scope.openPoints.push({name: $scope.brainStormingSession.newPointObject.name, completed:$scope.brainStormingSession.newPointObject.completed, bindex: $scope.brainStormingSession.points.length});
        $scope.brainStormingSession.newPointObject = {
            name: '',
            completed: false
        };
        updateBrainStormingSession();
    };

    $scope.removePoint = function(index) {
        console.log("entering function")
        var bindex = $scope.closedPoints[index].bindex;
        $scope.closedPoints.splice(index, 1);
        $scope.brainStormingSession.points.splice(bindex,1);
        updateBrainStormingSession();
    };

    $scope.approveModule = function() {
        $scope.saveAll()
        .then(function(response){
            moduleFactory.update({id:$stateParams.id}, {reviewRequested: true, approved: true})
            .$promise.then(function(response) {
                $state.go('moderatorActions',{id:$scope.user._id}); 

            }, function(response) {
                console.log(response.status);
            });
        })
    };

    $scope.rejectModule = function() {
        $scope.saveAll()
        .then(function(response){
             moduleFactory.update({id:$stateParams.id}, {reviewRequested: false, approved: false})
            .$promise.then(function(response) {
                $state.go('moderatorActions',{id:$scope.user._id});

            }, function(response) {
                console.log(response.status);
            })
        }); 
    };

    $scope.editStructure = function() {
        $scope.saveAll()
        .then(function(response) {
            $state.go('createModule', {id:$scope.module._id});
        });
    };

    $scope.preview = function() {
        $scope.saveAll()
        .then(function(response) {
            $state.go('viewModule', {id:$scope.module._id});
        });
    };

    $scope.requestReview = function() {
        $scope.saveAll()
        .then(function(response) {
            moduleFactory.update({id:module._id}, {reviewRequested: true, approved: false})
            .$promise.then(function(response){
                console.log('Review Requested'+response);
            }, function(response) {
                console.log(response.status);
            })
        })
    }

    var updateBrainStormingSession = function(){
       var pointsArray = [];
       for (var index = 0; index < $scope.brainStormingSession.points.length; index++) {
           pointsArray.push({name: $scope.brainStormingSession.points[index].name, completed: $scope.brainStormingSession.points[index].completed});
       }
       brainStormingSessionFactory.update({id:$scope.brainStormingSession._id}, {points: pointsArray})
       .$promise.then(function(response){
           console.log('update completed');
       }, function(response){
           console.log(response.status);
       })
    };


    
}]);