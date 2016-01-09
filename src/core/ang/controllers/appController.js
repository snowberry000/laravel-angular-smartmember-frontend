app.controller( 'IndexAppController', function( $scope,toastr, $state, $rootScope, $location, $localStorage, Restangular, notify,  Upload )
{
	$rootScope.left_sidebar_contents = '';
	$rootScope.top_sidebar_contents = '';

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
        //temporarily disabled until they are mobile friendly and closeable
        return;
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
	/*$scope.initialize = function()
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
	};*/
} );