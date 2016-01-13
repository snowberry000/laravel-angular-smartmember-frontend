app.directive( 'suiDropdown', function( $timeout )
{
	return {
		restrict: 'A',
		require: '?ngModel',
		scope: {
			ngModel: '='
		},
		link: function( scope, next_item, attributes, ngModel )
		{
			var options = {
				onChange: function( value, text, $choice ) {

					if( ngModel )
					{
						ngModel.$setViewValue( value );
					}
				}
			};

			$( next_item ).dropdown( options );

			$( next_item ).on( 'keydown', function( event )
			{
				if( event.which == 13 )
				{
					var href = $( '.item.selected:first a' ).attr( 'href' );
					if( href )
					{
						window.location.href = href;
					}
				}
			} )
		}
	};
} );