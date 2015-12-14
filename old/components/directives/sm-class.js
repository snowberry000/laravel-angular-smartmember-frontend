app.directive('smClass', function () {
    name = 'smClass';
    return {
        restrict: 'AC',
        transclude: false,
        link: function(scope, element, attr){
            var oldVal;

            scope.$watch(attr[name], ngClassWatchAction, true);

            attr.$observe('class', function(value) {
                ngClassWatchAction(scope.$eval(attr[name]));
            });

            function ngClassWatchAction(newVal) {
                if( oldVal ) {
                    angular.forEach(oldVal.split(' '), function (value) {
                        $(element).removeClass(value);
                    });
                }

                $(element).attr('class', newVal);

                oldVal = newVal;
            }
    } };
});