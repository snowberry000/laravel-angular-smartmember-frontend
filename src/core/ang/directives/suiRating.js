app.directive( 'suiRating', function($timeout)
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var options = {
				interactive : false
			};

			$(next_item).rating( options );
		}
	};
} );