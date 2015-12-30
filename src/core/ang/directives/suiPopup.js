app.directive( 'suiPopup', function( smModal )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var the_options = {
				hoverable: (attributes.edit == true || attributes.edit == 'true') ? true : (attributes.hoverable || false),
				position: attributes.position || 'right center',
				//popup: '.special.popup',
				html: (attributes.edit == true || attributes.edit == 'true') ? '<button class="ui tiny red button edit-admin">edit</button>' : '',
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

						if( attributes.stateattributes )
						{
							//console.log( "attributes.stateattributes", attributes.stateattributes );
							smModal.Show( attributes.state, JSON.parse(attributes.stateattributes) );
						}
						else
						{
							smModal.Show( attributes.state );
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

			//console.log( 'the_options', the_options );
			$( next_item ).popup( the_options );
		}
	};
} );