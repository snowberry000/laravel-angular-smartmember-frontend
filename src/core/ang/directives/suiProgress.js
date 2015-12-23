app.directive( 'suiProgress', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$(next_item).progress({
				success : 'Wizard completed!'
			});

			scope.$watch(attributes.value, function(value){
				$(next_item).progress('increment', value);//( value );
			});
		}
	};
});