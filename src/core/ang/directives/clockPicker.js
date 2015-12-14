app.directive('clockPicker', function () {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.clockpicker();
        }
    };
});