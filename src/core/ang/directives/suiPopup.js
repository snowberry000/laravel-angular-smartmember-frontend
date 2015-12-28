app.directive( 'suiPopup', function( smModal )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var the_options = {
				hoverable: (attributes.edit==true || attributes.edit=='true') ? true : (attributes.hoverable || false),
				position: attributes.position || 'right center',
				//popup: '.special.popup',
				html: (attributes.edit==true || attributes.edit=='true') ? '<button class="ui tiny red button edit-admin" data-state="' + attributes.state +
				'"  data-attributes="' + attributes.stateattributes +
				'">edit</button>' : '',
				target: attributes.target || '',
				exclusive: true,
				preserve: true,
				duration: attributes.edit ? 100 : 0,
				delay: {
					show: 100,
					hide: attributes.edit ? 500 : 0
				},
				onVisible: function()
				{
					$( ".edit-admin" ).on( 'click', function( event )
					{
						event.preventDefault();

						console.log( $( this ).data( 'attributes' ) );

						if( $( this ).data( 'attributes' ) )
						{
							smModal.Show( $( this ).data( 'state' ), $( this ).data( 'attributes' ) );
						}
						else
						{
							smModal.Show( $( this ).data( 'state' ) );
						}


						$( this ).off( event );
					} );
				},
				onHide: function()
				{
					$( ".edit-admin" ).unbind( 'click' );
					return true;
				}
			};
			$( next_item ).popup( the_options );
		}
	};
} );