app.directive( 'suiDropdown', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$(next_item).dropdown()
		}
	};
} );