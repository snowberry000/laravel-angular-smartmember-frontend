app.directive( 'suiAccountProgress', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$(next_item).progress({
				text: {
					success : 'setup completed!'
				}
			});

			scope.next_item = next_item;
		},
		controller : function($scope , $rootScope){
			$rootScope.$watch('user.setup_wizard_complete', function(value){
                if( value ) {
                    $($scope.next_item).progress({value: 1});
                } else {
                    $($scope.next_item).progress({value: 0});
                }
			});
		}
	};
});