app.controller( 'siteSettingsWizardController', function( $scope, $rootScope, $filter, $http, $localStorage, Restangular, toastr )
{
	$scope.site = $rootScope.site;
	$scope.intention_feature = _.findWhere( $rootScope.wizard, { 'slug': 'settings' } );

	$scope.site_options = {};

	angular.forEach( $scope.site.meta_data, function( value, key )
	{
		$scope.site_options[ value.key ] = value.value;
	} );

	$scope.current_node = $scope.$parent;

	$scope.init1 = function()
	{
		$rootScope.$watch( 'current_changed', function( current_changed )
		{
			console.log( $scope )
			if( current_changed == $scope.intention_feature.id - 1 && parseInt( $rootScope.site.is_completed ) == 0 )
			{
				if( $scope.site.intention && parseInt( $rootScope.site.is_completed ) == 0 )
				{
					$rootScope.parent_wizard.next( $scope.intention_feature.id - 1, $scope.current_node );
				}
			}
		} );
	}

	$scope.save = function()
	{
		Restangular.all( "siteMetaData" ).customPOST( $scope.sales_options, "save" ).then( function()
		{
			toastr.success( "Sales page saved" );
			$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
		} );
	}
} );

app.controller( 'sendgridWizardController', function( $rootScope, $scope, $http, $filter, $document, $localStorage, $location, $stateParams, Restangular, toastr )
{
	$scope.current_node = $scope.$parent;

	$scope.integration = {
		id: 'sendgrid',
		name: 'Sendgrid',
		description: 'E-mail your customers using Sendgrid.',
		logo: '/images/integrations/sendgrid.png',
		long_description: ''
	};

	$scope.site = $rootScope.site;
	$scope.current_site = $scope.site;
	$scope.site_id = $scope.site.id;
	$scope.init = function( id, node )
	{
		if( !node.completed )
		{
			Restangular.all( "integration" ).customGET( '', { site_id: $scope.site.id } ).then( function( response )
			{
				if( response && response.length )
				{
					var sendgrid = _.findWhere( response, { type: "sendgrid" } );
					if( sendgrid )
					{
						$rootScope.parent_wizard.next( id, $scope.$parent );
					}
				}
			} );
		}
	}
	$scope.current_integration = {
		type: 'sendgrid',
		site_id: $scope.site_id
	};

	$scope.saveIntegration = function()
	{
		var data = {
			name: typeof $scope.current_integration.name != 'undefined' ? $scope.current_integration.name : null,
			site_id: typeof $scope.current_integration.site_id != 'undefined' ? $scope.current_integration.site_id : null,
			company_id: typeof $scope.current_integration.company_id != 'undefined' ? $scope.current_integration.company_id : null,
			connected_account_id: typeof $scope.current_integration.connected_account_id != 'undefined' ? $scope.current_integration.connected_account_id : 0,
			type: typeof $scope.current_integration.type != 'undefined' ? $scope.current_integration.type : '',
			username: typeof $scope.current_integration.username != 'undefined' ? $scope.current_integration.username : null,
			password: typeof $scope.current_integration.password != 'undefined' ? $scope.current_integration.password : null,
			access_token: typeof $scope.current_integration.access_token != 'undefined' ? $scope.current_integration.access_token : null,
			remote_id: typeof $scope.current_integration.remote_id != 'undefined' ? $scope.current_integration.remote_id : null,
			disabled: typeof $scope.current_integration.disabled != 'undefined' && $scope.current_integration.disabled != null ? $scope.current_integration.disabled : 0,
			default: typeof $scope.current_integration.default != 'undefined' && $scope.current_integration.default != null ? $scope.current_integration.default : 0
		};

		if( $scope.current_integration.id )
		{
			Restangular.all( 'integration' ).customPUT( data, $scope.current_integration.id ).then( function( response )
			{
				toastr.success( "Integration updated!" );
				$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
			} );
		}
		else
		{
			Restangular.service( 'integration' ).post( data ).then( function( response )
			{
				toastr.success( "Integration added!" );
				$scope.current_integration.id = response.id;
				$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
			} );
		}
	}
} );

app.controller( 'paypalWizardController', function( $rootScope, $scope, $http, $filter, $document, $localStorage, $location, $stateParams, Restangular, toastr )
{
	$scope.current_node = $scope.$parent;

	$scope.integration = {
		id: 'paypal',
		name: 'Paypal',
		description: 'Allow your customers to pay you with Paypal.',
		logo: '/images/integrations/paypal.png',
		long_description: ''
	};
	$scope.site = $rootScope.site;
	$scope.current_site = $scope.site;
	$scope.site_id = $scope.site.id;

	$scope.current_integration = {
		type: 'paypal',
		site_id: $scope.site_id
	};

	$scope.init = function( id, node )
	{
		if( !node.completed )
		{
			Restangular.all( "integration" ).customGET( '', { site_id: $rootScope.site.id } ).then( function( response )
			{
				if( response && response.length )
				{
					var paypal = _.findWhere( response, { type: "paypal" } );
					if( paypal )
					{
						$rootScope.parent_wizard.next( id, $scope.$parent );
					}
				}
			} );
		}
	}

	$scope.saveIntegration = function()
	{
		var data = {
			name: typeof $scope.current_integration.name != 'undefined' ? $scope.current_integration.name : null,
			site_id: typeof $scope.current_integration.site_id != 'undefined' ? $scope.current_integration.site_id : null,
			company_id: typeof $scope.current_integration.company_id != 'undefined' ? $scope.current_integration.company_id : null,
			connected_account_id: typeof $scope.current_integration.connected_account_id != 'undefined' ? $scope.current_integration.connected_account_id : 0,
			type: typeof $scope.current_integration.type != 'undefined' ? $scope.current_integration.type : '',
			username: typeof $scope.current_integration.username != 'undefined' ? $scope.current_integration.username : null,
			password: typeof $scope.current_integration.password != 'undefined' ? $scope.current_integration.password : null,
			access_token: typeof $scope.current_integration.access_token != 'undefined' ? $scope.current_integration.access_token : null,
			remote_id: typeof $scope.current_integration.remote_id != 'undefined' ? $scope.current_integration.remote_id : null,
			disabled: typeof $scope.current_integration.disabled != 'undefined' && $scope.current_integration.disabled != null ? $scope.current_integration.disabled : 0,
			default: typeof $scope.current_integration.default != 'undefined' && $scope.current_integration.default != null ? $scope.current_integration.default : 0
		};

		if( $scope.current_integration.id )
		{
			Restangular.all( 'integration' ).customPUT( data, $scope.current_integration.id ).then( function( response )
			{
				toastr.success( "Integration updated!" );
				$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
			} );
		}
		else
		{
			Restangular.service( 'integration' ).post( data ).then( function( response )
			{
				toastr.success( "Integration added!" );
				$scope.current_integration.id = response.id;
				$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
			} );
		}
	}
} );

app.controller( 'menuWizardController', function( $rootScope, $scope, $http, $filter, $document, $localStorage, $location, $stateParams, $ocLazyLoad, Restangular, toastr )
{
	$scope.wizard_mode = true;

	$scope.sales_option = {};
	$scope.menu_items = [];
	$scope.footer_menu_items = [];

	$ocLazyLoad.load( [
		{
			name: 'ui.sortable'
		}
	] );
	$scope.init = function( id, node )
	{
		if( !node.completed )
		{
			Restangular.one( 'site', 'details' ).get().then( function( $menus )
			{
				angular.forEach( $menus.menu_items, function( value, key )
				{
					value.isOpen = false;
				} );

				angular.forEach( $menus.footer_menu_items, function( value, key )
				{
					value.isOpen = false;
				} );

				$scope.menu_items = $filter( 'orderBy' )( $menus.menu_items, 'sort_order' );
				$scope.footer_menu_items = $filter( 'orderBy' )( $menus.footer_menu_items, 'sort_order' );
				if( ($scope.menu_items && $scope.menu_items.length) || ($scope.footer_menu_items && $scope.footer_menu_items.length) )
				{
					$rootScope.parent_wizard.next( id, $scope.$parent );
				}
			} );
		}
	}

	$scope.current_node = $scope.$parent;

	$scope.open1 = function( next_item, menu )
	{
		var modalInstance = $modal.open( {
			templateUrl: 'templates/admin/site/appearance/menu-item-modal.html',
			controller: 'MenuItemModalInstanceCtrl',
			resolve: {
				next_item: function()
				{
					return next_item;
				},
				menu: function()
				{
					return menu;
				}
			}
		} );
	};

	$scope.sortableOptions = {
		stop: function( e, ui )
		{
			$scope.saveSettings();
		}
	};

	/*$rootScope.$watch('current_changed' , function(current_changed){
	 if(current_changed == $scope.current_node.id && parseInt($rootScope.site.is_completed)==0){
	 Restangular.all("siteMenuItem").getList({site_id : $rootScope.site.id}).then(function (response) {
	 if(response && response.length){
	 $rootScope.parent_wizard.next($scope.current_node.id , $scope.current_node);
	 }
	 });
	 }
	 }) */

	$scope.addMenuItem = function( newItem )
	{
		Restangular.all( "siteMenuItem" ).customPOST( $scope.newItem ).then( function( response )
		{
			response.isOpen = false;
			$scope.menu_items.push( response );
			toastr.success( "Success! Menu Item added" );
		} );
	}

	$scope.addFooterMenuItem = function( newItem )
	{
		Restangular.all( "siteFooterMenuItem" ).customPOST( $scope.newItem ).then( function( response )
		{
			response.isOpen = false;
			$scope.footer_menu_items.push( response );
			toastr.success( "Success! Footer Menu Item added!" );
		} );
	}

	$scope.updateMenuItem = function( menu_item )
	{
		var menu_clone = angular.copy( menu_item )
		delete menu_clone.isOpen;
		delete menu_clone.open;
		Restangular.all( "siteMenuItem" ).customPUT( menu_clone, menu_item.id ).then( function()
		{
			toastr.success( "Success! Menu Item saved" );
		} );
	}

	$scope.updateFooterItem = function( footer_menu_item )
	{
		var footer_menu_clone = angular.copy( footer_menu_item );
		delete footer_menu_clone.isOpen;
		Restangular.all( "siteFooterMenuItem" ).customPUT( footer_menu_clone, footer_menu_item.id ).then( function()
		{
			toastr.success( "Success! Footer Menu Item saved" );
		} );
	}

	$scope.deleteMenuItem = function( menu )
	{
		var modalInstance = $modal.open( {
			templateUrl: '/templates/modals/deleteConfirm.html',
			controller: "modalController",
			scope: $scope,
			resolve: {
				id: function()
				{
					return menu.id
				}
			}

		} );
		modalInstance.result.then( function()
		{
			Restangular.one( "siteMenuItem", menu.id ).remove().then( function()
			{
				toastr.success( "Success!  Menu Item deleted" );
				$scope.menu_items = _.without( $scope.menu_items, menu );
			} );
		} )
	};

	$scope.deleteFooterMenuItem = function( footer_menu )
	{
		var modalInstance = $modal.open( {
			templateUrl: '/templates/modals/deleteConfirm.html',
			controller: "modalController",
			scope: $scope,
			resolve: {
				id: function()
				{
					return footer_menu.id
				}
			}

		} );
		modalInstance.result.then( function()
		{
			Restangular.one( "siteFooterMenuItem", footer_menu.id ).remove().then( function()
			{
				toastr.success( "Success! Footer Menu Item deleted" );
				$scope.footer_menu_items = _.without( $scope.footer_menu_items, footer_menu );
			} );
		} )
	};

	$scope.saveSettings = function()
	{

		// Restangular.all("siteFooterMenuItem").customPUT(footer_menu_item, footer_menu_item.id).then(function () {
		// });
		if( !$scope.menu_items || !$scope.menu_items.length )
		{
			toastr.success( 'Please add at least one menu item to continue' );
			return;
		}

		$( ".menu_item" ).each( function( key, value )
		{
			console.log( key );
			$postMenuItem = $( value ).data( "component" );
			$postMenuItem.sort_order = key;
			delete $postMenuItem.isOpen;
			delete $postMenuItem.open;
			Restangular.all( "siteMenuItem" ).customPUT( $postMenuItem, $postMenuItem.id ).then( function()
			{
			} );
		} );

		$( ".footer_menu_item" ).each( function( key, value )
		{
			console.log( key );
			$postMenuItem = $( value ).data( "component" );
			$postMenuItem.sort_order = key;
			delete $postMenuItem.isOpen;
			Restangular.all( "siteFooterMenuItem" ).customPUT( $postMenuItem, $postMenuItem.id ).then( function()
			{
			} );
		} );

		Restangular.all( "siteMetaData" ).customPOST( $scope.sales_option, "save" ).then( function()
		{
			toastr.success( "Settings are saved" );
		} );
	}

	$scope.save = function()
	{
		$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
	}

	$scope.selectUrl = function( item, selected_url, show_next )
	{

		var api_resources = [ 'lesson', 'customPage', 'post', 'download', 'livecast', 'supportArticle' ];
		if( !selected_url )
		{
			return;
		}
		if( api_resources.indexOf( selected_url ) < 0 )
		{
			item.url = selected_url;
			if( item.type == 'menu_item' )
			{
				$scope.updateMenuItem( item );
			}
			else
			{
				$scope.updateFooterItem( item );
			}
			$scope.show_next = show_next;
			item.isOpen = false;
		}
		else if( selected_url == 'download' )
		{
			Restangular.all( '' ).customGET( 'download', { site_id: item.site_id } ).then( function( response )
			{
				var downloads = response;
				downloads.forEach( function( entity )
				{
					entity.url = entity.permalink;
				} )
				console.log( downloads )
				$scope.show_next = true;
				$scope.loaded_items = downloads;

			} )
		}
		else
		{
			Restangular.all( selected_url ).getList( { site_id: item.site_id } ).then( function( response )
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

	$scope.dragControlListeners = {
		accept: function( sourceItemHandleScope, destSortableScope )
		{
			//console.log(sourceItemHandleScope.itemScope.sortableScope.$id+" "+destSortableScope.$id);
			return sourceItemHandleScope.itemScope.sortableScope.$id == destSortableScope.$id;
		},
		itemMoved: function( $event )
		{
			console.log( "moved" + $event.source.sortableScope );
		},//Do what you want},
		orderChanged: function( $event )
		{
			console.log( "orderchange" + $event );
		},//Do what you want},
		containment: '#board'//optional param.
	};

	$scope.footerDragControlListeners = {
		accept: function( sourceItemHandleScope, destSortableScope )
		{
			//console.log(sourceItemHandleScope.itemScope.sortableScope.$id+" "+destSortableScope.$id);
			return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
		},
		itemMoved: function( $event )
		{
			console.log( "moved" + $event.source.sortableScope );
		},//Do what you want},
		orderChanged: function( $event )
		{
			console.log( "orderchange" + $event );
		},//Do what you want},
		containment: '#board'//optional param.
	};

} );

app.controller( 'accessWizardController', function( $rootScope, $scope, $http, $filter, $document, $localStorage, $location, $stateParams, Restangular, toastr )
{

	$scope.access_level = {};
	$scope.template_data = {
		use_cancel_method: true
	}
	$scope.default_currency = 'USD'
	$scope.current_node = $scope.$parent;
	/*$rootScope.$watch('current_changed' , function(current_changed){
	 if(current_changed == parseInt($scope.current_node.id) && parseInt($rootScope.site.is_completed)==0){
	 $scope.access_level.site_id = $rootScope.site.id;
	 Restangular.all("accessLevel").getList({site_id : $rootScope.site.id}).then(function (response) {
	 if(response && response.length){
	 $rootScope.parent_wizard.next($scope.current_node.id , $scope.current_node);
	 }
	 else{
	 Restangular.all('siteMetaData').customGETLIST("getOptions", ['currency']).then(function(response){
	 $scope.default_currency = response.length > 0 ? response[0].value : 'USD';
	 });

	 Restangular.all("facebook").customGET("groups").then(function(response){
	 $scope.facebook_groups = response;
	 })

	 }
	 });
	 }
	 }); */
	$scope.init = function( id, node )
	{
		if( !node.completed )
		{
			Restangular.all( "accessLevel" ).customGET( '', { site_id: $rootScope.site.id } ).then( function( response )
			{
				if( response && response.length )
				{
					$rootScope.parent_wizard.next( id, $scope.$parent );
				}
			} );
		}
	}
	$scope.payment_integrations = { stripe: [], paypal: [] };

	angular.forEach( $scope.site.integration, function( value, key )
	{
		if( value.type == 'stripe' )
		{
			$scope.payment_integrations.stripe.push( value );
		}
		if( value.type == 'paypal' )
		{
			$scope.payment_integrations.paypal.push( value );
		}
	} );

	if( _.findWhere( $scope.site.integration, { type: 'facebook' } ) )
	{
		$scope.facebook_integrated = true;
	}
	if( $scope.access_level.facebook_group_id )
	{
		$scope.access_level.facebook_group_id = $scope.access_level.facebook_group_id.toString();
	}
	console.log( $scope.access_level.facebook_group_id )
	var paypal = _.findWhere( $scope.site.integration, { type: 'paypal' } )
	var stripe = _.findWhere( $scope.site.integration, { type: 'stripe' } )

	if( stripe === undefined )
	{
		$scope.stripe_checkout = false;
	}
	else
	{
		$scope.stripe_checkout = true;
	}

	if( paypal === undefined || paypal.remote_id == '' )
	{
		$scope.paypal_checkout = false;
	}
	else
	{
		$scope.paypal_checkout = true;
	}

	console.log( "access levels: " + $scope.access_level );
	$scope.access_level.isOpen = false;

	$scope.save = function()
	{
		delete $scope.access_level.isOpen;
		delete $scope.access_level.type;
		delete $scope.access_level.url;
		$scope.create();
	}

	$scope.currencies = [
		{ id: 'USD', label: '$ - USD' },
		{ id: 'CAD', label: '$ - CAD' },
		{ id: 'AUD', label: '$ - AUD' },
		{ id: 'HKD', label: '$ - HKD' },
		{ id: 'EUR', label: '&euro; - EUR' },
		{ id: 'GBP', label: '&pound; - GBP' }
	];

	$scope.create = function()
	{
		Restangular.service( "accessLevel" ).post( $scope.access_level ).then( function( response )
		{
			toastr.success( "Access level created!" );
			$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
		} );
	}

	$scope.exists = function( id )
	{
		if( _.findWhere( $scope.access_level.grants, { grant_id: id } ) )
		{
			return true;
		}
	}

	$scope.paymentMethodExists = function( id )
	{
		var $return = false;
		angular.forEach( $scope.access_level.payment_methods, function( value, key )
		{
			if( value.payment_method_id == id )
			{
				$return = true;
			}
		} );

		return $return;
	}

	$scope.validPaymentMethod = function( method )
	{
		if( method.id == 2 && $scope.paypal_checkout == false )
		{
			return false;
		}
		if( method.id == 3 && $scope.stripe_checkout == false )
		{
			return false;
		}

		return true;
	}

	$scope.selectUrl = function( item, selected_url, show_next )
	{

		var api_resources = [ 'lesson', 'customPage', 'post', 'download', 'livecast', 'supportArticle' ];
		if( !selected_url )
		{
			return;
		}
		if( api_resources.indexOf( selected_url ) < 0 )
		{
			if( item.type == 'information_url' )
			{
				$scope.access_level.information_url = selected_url;
			}

			$scope.access_level.isOpen = false;

		}
		else if( selected_url == 'download' )
		{
			Restangular.all( '' ).customGET( 'download', { site_id: item.site_id } ).then( function( response )
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
			Restangular.all( selected_url ).getList( { site_id: item.site_id } ).then( function( response )
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
	$scope.cancel = function()
	{
		$rootScope.parent_wizard.cancel( $scope.current_node );
	}
} );

app.controller( 'postWizardController', function( $scope, $rootScope, $filter, $localStorage, Restangular, toastr )
{
	$scope.template_data = {
		title: 'Post',
		use_cancel_method: true,
		transcript: false,
		access_choice: false
	}

	$scope.next_item = {};
	$scope.current_node = $scope.$parent;
	/*$rootScope.$watch('current_changed' , function(current_changed){
	 $scope.next_item.site_id = $rootScope.site.id;
	 $scope.next_item.seo_settings = {};
	 if(current_changed == parseInt($scope.current_node.id) && parseInt($rootScope.site.is_completed)==0){
	 Restangular.all("post").getList({site_id : $rootScope.site.id}).then(function (response) {
	 if(response && response.length){
	 $rootScope.parent_wizard.next($scope.current_node.id , $scope.current_node);
	 }
	 });
	 }
	 });*/

	$scope.init = function( id, node )
	{
		if( !node.completed )
		{
			Restangular.all( "post" ).getList( { site_id: $rootScope.site.id } ).then( function( response )
			{
				if( response && response.length )
				{
					$rootScope.parent_wizard.next( id, $scope.$parent );
				}
			} );
		}
	}
	$scope.next_item.site_id = $rootScope.site.id;
	$scope.next_item.seo_settings = {};
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

	$scope.saveAsDraft = function()
	{
		if( $scope.next_item.permalink == '' )
		{
			this.onBlurTitle( null );
		}

		console.log( $scope.next_item.categories );
		delete $scope.next_item.most_used_categories;
		delete $scope.next_item.most_used_tags;
		delete $scope.next_item.access_level;
		if( $scope.next_item.access_level_type != 2 )
		{
			$scope.next_item.access_level_id = 0;
		}
		if( $scope.next_item.id )
		{

			$scope.next_item.put();
			$state.go( "admin.blogging.posts" );
			toastr.success( "Your post has been updated!" );

		}
		else
		{
			Restangular.all( 'post' ).post( $scope.next_item ).then( function( post )
			{


				$scope.next_item = post;
				toastr.success( "Post has been saved!" );
				$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );

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
		Restangular.all( 'post' ).post( $scope.next_item ).then( function( post )
		{
			$scope.next_item = post;
			toastr.success( "Post has been saved" );
			$rootScope.parent_wizard.next( $scope.current_node.id, $scope.current_node );
		} );
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
					console.log( data.file_name );
					var editor = $.summernote.eventHandler.getModule();
					file_location = '/uploads/' + data.file_name;
					editor.insertImage( $scope.editable, data.file_name );
				} ).error( function( data, status, headers, config )
			{
				console.log( 'error status: ' + status );
			} );
		}
	}

	$scope.cancel = function()
	{
		$rootScope.parent_wizard.cancel( $scope.current_node );
	}
} );

app.controller( 'lessonWizardController', function( $scope, $rootScope, $filter, $http, $localStorage, Restangular, toastr )
{
	$scope.template_data = {
		title: 'Lesson',
		use_cancel_method: true
	}

	//var $modules;
	$scope.modules = $rootScope.modules;
	$scope.$rootScope = $rootScope;
	$scope.next_item = {};

	$scope.hide_cancel_button = true;
	if( $scope.modules == undefined )
	{
		Restangular.all( 'module' ).customGET( '' ).then( function( response )
		{
			$scope.modules = response.items;
			if( $scope.modules.length > 0 )
			{
				$scope.next_item.module_id = $scope.modules[ 0 ].id;
			}
		} );
	}

	$rootScope.$watch( 'modules', function()
	{
		if( $rootScope.modules != undefined )
		{
			$scope.next_item.module_id = $rootScope.modules[ 0 ].id;
		}
	} )


	$scope.newModule = {};
	$scope.options = { theme: '' };
	$scope.current_node = $scope.$parent;
	$scope.next_item = {};
	/*$rootScope.$watch('current_changed' , function(current_changed){
	 if($rootScope.site){
	 $scope.site = $rootScope.site;
	 $scope.next_item.site_id = $rootScope.site.id;
	 $scope.next_item.seo_settings = {};
	 }
	 if(current_changed == $scope.current_node.id && parseInt($rootScope.site.is_completed)==0){
	 Restangular.all("lesson").customGET('',{site_id : $rootScope.site.id}).then(function (response) {
	 if(response && response.items && response.items.length){
	 $rootScope.parent_wizard.next($scope.current_node.id , $scope.current_node);
	 }
	 });
	 }
	 });*/

	$scope.init = function( id, node )
	{
		//if(!node.completed){
		Restangular.all( "lesson" ).customGET( '', { site_id: $rootScope.site.id } ).then( function( response )
		{
			if( response && response.items && response.items.length )
			{
				$scope.lessons = response.items;
				//$rootScope.parent_wizard.next(id , $scope.$parent);
			}
		} );
		//}
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

	$scope.next_item.dripfeed_settings = {};
	$scope.next_item.discussion_settings = {};
	$scope.next_item.transcript_content_public == 1 ? $scope.next_item.transcript_content_public = true : $scope.next_item.transcript_content_public = false;

	if( $scope.next_item.access_level_type == 3 )
	{
		$scope.next_item.access_level_type = 2;
	}

	$scope.next_item.seo_settings = {};
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

	$scope.saveModule = function( $model )
	{
		Restangular.all( 'module' ).post( $model ).then( function( module )
		{
			if( $rootScope.modules )
			{
				$rootScope.modules.push( module );
			}
			else
			{
				$rootScope.modules = [];
				$rootScope.modules.push( module );
			}
			toastr.success( "Module has been saved" );
			$scope.next_item.module_id = module.id;
			$scope.isOpen = false;

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

	$scope.cancel = function()
	{
		$rootScope.parent_wizard.cancel( $scope.current_node );
	}

	$scope.add = function()
	{
		$scope.adding = true;
		delete $scope.next_item.prev_lesson;
		delete $scope.next_item.next_lesson;
		delete $scope.next_item.total_lessons;
		delete $scope.next_item.access_level;
		delete $scope.next_item.current_index;
		delete $scope.next_item.module;
		delete $scope.next_item.site;


		$scope.next_item.site_id = $rootScope.site.id;
		$scope.next_item.title = $scope.next_item.title.trim();

		if( $scope.next_item.permalink == '' )
		{
			this.setPermalink( null );
		}

		if( $scope.next_item.permalink == '' )
		{
			notify( 'Permalink is required!' );
			return;
		}

		$scope.next_item.permalink = $scope.next_item.permalink.trim();
		$callback = "";

		if( $scope.next_item.access_level_type == 2 && $scope.next_item.access_level_id == 0 )
		{
			$scope.next_item.access_level_type = 3;
		}

		if( $scope.next_item.access_level_type != 2 )
		{
			$scope.next_item.access_level_id = 0;
		}

		$callback = Restangular.all( 'lesson' ).post( $scope.next_item );

		$callback.then( function( lesson )
		{

			$scope.next_item = {};
			if( $scope.lessons == undefined )
			{
				$scope.lessons = [];
				$scope.lessons.push( lesson );
			}
			else
			{
				$scope.lessons.push( lesson );
			}
			toastr.success( "Lesson has been saved" );
			$scope.adding = false;
			//$rootScope.parent_wizard.next($scope.current_node.id , $scope.current_node);
		} )

	}


	$scope.save = function()
	{
		$scope.saving = true;
		delete $scope.next_item.prev_lesson;
		delete $scope.next_item.next_lesson;
		delete $scope.next_item.total_lessons;
		delete $scope.next_item.access_level;
		delete $scope.next_item.current_index;
		delete $scope.next_item.module;
		delete $scope.next_item.site;


		if( $scope.next_item.permalink == '' )
		{
			this.setPermalink( null );
		}

		if( $scope.next_item.permalink != '' && $scope.next_item.title != '' && $scope.next_item.title != undefined )
		{
			$scope.next_item.site_id = $rootScope.site.id;
			$scope.next_item.title = $scope.next_item.title.trim();

			$scope.next_item.permalink = $scope.next_item.permalink.trim();
			$callback = "";

			if( $scope.next_item.access_level_type == 2 && $scope.next_item.access_level_id == 0 )
			{
				$scope.next_item.access_level_type = 3;
			}

			if( $scope.next_item.access_level_type != 2 )
			{
				$scope.next_item.access_level_id = 0;
			}

			$callback = Restangular.all( 'lesson' ).post( $scope.next_item );

			$callback.then( function( lesson )
			{

				$scope.next_item = {};
				if( $scope.lessons == undefined )
				{
					$scope.lessons = [];
					$scope.lessons.push( lesson );
				}
				else
				{
					$scope.lessons.push( lesson );
				}
				toastr.success( "Lesson has been saved" );
				$scope.saving = false;
				$rootScope.parent_wizard.next( 2, $scope.current_node );
			} )
		}
		else
		{
			toastr.success( "Lesson has been saved" );
			$scope.saving = false;
			$rootScope.parent_wizard.next( 2, $scope.current_node );
		}
	}

	$scope.delete = function( id )
	{

		var modalInstance = $modal.open( {
			templateUrl: 'templates/modals/deleteConfirm.html',
			controller: "modalController",
			scope: $scope,
			resolve: {
				id: function()
				{
					return id
				}
			}

		} );
		modalInstance.result.then( function()
		{
			var itemWithId = _.find( $scope.lessons, function( next_item )
			{
				return next_item.id === id;
			} );
			Restangular.one( 'lesson', id ).remove().then( function()
			{
				$scope.lessons = _.without( $scope.lessons, itemWithId );
			} );
		} )
	};
} );

app.controller( 'siteLogoWizardController', function( $scope, $rootScope, $filter, $http, $localStorage, Restangular, toastr )
{
	$scope.current_node = $scope.$parent;
	$scope.site_options = {};

	$scope.init = function( id, node )
	{
		//if(!node.completed){
		Restangular.all( "siteMetaData" ).customGETLIST( "getOptions", [ 'site_logo', 'logo_url' ] ).then( function( response )
		{
			if( response && response.length )
			{
				$scope.site_options.site_logo = response[ 0 ].value;
				//$rootScope.parent_wizard.next(id , $scope.current_node);
			}
		} );
		//}
	}

	$scope.save = function()
	{
		$scope.saving = true;
		Restangular.all( 'siteMetaData' ).customPOST( $scope.site_options, "save" ).then( function()
		{
			toastr.success( "Options are saved!" );
			$rootScope.parent_wizard.next( 0, $scope.current_node );
			$scope.saving = false;
		} );
	}
	$scope.cancel = function()
	{
		$rootScope.parent_wizard.cancel( $scope.current_node );
	}


} );

app.controller( 'modulesWizardController', function( $scope, $rootScope, $filter, $http, $localStorage, Restangular, toastr )
{
	$scope.current_node = $scope.$parent;
	$scope.module = { site_id: $rootScope.site.id };
	//$rootScope.modules = [];
	$scope.init = function( id, node )
	{
		//if(!node.completed){
		Restangular.all( "module" ).customGET( '', { site_id: $rootScope.site.id } ).then( function( response )
		{
			if( response && response.items && response.items.length )
			{
				//$rootScope.parent_wizard.next(id , $scope.current_node);
				$rootScope.modules = response.items;
				$scope.modules = $rootScope.modules;
			}
		} );
		//}
	}
	$scope.save = function()
	{
		if( $scope.module.title != undefined )
		{
			$scope.saving = true;
			Restangular.all( 'module' ).post( $scope.module ).then( function( response )
			{
				toastr.success( "Module added" );
				//$scope.modules.push(response);
				$rootScope.modules.unshift( response );
				$scope.saving = false;

			} );
		}
		$rootScope.parent_wizard.next( 1, $scope.current_node );
	}

	$scope.add = function()
	{
		if( $scope.module.title == '' || $scope.module.title == undefined )
		{
			toastr.error( 'Module name is required!' );
			return;
		}
		$scope.adding = true;
		Restangular.all( 'module' ).post( $scope.module ).then( function( response )
		{
			toastr.success( "Module added" );
			//$scope.modules.push(response);
			if( $rootScope.modules == undefined )
			{
				$rootScope.modules = [];
			}

			$rootScope.modules.unshift( response );
			$scope.adding = false;
			$scope.module = { site_id: $rootScope.site.id }
			//$rootScope.parent_wizard.next($scope.current_node.id , $scope.current_node);
		} );
	}

	$scope.delete = function( id )
	{

		var modalInstance = $modal.open( {
			templateUrl: 'templates/modals/deleteConfirm.html',
			controller: "modalController",
			scope: $scope,
			resolve: {
				id: function()
				{
					return id
				}
			}

		} );
		modalInstance.result.then( function()
		{
			var itemWithId = _.find( $scope.modules, function( next_item )
			{
				return next_item.id === id;
			} );
			Restangular.one( 'module', id ).remove().then( function()
			{
				$scope.modules = _.without( $scope.modules, itemWithId );
				$rootScope.modules = $scope.modules;
			} );
		} )
	};

	$scope.cancel = function()
	{
		$rootScope.parent_wizard.cancel( $scope.current_node );
	}

} );

app.controller( 'lockContentWizardController', function( $scope, $rootScope, $filter, $http, $localStorage, Restangular, toastr )
{
	$scope.current_node = $scope.$parent;
	$scope.access_levels = [
		{ "id": 1, "title": "Anyone" },
		{ "id": 3, "title": "Logged-in Users" },
		{ "id": 2, "title": "Restricted Members" }
	]

	$scope.access_type = 1;

	$scope.access = {};

	$scope.init = function( id, node )
	{
		//if(!node.completed){
		Restangular.all( "accessLevel" ).getList( { site_id: $rootScope.site.id } ).then( function( response )
		{
			if( response && response.length )
			{
				//$rootScope.parent_wizard.next(id , $scope.current_node);
			}
		} );
		//}
	}

	$scope.lock = function()
	{
		Restangular.all( 'accessLevel' ).customPOST( {
            access_level_type: $scope.access_type,
			name: $scope.access.access_level_name,// TODO: needs type added?
			site_id: $rootScope.site.id
		}, "lock" ).then( function( response )
		{
			toastr.success( "Content Locked" );
			$scope.current_node.extras = { "access_level": response.id };
			$rootScope.access_level_hash = response.hash;
			$rootScope.parent_wizard.next( 3, $scope.current_node );
		} );

	}

	$scope.cancel = function()
	{
		$rootScope.parent_wizard.cancel( $scope.current_node );
	}

    $scope.skip = function()
    {
        $rootScope.parent_wizard.next( 3, $scope.current_node );
    }

} );

app.controller( 'inviteMembersWizardController', function( $scope, $rootScope, $filter, $http, $localStorage, Restangular, toastr )
{
	$scope.current_node = $scope.$parent;
	$scope.members = {};
	$scope.access_level_hash = {};
	$scope.options = $rootScope.wizard_server && $rootScope.wizard_server.options ? $rootScope.wizard_server.options : {};
	console.log( $scope.options );
	if( !_.isEmpty( $scope.options ) )
	{
		$scope.options = JSON.parse( $scope.options );
		if( $scope.options.access_level )
		{
			Restangular.one( 'accessLevel', $scope.options.access_level ).get().then( function( response )
			{
				$scope.access_level = response;
			} );
		}
	}
	$scope.$rootScope = $rootScope;

	$scope.invite = function()
	{
		Restangular.one( "role" ).customPOST( $scope.members, 'import' ).then( function()
		{
			toastr.success( "Import was successful" );
			$rootScope.parent_wizard.next( 4, $scope.current_node );
		} );
	}

	$scope.cancel = function()
	{
		$rootScope.parent_wizard.cancel( $scope.current_node );
	}


} );