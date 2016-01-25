app.directive( 'suiPopup', function( smModal , $state)
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
				target: attributes.target || false,
				popup: attributes.popup || false,
				exclusive: true,
				preserve: false,
				duration: attributes.edit ? 100 : (attributes.duration || 0),
				delay: {
					show: 100,
					hide: attributes.edit ? 500 : (attributes.delayHide || 0)
				},
				transition: attributes.transition || 'slide down',
				on: attributes.on || 'hover',
				lastResort: 'bottom center',
				inline: attributes.inline || false,
				movePopup: (attributes.movePopup == "false") ? false : true,
				onVisible: function()
				{
					$( ".edit-admin" ).on( 'click', function( event )
					{
						event.preventDefault();

						if( attributes.stateattributes )
						{
							//console.log( "attributes.stateattributes", attributes.stateattributes );
							$state.go( attributes.state, JSON.parse(attributes.stateattributes) );
						}
						else
						{
							$state.go( attributes.state );
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
			window.setTimeout(function() {
				$(next_item).popup(the_options);
				}, 3000);

		}
	};
} );