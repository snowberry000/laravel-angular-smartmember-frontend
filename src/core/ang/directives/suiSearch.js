app.directive( 'suiSearch', [ '$http', '$localStorage', function( $http, $localStorage )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var options = {
				type: 'category',
				apiSettings: {
					url: scope.app.apiUrl + '/lesson?q={query}',
					beforeXHR: function( xhr )
					{
						// adjust XHR with additional headers
						xhr.setRequestHeader( 'Authorization', 'Basic ' + $localStorage.user.access_token );
						return xhr;
					},
					onResponse: function( the_data )
					{

						console.log( 'the_data', the_data );
						var response = {
							results: {}
						};
						// translate GitHub API response to work with search
						$.each( the_data.items, function( index, item )
						{
							var maxResults = 8;
							if( index >= maxResults )
							{
								return false;
							}
							// create new language category
							if( response.results['lessons'] === undefined )
							{
								response.results['lessons'] = {
									name: 'Lessons',
									results: []
								};
							}
							// add result to category
							response.results['lessons'].results.push( {
								title: item.title,
								description: 'just a description',//item.content,
								url: '/' + item.permalink
							} );
						} );
						return response;
					},
				}
			};

			$( next_item ).search( options );
		}
	};
} ] );