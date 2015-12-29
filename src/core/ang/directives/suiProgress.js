app.directive( 'suiProgress', function()
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
			/*scope.$watch(attributes.value, function(value){

				if( attributes.value > 0 )
					$(next_item).progress('increment', value);//( value );
			});*/
		},
		controller : function($scope , $rootScope){
			$rootScope.$watch('site.wizard_step', function(value){

				if( $rootScope.site.wizard_step > 0 )
					$($scope.next_item).progress({value : value});//( value );
			});
		}
	};
});