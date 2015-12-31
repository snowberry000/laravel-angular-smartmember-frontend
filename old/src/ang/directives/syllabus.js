app.directive('syllabus', ['$timeout', function ($timeout) {
    return {
        link: function ($scope, element, attrs) {
            $scope.$on('dataloaded', function () {
                $timeout(function () { // You might need this timeout to be sure its run after DOM render.
                    syllabus();
                }, 1, false);
            })
        }
    };
}]);