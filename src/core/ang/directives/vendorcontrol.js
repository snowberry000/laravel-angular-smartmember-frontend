

app.directive('vendorcontrol', function ($state) {
	return {
		restrict: 'A',
        replace: true,
		link:  function($scope, element) {
            $scope.$watch($state, function(test){
                console.log('current state', test, $state.current.name );
            });
		}
	}
} );