 var temp = {
                        name: movingTopic.name,
                        learningPoints: [],
                        _id: movingTopic._id
                    };
                    for(var index = 0; index < $scope.module.topics[tindex].learningPoints.length; index++) {
                        temp.learningPoints.push({});
                        temp.learningPoints[index].name = $scope.module.topics[tindex].learningPoints[index].name;
                        temp.learningPoints[index].content = $scope.module.topics[tindex].learningPoints[index].content;
                    }
                    $scope.module.topics[tindex].name = $scope.module.topics[tindex-1].name;
                    $scope.module.topics[tindex]._id = previousTopic._id;
                    $scope.module.topics[tindex].learningPoints = [];
                    for(var index = 0; index < $scope.module.topics[tindex-1].learningPoints.length; index++) {
                        $scope.module.topics[tindex].learningPoints.push({});
                        $scope.module.topics[tindex].learningPoints[index].name = $scope.module.topics[tindex-1].learningPoints[index].name;
                        $scope.module.topics[tindex].learningPoints[index].content = $scope.module.topics[tindex-1].learningPoints[index].content;
                    }
                    $scope.module.topics[tindex-1].name = temp.name;
                    $scope.module.topics[tindex-1]._id = temp._id;
                    $scope.module.topics[tindex-1].learningPoints = [];
                    for(var index = 0; index < temp.learningPoints.length; index++) {
                        $scope.module.topics[tindex-1].learningPoints.push({});
                        $scope.module.topics[tindex-1].learningPoints[index].name = temp.learningPoints[index].name;
                        $scope.module.topics[tindex-1].learningPoints[index].content = temp.learningPoints[index].content;
                    }  