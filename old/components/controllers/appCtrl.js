app.controller( 'homePageController', function( $scope, $state, $rootScope, $location, $localStorage, Restangular, notify, $site)
{
	var homepage_url = null;

	angular.forEach( $site.meta_data, function( value, key )
	{
        if( value.key == 'homepage_url' )
        {
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

	if( window.location.pathname == '/' && $rootScope.subdomain != "my" )
	{
		$homeState = 'public.app.lessons';

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
                            $state.go( 'public.app.lesson', { permalink: homepage_url }, { location: false } );
                            break;
                        case "custom_pages":
                            $state.go( 'public.app.page', { permalink: homepage_url }, { location: false } );
                            break;
                        case "download_center":
                            $state.go( 'public.app.download', { permalink: homepage_url }, { location: false } );
                            break;
                        case "livecasts":
                            $state.go( 'public.app.livecast', { permalink: homepage_url }, { location: false } );
                            break;
                        case "posts":
                            $state.go( 'public.app.post', { permalink: homepage_url }, { location: false } );
                            break;
                        case "support_articles":
                            $state.go( 'public.app.support-article', { permalink: homepage_url }, { location: false } );
                            break;
                        case "bridge_bpages":
                            $state.go( 'bridgepage', { permalink: homepage_url }, { location: false } );
                    }
                    return;
                } );
            }
		}

        if( $homeState == 'public.app.home2' )
            $homeState = 'public.app.lessons';

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
        $state.go( "public.app.lessons", {}, { location: false } );

} );


app.controller('infoController', function ($scope, $rootScope,$location, $localStorage , $state, $stateParams,$modal, $filter, Restangular, notify,$location) {

    $scope.isLoggedIn = function()
    {
        if( $localStorage.user && $localStorage.user.id )
        {
            return true;
        }
        return false;
    }

	$scope.lesson_count = 0;
	$rootScope.page_title = 'Sales Page';
	$scope.salesPage=window.location.hash.substr(1);
	$scope.loading=true;

	if( $scope.isLoggedIn() && $scope.salesPage!='preview' )
	    $state.go('public.app.lessons',{},{location:false});

	if($scope.site.show_syllabus_toggle)
	{
	    if ($localStorage.syllabus_format){
	        $scope.site.syllabus_format = $localStorage.syllabus_format;
	    }
	}
	else
	{
	    delete $localStorage.syllabus_format;
	}

	Restangular.one('module', 'home').get().then(function(response){
	    $scope.loading=false;
	    $modules=response;
	    $scope.modules = $modules;
	    $scope.modules = _.reject($scope.modules,function($mod){
	        return $mod.lessons.length==0;
	    });
	    $.each($scope.modules, function (key, data) {
	        $.each(data.lessons, function (key, data) {
	            $scope.lesson_count++;
	            data.showCounter=$scope.lesson_count;
	            switch(parseInt(data.access_level_type)){
	                case 1:
	                    data.access = 'Public';
	                    break;
	                case 2:
	                    data.access = data.access_level !== undefined && data.access_level !== null && data.access_level.name !== undefined ? data.access_level.name : '';
	                    break;
	                case 3:
	                    data.access = 'Members';
	                    break;
	                case 4:
	                    data.access = 'Draft (admin-only)';
	                    break;
	            }
	            if (data.content != undefined && typeof(data.content) == "string")
	                data.description = $scope.excerpt( data.content );
	            else
	                data.description = data.content;
	        });
	        data.lessons = _.toArray(data.lessons);
	    });

	    $rootScope.Modulelessons=[];
	    for(var i=0;i<$scope.modules.length;i++)
	    {   
	        $rootScope.Modulelessons.push.apply( $rootScope.Modulelessons, $filter('orderBy')($scope.modules[i].lessons, 'sort_order') );
	    }
	});

	$scope.cutString = function(s, n){
		var cut= s.indexOf(' ', n);
		if(cut== -1) return s;
		return s.substring(0, cut)
	}

	$scope.excerpt = function( string ) {
		return $scope.cutString( string.replace(/(<([^>]+)>)/ig,""), 200 );
	}


	$scope.showFormat = function(format){
		$localStorage.syllabus_format = format;
		$scope.site.syllabus_format = format;
	}

	
	$scope.assignCounter= function ($ctr)
	{
		$rootScope.showCounter=parseInt($ctr);
	}

});

app.controller( 'AppController', function( $scope,toastr, $state, $rootScope, $location, $localStorage, Restangular, notify, $modal, Upload )
{
	$scope.$user = null;
	$scope.$user = $localStorage.user;
	$scope.$state = $state;
	var options = Restangular.all( "siteMetaData" );
	var page = Restangular.all( "site" );

	$scope.options = {};
	$scope.access_level_types = [
		{ id: 4, name: 'Draft (admin-only)' },
		{ id: 1, name: 'Visitors' },
		{ id: 2, name: 'Members' }
	];

	$scope.payment_method_types = [
		{ id: 1, name: 'JVzoo' },
		{ id: 2, name: 'Paypal' },
		{ id: 3, name: 'Stripe' }
	];

	// $scope.selectedElement=function($index){
	//    $.each( $scope.options.menu_items, function (key, data) {
	//         delete $scope.options.menu_items[key].selected;
	//     });
	//   $scope.options.menu_items[$index].selected=true;
	// }

	$scope.showLessonNotification = function( lessonCount )
	{

		console.log("lesson notifications");
		var options = [];

		$.each( $scope.site.meta_data, function( key, data )
		{
			options[ data.key ] = data.value;
		} );

		var lessonsWord = 'lessons';

        if( typeof options.lesson_text != 'undefined' && options.lesson_text != '' )
        {
            lessonsWord = options.lesson_text;
        }

		$scope.title = lessonCount + " new " + lessonsWord.toLowerCase() + " have been added since your last visit!";
		$scope.content = $scope.showLessons;
		
		swal({   
			title: $scope.title,   
			text: $scope.content,   
			html: true 
		});

		return;

		// var swalParameters = {
		// 	title: $scope.title,
		// 	text: $scope.content,
		// 	html: true,
		// 	type: "info",
		// 	showCancelButton: true,
		// 	cancelButtonText: 'View ' + lessonsWord
		// };

		// if( $state.current.name == 'public.app.lessons' )
		// {
		// 	swalParameters.showCancelButton = false;
		// }

		// swal( swalParameters, function( isConfirm )
		// {
		// 	if( isConfirm )
		// 	{

		// 	}
		// 	else
		// 	{
		// 		$state.go( 'public.app.lessons' );
		// 	}
		// } );
		var modalInstance = $modal.open({
			templateUrl: '/templates/modals/lessonNotification.html',
			controller: "modalController",
			scope: $scope
		});
		 
	}
	$scope.showNonLessonNotification = function( nonAdminResponse, i )
	{
		console.log("non lesson notifications");
		if( i < $scope.nonLessonNotices )
		{
			$scope.title = "<div style='font-size: 15px;'><b>" + nonAdminResponse[ i ].title + "</b></div>";
			$scope.content = nonAdminResponse[ i ].content;
			
			swal({   
				title: $scope.title,   
				text: $scope.content,   
				html: true,
				showCancelButton: true,   
				confirmButtonColor: "#DD6B55",   
				confirmButtonText: "Confirm",   
				cancelButtonText: "Cancel",   
				closeOnConfirm: true,   
				closeOnCancel: true
			},
			function(isConfirm){
				if(isConfirm)
					Restangular.all( "siteNoticeSeen" ).post( { 'site_notice_id': nonAdminResponse[ i ].id } );
					setTimeout( function()
					{
						if( $scope.lessonNotices > 0 && $scope.$user != null )
						{
							$scope.showLessonNotification( $scope.lessonNotices );
						}
					}, 300 );
			});

			return;

			/*
			var modalInstance = $modal.open( {
				templateUrl: '/templates/modals/marketingNotification.html',
				controller: "modalController",
				scope: $scope
			} );
			modalInstance.result.then( function()
			{
				Restangular.all( "siteNoticeSeen" ).post( { 'site_notice_id': nonAdminResponse[ i ].id } );
				setTimeout( function()
				{
					if( $scope.lessonNotices > 0 && $scope.$user != null )
					{
						$scope.showLessonNotification( $scope.lessonNotices );
					}
				}, 300 );
			} );
			*/
		}
	}
	$scope.getLesson = function( $lessonToGet )
	{
		Restangular.one( '/lessonByTitle/' + $lessonToGet ).get().then( function( response )
		{
			console.log( response );
			window.open( "/" + response.permalink, "_self" );
		} );
	}
	$scope.showNotifications = function()
	{
		Restangular.all( 'siteNotice/getnotifications' ).getList().then( function( response )
		{
			$scope.nonLessonNotices = 0;
			$scope.lessonNotices = 0;
			$scope.shownNonLessonNotices = 0;
			$scope.lessonsNotification = [];
			$scope.nonlessonsNotification = [];
			for( var j = 0; j < response.length; j++ )
			{
                if( $localStorage.lastID )
                {
                    if( $localStorage.lastID.indexOf( response[ j ].id ) < 0 )
                    {
                        $localStorage.lastID.push( response[ j ].id );
                    }
                    else
                    {
                        continue;
                    }
                }
                else
                {
                    $localStorage.lastID = [];
                    $localStorage.lastID.push( response[ j ].id );
                }

				if( response[ j ].type == 'admin' )
				{
					$scope.nonlessonsNotification = [];
					$scope.nonlessonsNotification.push( response[ j ] );
					$scope.nonLessonNotices++;
				}
				else
				{
					$scope.lessonsNotification.push( response[ j ].content );
					$scope.lessonNotices++;
				}
			}

			$scope.showLessons = "<ol>";
			for( var i = 0; i < $scope.lessonsNotification.length && i < 3; i++ )
			{
				$scope.showLessons += "<li style='text-align:left;'>" + $scope.lessonsNotification[ i ] + "</li>";
			}
			$scope.showLessons += "</ol>";

            if( $scope.lessonsNotification.length > 3 )
            {
                $scope.showLessons += "<a  onclick='swal.close();' href='/lessons'>and " + ($scope.lessonsNotification.length - 3 ) + " more!</a>";
            }

			if( $scope.nonLessonNotices > 0 && $scope.$user != null )
			{
				$scope.showNonLessonNotification( $scope.nonlessonsNotification, 0 );
			}
			else
			{
                if( $scope.lessonNotices > 0 && $scope.$user != null )
                {
                    $scope.showLessonNotification( $scope.lessonNotices );
                }
			}
		} );
	}

	$scope.logout = function()
	{
		$localStorage.user = false;
		$rootScope.$storage = $localStorage;
	}

	$scope.isLoggedIn = function()
	{
		if( $localStorage.user && $localStorage.user.id )
		{
			return true;
		}
		return false;
	}

	$scope.isUrl = function( str1 )
	{
        if( !str1 )
        {
            return false;
        }
		return (str1.substring( 0, 'https'.length ) == 'https') || (str1.substring( 0, 'http'.length ) == 'http') || (str1.substring( 0, 'www'.length ) == 'www');
	}

	$scope.startsWithExternalUrl = function( str1 )
	{
        if( !str1 )
        {
            return false;
        }
		return (str1.substring( 0, 'http'.length ) == 'http') || (str1.substring( 0, 'www'.length ) == 'www') || (str1.substring( 0, 'mailto:'.length ) == 'mailto:');
	}

	$scope.fixMenuWidth = function()
	{
		fixMenuWidth();
	}

	/*
	 This is depricated
	 */
	$scope.initialize = function()
	{
		Restangular.one( 'site', 'details' ).get().then( function( details )
		{
			if( details )
			{
				$.each( details.meta_data, function( key, data )
				{
					$scope.options[ data.key ] = data.value;
				} );
                if( details.menu_items )
                {
                    $scope.options.menu_items = details.menu_items;
                }
                if( details.footer_menu_items )
                {
                    $scope.options.footer_menu_items = details.footer_menu_items;
                }
				$scope.site = details;
			}
			$scope.ads = details.ad;
			$scope.options.themes = global_themes;
			$scope.options.theme_options = global_theme_options;

            if( $localStorage.theme )
            {
                $scope.options.theme = $localStorage.theme;
            }

		} );
	};
} );


app.controller( 'blogController', function( $scope, $rootScope, $localStorage, Restangular, $site, notify )
{
	$scope.posts = [];
	$scope.loading=true;
	Restangular.all( 'post' ).getList( { 'site_id': $site.id } ).then( function( response )
	{
		$scope.loading=false;
		$scope.posts = response;
	} );
} );

