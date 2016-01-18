app.directive( 'suiEmbed', function( smModal )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			//console.log( "next_item", next_item, attributes );

			var the_templates = {
				iframe: function( url, parameters )
				{
					// returns html for iframe
					return '<div class="ui embed">' + attributes.originalEmbed + '</div>';
					//console.log( 'templates iframe', url, parameters );
				},
				placeholder: function( image, icon )
				{
					//console.log( 'placeholder', image );
					// returns html for placeholder element
					if(image && image !="{{next_item.featured_image}}")
						return '<i class="video play icon"></i> <img class="placeholder" src="' + image + '">';
					else
						return '<i class="video play icon"></i>';
				}
			};

			$(next_item).addClass('non_handled_embed');

			var the_options = {
				url: attributes.url,
				placeholder: attributes.placeholder,
				onCreate: function( params )
				{
					//console.log( "onCreate", params );
				},
				onDisplay: function( params )
				{
					//console.log( "onDisplay", params );
				},
				onPlaceholderDisplay: function( params )
				{
					//console.log( "onPlaceholderDisplay", params );
				},
				onEmbed: function( params )
				{
					//console.log( "onEmbed", params );
				}
			};

			if( the_templates )
				the_options[ 'templates' ] = the_templates;

			//console.log( "the attrs", attributes );

			$( next_item ).embed( the_options );
		}
	};
} );