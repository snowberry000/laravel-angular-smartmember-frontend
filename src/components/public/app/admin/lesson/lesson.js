var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.lesson", {
			url: "/lesson/:id?",
			templateUrl: "/templates/components/public/app/admin/lesson/lesson.html",
			controller: "SyllabusLessonController",
			resolve: {
			}
		} )
} );

app.controller( "SyllabusLessonController", function( $scope, $q, $rootScope, smModal, $localStorage, $timeout, $state, $location, $stateParams, $filter, Restangular, toastr, Upload )
{
	$site = $rootScope.site;
	$user = $rootScope.user;
	$next_item = null;
	$modules = null;
	$scope.options = {};

	// if (!Modernizr.inputtypes.date) {
	//   // no native support for <input type="date"> :(
	//   // maybe build one yourself with Dojo or jQueryUI
	//   $('input[type="date"]').datepicker();
	// }


	var matches;
	var interval;
	var timeout = null;
	var draft;
	var changed;
	var seo = {};
	var video_id;
	var ampersandPosition;

	$scope.resolve = function()
	{
		$nextItemRequest = null;
		$modulesRequest = null;
		$scope.loading = true;
		if( $stateParams.id )
		{
			$nextItemRequest = Restangular.one( 'lesson', $stateParams.id ).get().then( function( response )
			{
				$next_item = response;
			} );
		}
		else if( $location.search().clone )
		{
			$nextItemRequest = Restangular.one( 'lesson', $location.search().clone ).get().then( function( response )
			{
				$next_item = response;
			} );
		}
		else
		{
			$next_item = { access_level_type: 4, access_level_id: 0 }
		}

		$modulesRequest = Restangular.all( 'module' ).customGET( '' ).then( function( response )
		{
			$modules = response;
		} );

		if( $nextItemRequest )
		{
			$q.all( [ $nextItemRequest, $modulesRequest ] ).then( function( res )
			{
				$scope.init();
			} );
		}
		else
		{
			$q.all( [ $modulesRequest ] ).then( function( res )
			{
				$scope.init();
			} );
		}

	}

	$scope.cancel = function (){
		if( $location.search().organizer)
			$state.go('public.app.admin.organizer');
		else
			$state.go('public.app.admin.lessons');
	}

	$scope.init = function()
	{
		if (!Modernizr.inputtypes.date) {
          // no native support for <input type="date"> :(
          // maybe build one yourself with Dojo or jQueryUI
          $('input[type="date"]').datepicker();
        }


		$scope.refrer = $location.search().organizer;
		if( !$next_item.id )
		{
			$next_item.site_id = $rootScope.site.id;
		}
		$scope.loading = false;
		$scope.template_data = {
			title: 'Lesson',
			cancel_route: 'public.app.admin.lessons',
			success_route: 'public.app.admin.lessons'
		}

		if( $location.search().organizer )
        {
            $scope.template_data.cancel_route = 'public.app.admin.organizer';
            $scope.template_data.success_route = 'public.app.admin.organizer';
        }

		if( $location.search().clone )
		{
			delete $next_item.id;
			delete $next_item.author_id;
			delete $next_item.access;
		}


		if( $modules.items.length > 0 )
		{
			$scope.modules = $modules.items;
		}
		else
		{
			$scope.modules = null;
		}
		$scope.newModule = {};
		$scope.options.theme = '';

		$scope.next_item = $next_item;

		//speed blogging stuff here
		if( !$scope.next_item.id )
		{
			if( $stateParams.speed_blogging )
			{
				angular.forEach( $stateParams.speed_blogging, function( value, index )
				{
					$scope.next_item[ index ] = value;
				} )
			}
		}

		$scope.next_item.dripfeed_settings = $next_item.dripfeed || {};
		if( $scope.next_item.published_date )
		{
			$scope.next_item.published_date = new Date( moment.utc( $scope.next_item.published_date ) );		}
		else
		{
			$scope.next_item.published_date = new Date();
			$scope.next_item.published_date.setSeconds( 0 );
			$scope.next_item.published_date.setMilliseconds( 0 );
		}
		if( $scope.next_item.end_published_date )
		{
			$scope.next_item.end_published_date = new Date( moment.utc( $scope.next_item.end_published_date ));
		}
		else
		{
			$scope.next_item.end_published_date = null;
		}

		$scope.next_item.discussion_settings = $next_item.discussion_settings || {};
		$scope.next_item.id ? $scope.page_title = 'Edit lesson' : $scope.page_title = 'Create lesson';
		$scope.next_item.transcript_content_public == 1 ? $scope.next_item.transcript_content_public = true : $scope.next_item.transcript_content_public = false;
		$scope.next_item.access_level_type = parseInt( $scope.next_item.access_level_type );
		$scope.next_item.access_level_id = parseInt( $scope.next_item.access_level_id );

		if( $scope.next_item.access_level_type == 3 )
		{
			$scope.next_item.access_level_type = 2;
		}


		if( $next_item.seo_settings )
		{
			$.each( $next_item.seo_settings, function( key, data )
			{
				seo[ data.meta_key ] = data.meta_value;

			} );
		}
		$scope.next_item.seo_settings = seo;

		if( false && !$stateParams.id && !$stateParams.clone )
		{
			Restangular.all( 'draft' ).customGET( '', {
				site_id: $site.id,
				user_id: $user.id,
				key: 'lessons.content'
			} ).then( function( response )
			{
				if( response.length )
				{
					draft = response[ 0 ];
					$scope.loadDraft();
				}
			} )
		}

		$scope.$watch( 'lesson', function( lesson, oldLesson )
		{
			if( typeof changed == "undefined" )
			{
				changed = false;
			}
			else
			{
				changed = true;
			}
			if( lesson != oldLesson && changed && !$scope.next_item.id && !$stateParams.clone )
			{
				if( timeout )
				{
					$timeout.cancel( timeout )
				}
				timeout = $timeout( $scope.start, 3000 );  // 1000 = 1 second
			}
		}, true );

		$scope.setPermalink();
	}


	$scope.strip_tags = function( input, allowed )
	{
		allowed = (((allowed || '') + '')
			.toLowerCase()
			.match( /<[a-z][a-z0-9]*>/g ) || [])
			.join( '' ); // making sure the allowed arg is a string containing only tags in lowercase (<a><b><c>)
		var tags = /<\/?([a-z][a-z0-9]*)\b[^>]*>/gi,
			commentsAndPhpTags = /<!--[\s\S]*?-->|<\?(?:php)?[\s\S]*?\?>/gi;
		return input.replace( commentsAndPhpTags, '' )
			.replace( tags, function( $0, $1 )
			{
				return allowed.indexOf( '<' + $1.toLowerCase() + '>' ) > -1 ? $0 : '';
			} );
	}

	$scope.getUrlVars = function()
	{
		var vars = {};
		var parts = window.location.href.replace( /[?&]+([^=&]+)=([^&]*)/gi, function( m, key, value )
		{
			vars[ key ] = decodeURIComponent( value );
		} );
		return vars;
	}


	$scope.func = function()
	{
		var modalInstance = $modal.open( {
			templateUrl: 'templates/modals/moduleCreator.html',
			controller: "modalController",
			scope: $scope
		} );
		modalInstance.result.then( function()
		{
			alert( "result called" );
		} )
	}


	$scope.range = function( min, max, step )
	{
		step = step || 1;
		var input = [];
		for( var i = min; i <= max; i += step )
		{
			input.push( i );
		}
		return input;
	};


	$scope.imageUpload = function( files, type )
	{
		for( var i = 0; i < files.length; i++ )
		{
			var file = files[ i ];
			Upload.upload( {
					url: $scope.app.apiUrl + '/utility/upload',
					file: file
				} )
				.success( function( data, status, headers, config )
				{
					var editor = $.summernote.eventHandler.getModule();

					$scope.next_item[ type ] += '<img src=\'' + data.file_name + '\'>';
					console.log( 'do we gots editable now? ', $scope.editable );
					//$scope.editable seems to be undefined, not sure why
					/*
					 if(type=='transcript')
					 editor.insertImage( $scope.editable2, data.file_name);
					 else
					 editor.insertImage( $scope.editable, data.file_name);
					 */
				} ).error( function( data, status, headers, config )
			{
			} );
		}
	}

	$scope.changeModule = function( $mod )
	{
		for( var i = 0; i < $modules.items.length; i++ )
		{
			if( $modules.items[ i ].title == $mod )
			{
				$scope.next_item.module_id = $modules.items[ i ].id;
				break;
			}
		}
	}

	$scope.setPermalink = function( $event )
	{
		if( !$scope.next_item.permalink )
		{
			$scope.next_item.permalink = $filter( 'urlify' )( $scope.next_item.title ).toLowerCase();
		}
		$scope.next_item.seo_settings.fb_share_title = $scope.next_item.title;
	}


	$scope.onBlurSlug = function( $event )
	{
		if( $scope.next_item.permalink )
		{
			$scope.next_item.permalink = $filter( 'urlify' )( $scope.next_item.permalink );
		}
	}

	$scope.saveModule = function( $model )
	{
		Restangular.all( 'module' ).post( $model ).then( function( module )
		{
			if( $scope.modules )
			{
				$scope.modules.push( module );
			}
			else
			{
				$scope.modules = [];
				$scope.modules.push( module );
			}
			toastr.success( "Module has been saved" );
			$scope.isOpen = false;
			$state.transitionTo( $state.current, $state.params, {
				reload: true, inherit: false, location: false
			} );
		} );
	}
	$scope.getFileName = function( $url )
	{
		if( $url )
		{
			str = $url.split( "/" );
			if( str )
			{
				str = str[ str.length - 1 ];
				tkns = str.split( "." )
				if( tkns.length > 0 )
				{
					tkns.splice( 0, 1 );
				}

				return tkns.join( '.' );
			}
		}
	}

	$scope.saveAsDraft = function(){
		$scope.next_item.access_level_type = 4;
		$scope.save();
	}

	$scope.save = function()
	{
		delete $scope.next_item.prev_lesson;
		delete $scope.next_item.next_lesson;
		delete $scope.next_item.total_lessons;
		delete $scope.next_item.access_level;
		delete $scope.next_item.current_index;
		delete $scope.next_item.module;
		delete $scope.next_item.site;

		if( $scope.next_item.permalink == '' || !$scope.next_item.permalink){
		    toastr.error("Please enter valid permalink");
		    return;
		}

		$scope.next_item.title = $scope.next_item.title.trim();

		if( $scope.next_item.permalink == '' )
		{
			this.setPermalink( null );
		}

		$scope.next_item.permalink = $scope.next_item.permalink.trim();
		$callback = "";

		if( $scope.next_item.access_level_type == 2 && $scope.next_item.access_level_id == 0 )
		{
			$scope.next_item.access_level_type = 3;
		}

		if( $scope.next_item.access_level_type != 2 && $scope.next_item.access_level_type != 3)
		{
			$scope.next_item.access_level_id = 0;
		}
		if( $scope.next_item.id )
		{
			$callback = $scope.next_item.put();
		}
		else
		{
			$callback = Restangular.all( 'lesson' ).post( $scope.next_item );
		}

		$callback.then( function( lesson )
		{
			if( draft )
			{
				Restangular.one( 'draft', draft.id ).remove();
			}

			$scope.next_item = lesson;
			toastr.success( "Lesson has been saved" );
			if( $stateParams.close )
			{
				//close( lesson );
				smModal.Close();
				return;
			}
			if( $rootScope.syllabus_redirect_url )
			{
				$state.go( $rootScope.syllabus_redirect_url );
				$rootScope.syllabus_redirect_url = '';
			}
			else
			{
				$state.go( $scope.template_data.success_route );
			}
			$timeout(function(){
				$state.transitionTo( $state.current, $state.params, {
				reload: true, inherit: false, location: false
			} );
			} , 50)
			
		} )

	}
	//disabling for now as this is not the draft feature we wanted.

	$scope.loadDraft = function()
	{
		var value = JSON.parse( draft.value );
		var modalInstance = $modal.open( {
			templateUrl: '/templates/modals/loadDraft.html',
			controller: "modalController",
			scope: $scope,

		} );
		modalInstance.result.then( function()
			{
				$scope.next_item = value;
				//$scope.start();
			},
			function()
			{
				Restangular.one( 'draft', draft.id ).remove().then( function( res )
				{
					draft = null;
				} );
				//$scope.start();
			} )
	}


	$scope.start = function()
	{
		var data = {
			site_id: $site.id,
			user_id: $user.id,
			key: 'lessons.content',
			value: JSON.stringify( $scope.next_item )
		}
		Restangular.all( 'draft' ).post( data ).then( function( response )
		{
			console.log( response );
			draft = response;
		} )
	}
	$scope.resolve();
	var $_GET = $scope.getUrlVars();
} );