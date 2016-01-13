var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.site.appearance.settings", {
			url: "/settings",
			templateUrl: "/templates/components/public/administrate/site/appearance/settings/settings.html",
			controller: "SettingsController"
		} )
} );

app.controller( "SettingsController", function( $scope, smModal,$state, $rootScope, $localStorage, $location, $stateParams, Restangular, toastr )
{
	$rootScope.not_homepage_setting = false;
	$site_options = null;
	$site = $rootScope.site;
	$scope.keys = [];

	$scope.resolve = function()
	{
		Restangular.all( "siteMetaData" ).getList().then( function( response )
		{
			$site_options =  $rootScope.site.meta_data;
			$scope.site_options = {};
			console.log( 'site_options:' );
			console.log( $site_options );
			$.each( $site_options, function( key, data )
			{
				$scope.site_options[ data.key ] = data.value;
			} );

			$scope.site_options.default_syllabus_closed  == '1' ? $scope.site_options.default_syllabus_closed =true : $scope.site_options.default_syllabus_closed = false;
		} )
		Restangular.all( 'sharedKey/associatedKey' ).customGET().then( function( data )
		{
			if( data.total_count > 0 )
			{
				angular.forEach( data.items, function( item )
				{
					$scope.keys.push( item );
				} )
			}
		} );

	}

	$scope.saveNewKey = function()
	{
		Restangular.all( 'accessLevelShareKey' ).post( { key: $scope.key } ).then( function( response )
		{
			$scope.keys.push( response );
			toastr.success( "Your site has been associated with this new key" );
		} );
	}

	$scope.updateMenuItem = function( model )
	{
		$scope.site_options.cap_icon = model.custom_icon;
		$( '#cap_icon i' ).attr( 'class', '' ).addClass( 'fa ' + $scope.site_options.cap_icon );
		delete $scope.site_options.open;
	}

	$scope.save = function()
	{

		$scope.site_options.site  = {
			name: $scope.site.name,
			subdomain: $scope.site.subdomain,
			domain: $scope.site.domain,
		};

		delete $scope.site_options.url;
		delete $scope.site_options.open;
		console.log($scope.site_options.default_syllabus_closed);
		Restangular.all( 'siteMetaData' ).customPOST( $scope.site_options, "save" ).then( function()
		{
			toastr.success( "Options are saved!" );
			smModal.Close( 'public.administrate.site.appearance.settings' );
			$scope.site_options.isOpen = false;
			$localStorage.homepage_url = $scope.site_options.homepage_url;
			$state.transitionTo($state.current, $stateParams, { 
			  reload: true, inherit: false, location: false
			});
		} );
	}

	// $scope.saveSyllabusOptions = function()
	// {

	// 	$scope.site_options.default_syllabus_closed  = true;
	// 	delete $scope.site_options.url;
	// 	delete $scope.site_options.open;
	// 	Restangular.all( 'siteMetaData' ).customPOST( $scope.site_options, "save" ).then( function()
	// 	{
	// 		toastr.success( "Options are saved!" );
	// 		smModal.Close( 'public.administrate.site.appearance.settings' );
	// 		$scope.site_options.isOpen = false;
	// 		$localStorage.homepage_url = $scope.site_options.homepage_url;
	// 		$state.transitionTo($state.current, $stateParams, { 
	// 		  reload: true, inherit: false, location: false
	// 		});
	// 	} );
	// }

	$scope.selectUrl = function( item, selected_url, show_next )
	{

		var api_resources = [ 'lesson', 'customPage', 'post', 'download', 'livecast', 'supportArticle', 'bridgePage' ];
		if( !selected_url )
		{
			return;
		}
		if( api_resources.indexOf( selected_url ) < 0 )
		{
			item.url = selected_url;
			$scope.site_options[ 'homepage_url' ] = selected_url;
			$scope.show_next = show_next;
			$scope.close();
		}
		else if( selected_url == 'download' )
		{
			console.log( item.site_id )
			Restangular.all( '' ).customGET( 'download', { site_id: $site.id } ).then( function( response )
			{
				var downloads = response;
				downloads.forEach( function( entity )
				{
					entity.url = entity.permalink;
				} )
				$scope.show_next = true;
				$scope.loaded_items = downloads;

			} )
		}
		else
		{
			Restangular.all( selected_url ).getList( { site_id: $site.id } ).then( function( response )
			{
				if( response.route == 'customPage' )
				{
					response.route = 'page';
				}
				if( response.route == 'supportArticle' )
				{
					response.route = 'support-article';
				}
				response.forEach( function( entity )
				{
					entity.url = entity.permalink;
				} )
				$scope.show_next = true;
				$scope.loaded_items = response.items;

			} )
		}
	}

	$scope.resolve();
} );