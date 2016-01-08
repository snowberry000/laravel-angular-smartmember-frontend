app.directive( 'suiEmbed', function( smModal )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			scope.ShouldLetSUIHandleIt = function( url )
			{
				var domain;
				//find & remove protocol (http, ftp, etc.) and get domain
				if( url.indexOf( "//" ) > -1 )
				{
					domain = url.split( '/' )[ 2 ];
				}
				else
				{
					domain = url.split( '/' )[ 0 ];
				}

				//find & remove port number
				domain = domain.split( ':' )[ 0 ];

				console.log( "THE DOMAIN: ", domain, url );

				if( domain )
				{
					if( domain.indexOf('youtube.com') > -1 )
						return true;

					if( domain.indexOf('vimeo.com') > -1 )
						return true;

				}

				return false;
			};

			console.log( "next_item", next_item, attributes );

			var the_templates = {
				iframe: function( url, parameters )
				{
					// returns html for iframe
					return attributes.originalEmbed;
					console.log( 'templates iframe', url, parameters );
				},
				placeholder: function( image, icon )
				{
					// returns html for placeholder element
					return '<i class="video play icon"></i> <img class="placeholder" src="' + image + '">';
				}
			};

			if( scope.ShouldLetSUIHandleIt( attributes.url ) )
			{
				the_templates = null;
			}
			else
			{
				$(next_item).addClass('non_handled_embed');
			}

			var the_options = {
				url: attributes.url,
				placeholder: attributes.placeholder,
				onCreate: function( params )
				{
					console.log( "onCreate", params );
				},
				onDisplay: function( params )
				{
					console.log( "onDisplay", params );
				},
				onPlaceholderDisplay: function( params )
				{
					console.log( "onPlaceholderDisplay", params );
				},
				onEmbed: function( params )
				{
					console.log( "onEmbed", params );
				}
			};

			if( the_templates )
				the_options[ 'templates' ] = the_templates;

			console.log( "the attrs", attributes );

			$( next_item ).embed( the_options );
		}
	};
} );