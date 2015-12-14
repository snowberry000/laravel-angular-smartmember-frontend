app.directive('ngRepeatFinish', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                element.ready(function () {
                    $timeout(function () {
                        if( attr.ngRepeatFinish !== undefined && typeof attr.ngRepeatFinish == 'function' )
                            scope[attr.ngRepeatFinish.replace('()', '')]();
                    });
                });
            }
        }
    }
});