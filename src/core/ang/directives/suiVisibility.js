app.directive( 'suiVisibility', function( $timeout )
{
	return {
		restrict: 'A',
		scope: true,
		link: function( scope, next_item, attributes )
		{
			if( attributes.type == 'image' )
			{
				// image delayed load
				var the_options = {
					type: 'image',
					transition: 'fade in',
					duration: 1000
				};

				$( next_item ).find( 'img' ).visibility( the_options );
				console.log( "doing visibility with", $( next_item ).find( 'img' ), the_options );
			}
			else
			{
				// Lazyloading
				var the_options = {
					once: false,
					// update size when new content loads
					observeChanges: true,
					// load content on bottom edge visible
					continuous: true,
					onBottomVisible: function()
					{
						$timeout( function()
						{
							scope.$apply( attributes.dataTrigger );
							scope.$apply( attributes.trigger );
							console.log( "triggered?" );

						}, 100 );

						console.log( 'attributes', attributes );
						//attributes.dataTrigger;

						console.log( "Loadin it" );
					},
					onPassing  : function(calculations) {

						$timeout( function()
						{
							scope.$apply( attributes.dataTrigger );
							scope.$apply( attributes.trigger );
							console.log( "triggered?" );

						}, 100 );
					}
				};

				$( next_item ).visibility( the_options );
			}

		}
	};
} );