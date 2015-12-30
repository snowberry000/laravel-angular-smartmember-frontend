app.directive( 'suiCheckbox', [ '$http', '$localStorage', function( $http, $localStorage )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var options = {

			};

			$( next_item ).checkbox( options );
		}
	};
} ] );