app.directive( 'suiTabs', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			console.log( $(next_item), $(next_item).find('.item' ) );

			var options = {
				context : attributes.context || ''
			};

			console.log( options );

			$(next_item).find('.item' ).tab( options );
		}
	};
} );