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
					if (attributes.truevalue != undefined)
						ngModel.$setViewValue(attributes.truevalue);
					else
						ngModel.$setViewValue( true );
				},
				onUnchecked: function()
				{
					if (attributes.falsevalue != undefined)
						ngModel.$setViewValue(attributes.falsevalue);
					else
						ngModel.$setViewValue( false );
				},
			};

			$( next_item ).checkbox( options );

			ngModel.$render = function()
			{
				if( typeof ngModel.$viewValue !== "undefined" && attributes.truevalue != undefined )
				{
					if (ngModel.$viewValue == attributes.truevalue)
					{
						$( next_item ).checkbox( 'check' );
					} else {
						$( next_item ).checkbox( 'uncheck' );
					}
				} else if (typeof ngModel.$viewValue !== "undefined")
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