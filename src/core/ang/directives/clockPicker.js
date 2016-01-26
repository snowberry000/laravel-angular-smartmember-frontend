app.directive('clockPicker', function () {
    return {
        restrict: 'A',
        link: function(scope, element) {
            element.clockpicker();
        }
    };
});

angular.module('ui.bootstrap.tabs', [])

.controller('TabsetController', ['$scope', function TabsetCtrl($scope) {

}])

