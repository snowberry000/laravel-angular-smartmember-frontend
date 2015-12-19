app.directive( 'suiProgress', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$(next_item).progress({
				label: 'ratio',
				text: {
					ratio: '{value} of {total} steps'
				},
				success : 'Setup Complete!'
			});
		}
	};
} );