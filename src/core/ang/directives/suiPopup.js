app.directive( 'suiPopup', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var the_options = {
				hoverable: true,
				position : attributes.position || 'top center',
				target : attributes.target || '',
				exclusive: true,
				preserve: true,
				delay: {
					show: 100,
					hide: 100
				}
			};

			console.log( the_options );

			$(next_item).popup(the_options);
		}
	};
} );