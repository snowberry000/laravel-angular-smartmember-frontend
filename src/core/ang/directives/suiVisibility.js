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

				$timeout( function()
				{
					//$( next_item ).find( 'img' ).visibility('refresh');

				}, 1000 );

				//console.log( "doing visibility with", $( next_item ).find( 'img' ), the_options );
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
					/*onBottomVisible: function()
					{
						$timeout( function()
						{
							scope.$apply( attributes.dataTrigger );
							scope.$apply( attributes.trigger );
							//console.log( "triggered?" );

						}, 100 );

						//console.log( 'attributes', attributes );
						//attributes.dataTrigger;

						//console.log( "Loadin it" );
					},
					onPassing  : function(calculations) {

						$timeout( function()
						{
							scope.$apply( attributes.dataTrigger );
							scope.$apply( attributes.trigger );
							//console.log( "triggered?" );

						}, 100 );
					},
					onPassed: {
					  80: function() {
					    
					  }
					}*/
				};
				$timeout( function()
				{
					scope.$apply( attributes.trigger );

				}, 100 );

				$('body *').on('scroll' , function(e){
					var top = $(this).scrollTop(),
					    document_height = $(document).height(),
					    window_height = $(window).height();

					var scrollPercent = (top / (document_height - window_height)) * 100;
					if(scrollPercent > 80){
						$timeout( function()
						{
							scope.$apply( attributes.trigger );

						}, 100 );
					}
				}) 
				$( next_item ).visibility( the_options );
			}

		}
	};
} );