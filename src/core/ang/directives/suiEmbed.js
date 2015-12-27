app.directive( 'suiEmbed', function( smModal )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var the_options = {};

			$( next_item ).embed( the_options );
		}
	};
} );