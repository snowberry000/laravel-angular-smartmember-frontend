app.directive( 'suiCheckbox', [ '$http', '$localStorage', function( $http, $localStorage )
{
	return {
		restrict: 'A',
		require: '?ngModel',
		link: function( scope, next_item, attributes, ngModel )
		{
			var options = {
				onChecked: function()
				{
					ngModel.$setViewValue( true );
				},
				onUnchecked: function()
				{
					ngModel.$setViewValue( false );
				},
			};

			$( next_item ).checkbox( options );

			ngModel.$render = function()
			{
				if( typeof ngModel.$viewValue !== "undefined" )
				{
					if( ngModel.$viewValue )
					{
						$( next_item ).checkbox( 'check' );
					}
					else
					{
						$( next_item ).checkbox( 'uncheck' );
					}
				}
			};
		}
	};
} ] );