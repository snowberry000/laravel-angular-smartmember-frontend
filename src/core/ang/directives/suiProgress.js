app.directive( 'suiProgress', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$(next_item).progress({
				success : 'Setup Complete!'
			});
		}
	};
} );