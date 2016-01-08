var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.site.content.blog.post", {
			url: "/post/:id?",
			templateUrl: "/templates/components/public/administrate/site/content/blog/post/post.html",
			controller: "PostController",
			resolve: {
				loadPlugin: function( $ocLazyLoad )
				{
					return $ocLazyLoad.load( [
						{
							name: 'summernote'
						}
					] );
				}
			}
		} )
} );

app.controller( "PostController", function( $scope, $localStorage, $stateParams, $rootScope, $timeout, $location,smModal ,$state,  $filter, Restangular, toastr, Upload )
{
	$site = $rootScope.site;
	$user = $rootScope.user;
	$next_item = null;
	var draft;
	var changed;
	var seo = {};
	var timeout = null;

	$scope.resolve = function()
	{
        if( $stateParams.id )
        {
            Restangular.one( 'post', $stateParams.id ).get().then( function( response )
            {
                $next_item = response;
                $scope.next_item = $next_item;
                $scope.init();
            } );
        }
        else if( $stateParams.clone )
        {
            Restangular.one( 'post', $stateParams.clone ).get().then( function( response )
            {
                $next_item = response;
                $scope.next_item = $next_item;
                $scope.init();
            } );
        }
        else
        {
            $next_item = { access_level_type: 4 };
            $scope.next_item = $next_item;
            $scope.init();
        }

    }

    $scope.init = function()
    {
        if( !$next_item.id )
        {
            $next_item.site_id = $scope.site.id;
		}
		$scope.next_item.id ? $scope.page_title = 'Edit post' : $scope.page_title = 'Create post';
		$scope.next_item.discussion_settings = $next_item.discussion_settings || {};
		if( $stateParams.clone )
		{
			delete $next_item.id;
			delete $next_item.access;
			delete $next_item.site;
		}

		if( $scope.next_item.seo_settings )
		{
			$.each( $scope.next_item.seo_settings, function( key, data )
			{
				seo[ data.meta_key ] = data.meta_value;

			} );
		}

	    if( $scope.next_item.end_published_date )
        {
            $scope.next_item.end_published_date = new Date( moment( $scope.next_item.end_published_date ).format( 'l' ) );
        }
        else
        {
            $scope.next_item.end_published_date = null;
        }
        if( $scope.next_item.published_date )
		{
			$scope.next_item.published_date = new Date( moment( $scope.next_item.published_date ).format( 'l' ) );
		}
		else
		{
			$scope.next_item.published_date = new Date();
			$scope.next_item.published_date.setSeconds( 0 );
			$scope.next_item.published_date.setMilliseconds( 0 );
		}
		$scope.next_item.seo_settings = seo;
		Restangular.all( 'post' ).customGET( 'getMostUsed/' + $site.id ).then( function( response )
		{
			$scope.next_item.most_used_categories = response.most_used_categories;
			$scope.next_item.most_used_tags = response.most_used_tags;
		} )


		$scope.$watch( 'post', function( post, oldPost )
		{
			if( typeof changed == "undefined" )
            {
                changed = false;
            }
            else
            {
                changed = true;
            }
            if( post != oldPost && changed && !$scope.next_item.id && !$stateParams.clone )
			{
				if( timeout )
				{
					$timeout.cancel( timeout )
				}
				timeout = $timeout( $scope.start, 3000 );  // 1000 = 1 second
			}
		}, true )

	}

	$scope.template_data = {
		title: 'Post',
		cancel_route: 'public.administrate.site.content.blog.posts',
		success_route: 'public.administrate.site.content.blog.posts',
		transcript: false,
		access_choice: false
	}
	$scope.site = $site = $rootScope.site;

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


    $scope.saveAsDraft = function()
	{
        if( $scope.next_item.permalink == '' )
        {
            this.onBlurTitle( null );
        }

        //console.log( $scope.next_item.categories );
		delete $scope.next_item.most_used_categories;
		delete $scope.next_item.most_used_tags;
		delete $scope.next_item.access_level;
        if( $scope.next_item.access_level_type != 2 )
        {
            $scope.next_item.access_level_id = 0;
        }
        if( $scope.next_item.id )
		{

			$scope.next_item.put().then(function(response){
				smModal.Show("public.administrate.site.content.blog.posts");
				toastr.success( "Your post has been updated!" );
			})
		}
		else
		{
			Restangular.all( 'post' ).post( $scope.next_item ).then( function( post )
			{

                if( draft )
                {
                    Restangular.one( 'draft', draft.id ).remove();
                }
                $scope.next_item = post;
                toastr.success( "Post has been saved" );
                smModal.Show("public.administrate.site.content.blog.posts");
			} );
		}
	}

	$scope.publish = function()
	{
        if( $scope.next_item.permalink == '' )
        {
            this.onBlurTitle( null );
        }

        delete $scope.next_item.most_used_categories;
		delete $scope.next_item.most_used_tags;
		delete $scope.next_item.access_level;
		$scope.next_item.access_level_type = 1;
		if( $scope.next_item.id )
		{

			$scope.next_item.put().then(function(response){
				smModal.Show("public.administrate.site.content.blog.posts");
				toastr.success( "Your post has been updated!" );
			})
		}
		else
		{
			Restangular.all( 'post' ).post( $scope.next_item ).then( function( post )
			{
				//console.log( "draft is this " );
				//console.log( draft );
                if( draft )
                {
                    Restangular.one( 'draft', draft.id ).remove();
                }
                $scope.next_item = post;
                toastr.success( "Post has been saved" );
				smModal.Show("public.administrate.site.content.blog.posts" );
			} );
		}
	}

	$scope.setPermalink = function( $event )
	{
        if( !$scope.next_item.permalink )
        {
            $scope.next_item.permalink = $filter( 'urlify' )( $scope.next_item.title );
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

    $scope.getFileName = function( $url )
	{
		if( $url )
		{
			$str = $url.split( "/" );
			return $str[ $str.length - 1 ];
		}
	}

	$scope.imageUpload = function( files )
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
					//console.log( data.file_name );
					var editor = $.summernote.eventHandler.getModule();
					file_location = '/uploads/' + data.file_name;
					editor.insertImage( $scope.editable, data.file_name );
				} ).error( function( data, status, headers, config )
			{
				//console.log( 'error status: ' + status );
			} );
		}
	}
	//disabling for now because this isn't the draft feature we wanted
	// if(false && !$stateParams.id && !$location.search().clone)
	// Restangular.all('draft').customGET('', {site_id : $site.id , user_id : $user.id , key : 'posts.content'}).then(function(response){
	//     if(response.length){
	//         draft = response[0]
	//         $scope.loadDraft()
	//     }
	// })
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
			},
			function()
			{
				Restangular.one( 'draft', draft.id ).remove().then( function( res )
				{
					draft = null;
				} );
			} )
	}


	$scope.start = function()
	{
		var data = {
			site_id: $site.id,
			user_id: $user.id,
			key: 'posts.content',
			value: JSON.stringify( $scope.next_item )
		}
		Restangular.all( 'draft' ).post( data ).then( function( response )
		{
			draft = response;
			//console.log( "draft value chaneged" );
			//console.log( response );
		} )
	}

	$scope.resolve();
} );