app.directive( 'suiTabs', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			console.log( $(next_item), $(next_item).find('.item' ) );

			$(next_item).find('.item' ).tab();
		}
	};
} );