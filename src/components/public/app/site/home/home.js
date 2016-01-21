var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.site.home",{
			url: "/",
			template: '<ui-view />',
			controller: "HomeController"
		})
}); 

app.controller( 'HomeController', function( $scope, $site,$state, $rootScope, $timeout , $location, $localStorage, Restangular, notify)
{
	var homepage_url = null;

	angular.forEach( $site.meta_data, function( value, key )
	{
        if( value.key == 'homepage_url' )
        {
            // alert(value.value);
            homepage_url = value.value;
        }
	} );

    if( !homepage_url || homepage_url == 'home' )
        homepage_url = 'lessons';

	$scope.cutString = function(s, n){
		var cut= s.indexOf(' ', n);
		if(cut== -1) return s;
		return s.substring(0, cut)
	}

	$scope.excerpt = function( string ) {
		return $scope.cutString( string.replace(/(<([^>]+)>)/ig,""), 200 );
	}

    console.log('home page');
    console.log(homepage_url);
    if( (window.location.pathname == '/' || window.location.pathname.indexOf('/sign/')>=0)&& $rootScope.subdomain != "my" )
	{
		$homeState = 'public.app.site.lessons';

		if( homepage_url )
		{
			$states = $state.get();
			$intendedState = _.find( $states, function( $st )
			{
				$stArr = $st.name.split( '.' );
				$params = null;
				$uriParams = homepage_url.split( '?' );

				if( $st.url && ($uriParams.length == 1) )
				{
					$strURLs = $st.url.split( ":" );
					$homePageSplit = homepage_url.split( "/" );
					if( $strURLs.length > 1 )
					{
						$strURLs[ 0 ] = $strURLs[ 0 ].substring( 0, $strURLs[ 0 ].length - 1 );
					}
					$homePageSplit[ 0 ] = "/" + $homePageSplit[ 0 ];

                    if( $stArr[ 0 ] == "public" && ($homePageSplit[ 0 ] == $strURLs[ 0 ]) && ($strURLs.length == $homePageSplit.length) )
                    {
                        $params = {};
                        if( $homePageSplit.length > 1 )
                        {
                            $params[ $strURLs[ 1 ] ] = $homePageSplit[ 1 ];
                        }
                        else
                        {
                            $params = null;
                        }
                        return true;
                    }
                    else
                    {
                        return false;
                    }
				}
				else if( $st.url )
				{
                    if( $stArr[ 0 ] == "public" && ($st.url.split( '?' )[ 0 ]) == "/" + $uriParams[ 0 ] )
                    {
                        return true;
                    }
                    else
                    {
                        return false;
                    }
				}
			} );
            if( $intendedState )
            {
                $homeState = $intendedState.name;
            }
            else
            {
                Restangular.one( 'permalink', homepage_url ).get().then( function( response )
                {
                    switch( response.type )
                    {
                        case "lessons":
                            $state.go( 'public.app.site.lesson', { permalink: homepage_url }, { location: false } );
                            break;
                        case "custom_pages":
                            $state.go( 'public.app.site.page', { permalink: homepage_url }, { location: false } );
                            break;
                        case "download_center":
                            $state.go( 'public.app.site.download', { permalink: homepage_url }, { location: false } );
                            break;
                        case "livecasts":
                            $state.go( 'public.app.site.livecast', { permalink: homepage_url }, { location: false } );
                            break;
                        case "posts":
                            $state.go( 'public.app.site.post', { permalink: homepage_url }, { location: false } );
                            break;
                        case "support_articles":
                            $state.go( 'public.app.site.support-article', { permalink: homepage_url }, { location: false } );
                            break;
                        case "bridge_bpages":
                            $state.go( 'bridgepage', { permalink: homepage_url }, { location: false } );
                            break;
                        case "forum_topics":
                            $state.go("public.app.site.forum-topic",{permalink: homepage_url}, {location: false});
                            break;
                        case "forum_categories":
                            $state.go("public.app.site.forum-category",{permalink: homepage_url}, {location: false});
                            break;
                        case 'affcontests':
                            $state.go( 'public.app.site.affiliateContest', { permalink: homepage_url }, { location: false } );
                            break;
                        case 'smart_links':
                            location.href = response.redirect_url;
                            break;
                    }
                    return;
                } );
            }
		}

        if( $homeState == 'public.app.site.home2' )
            $homeState = 'public.app.site.lessons';

        if( typeof $params == 'undefined' )
        {
            $state.go( $homeState, {}, { location: false } );
        }
        else
        {
            $state.go( $homeState, $params, { location: false } );
        }
	}
    else
        $timeout(function(){
            $state.go( "public.app.site.lessons", {}, { location: false } );
        } , 5)

} );