app.directive('sideNavigation', function ($timeout) {
    return {
        restrict: 'A',
        link: function(scope, element) {
            // Call the metsiMenu plugin and plug it to sidebar navigation
            $timeout(function(){
                element.metisMenu();
            });

            // Enable initial fixed sidebar
            var sidebar = element.parent();
            sidebar.slimScroll({
                height: '100%',
                size: 0
            });
        }
    };
} );