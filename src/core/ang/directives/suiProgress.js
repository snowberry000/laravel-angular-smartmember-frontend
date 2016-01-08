app.directive( 'suiProgress', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var the_options = {
				text: {
					success : 'setup completed!'
				},
				value: attributes.value || 0
			};

			if( attributes.text )
				the_options[ 'text' ] = attributes.text;

			$(next_item).progress( the_options );
			scope.next_item = next_item;
			/*scope.$watch(attributes.value, function(value){

				if( attributes.value > 0 )
					$(next_item).progress('increment', value);//( value );
			});*/
		},
		controller : function($scope , $rootScope){
			$rootScope.$watch('site.wizard_step', function(value){
                console.log('we got some wizard values: ', value );
                if( value && $rootScope.site && $rootScope.site.wizard_step ) {
                    if ($rootScope.site.wizard_step > 0)
                        $($scope.next_item).progress({value: value});//( value );
                } else {
                    $($scope.next_item).progress({value: 0});//( value );
                }
			});
		}
	};
});