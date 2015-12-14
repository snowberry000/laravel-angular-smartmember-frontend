app.directive( 'smForm', function()
{
	return {
		restrict: 'A',
		require: 'form',
		link: function( scope, formElement, attributes )
		{
			$( formElement ).form( {
				fields: {
					name: 'empty',
					email: 'email',
					gender: 'empty',
					username: 'empty',
					password: [ 'minLength[6]', 'empty' ],
					skills: [ 'minCount[2]', 'empty' ],
					terms: 'checked'
				},
				inline: true
			} );

			formElement.on("submit", function(event) {
				if( !$( formElement ).form('is valid') ) {
					event.stopImmediatePropagation();
					event.preventDefault();

					// do whatever you need to scroll here
				}
			});
		}
	};
} );