var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.site.appearance.menus", {
			url: "/menus",
			templateUrl: "/templates/components/public/administrate/site/appearance/menus/menus.html",
			controller: "MenusController",
			// resolve: {
			// 	loadPlugin: function ($ocLazyLoad) {
			// 		return $ocLazyLoad.load([
			// 			{
			// 				name: 'ui.sortable'
			// 			},
			// 			{
			//                          name: 'ui-iconpicker',
			//                          files: ['bower/ui-iconpicker/dist/scripts/ui-iconpicker.min.js']
			//                      }
			// 		]);
			// 	}

			// }
		} )
} );

app.controller( "MenusController", function( $rootScope, $scope, $filter, smModal, $document, $localStorage, $location, $stateParams, Restangular, toastr )
{
	$scope.sales_option = {};
	$site = $rootScope.site;
	$menus = null;

	$scope.resolve = function()
	{
		Restangular.one( 'site', 'details' ).get().then( function( response )
		{
			$menus = response;
			$scope.init();
		} );
	}

	$scope.init = function()
	{
		$.each( $menus.meta_data, function( key, data )
		{
			$scope.sales_option[ data.key ] = data.value;
		} );

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

	}


	$scope.open = function( next_item, menu )
	{
		$rootScope.menuType = menu;
		if( menu == 'footer' )
		{
			smModal.Show( "public.administrate.site.appearance.footerMenuItem", { id: next_item.id, modal_options: { allowMultiple: true } } );
		}
		else
		{
			smModal.Show( "public.administrate.site.appearance.menu", { id: next_item.id, modal_options: { allowMultiple: true } } );
		}
	};

	// $scope.open2 = function (next_item, menu) {
	//     var modalInstance = $modal.open({
	//         templateUrl: 'templates/modals/footer-menu-item-modal.html',
	//         controller: 'MenuItemModalInstanceCtrl',
	//         resolve: {
	//             next_item: function(){
	//                 return next_item;
	//             },
	//             menu: function(){
	//                 return menu;
	//             }
	//         }
	//     });
	// };

	$scope.sortableOptions = {
		stop: function( e, ui )
		{
			$scope.saveSettings();
		}
	};


	$scope.addMenuItem = function( newItem )
	{
		//$scope.newItem.url='';
		Restangular.all( "siteMenuItem" ).customPOST( $scope.newItem ).then( function( response )
		{
			response.isOpen = false;
			$scope.newItem = {};
			$scope.menu_items.unshift( response );
			$rootScope.site.menu_items.unshift(response);
			toastr.success( "Success! Menu Item added" );
		} );
	}

	$scope.addFooterMenuItem = function( newItem )
	{
		//$scope.newFooterItem.url='';
		Restangular.all( "siteFooterMenuItem" ).customPOST( $scope.newFooterItem ).then( function( response )
		{
			response.isOpen = false;
			$scope.newFooterItem = {};
			$scope.footer_menu_items.unshift( response );
			$rootScope.site.footer_menu_items.unshift(response);
			toastr.success( "success! Footer Menu Item added" );
		} );
	}

	$scope.updateMenuItem = function( menu_item )
	{
		var menu_clone = angular.copy( menu_item )
		delete menu_clone.isOpen;
		delete menu_clone.open;
		Restangular.all( "siteMenuItem" ).customPUT( menu_clone, menu_item.id ).then( function()
		{
			toastr.success( "Success! Menu Item saved!" );
		} );
	}

	$scope.updateFooterItem = function( footer_menu_item )
	{
		var footer_menu_clone = angular.copy( footer_menu_item );
		delete footer_menu_clone.isOpen;
		Restangular.all( "siteFooterMenuItem" ).customPUT( footer_menu_clone, footer_menu_item.id ).then( function()
		{
			toastr.success( "Success! Footer Menu Item saved!" );
		} );
	}

	$scope.deleteResource = function( menu )
	{
		menu = JSON.parse( menu );
		//console.log( menu );
		if( menu && (typeof menu.icon) != 'undefined' )
		{
			var itemWithId = _.find( $scope.menu_items, function( next_item )
			{
				return next_item.id == menu.id;
			} );
			Restangular.one( "siteMenuItem", menu.id ).remove().then( function()
			{
				toastr.success( "Success!  Menu Item deleted!" );
				$scope.menu_items = _.without( $scope.menu_items, itemWithId );
			} );
		}
		else if( menu )
		{
			var itemWithId = _.find( $scope.footer_menu_items, function( next_item )
			{
				return next_item.id == menu.id;
			} );
			Restangular.one( "siteFooterMenuItem", menu.id ).remove().then( function()
			{
				toastr.success( "Success! Footer Menu Item deleted!" );
				$scope.footer_menu_items = _.without( $scope.footer_menu_items, itemWithId );
			} );
		}

	};

	$scope.deleteFooterMenuItem = function( footer_menu )
	{
		Restangular.one( "siteFooterMenuItem", footer_menu.id ).remove().then( function()
		{
			toastr.success( "Success! Footer Menu Item deleted!" );
			$scope.footer_menu_items = _.without( $scope.footer_menu_items, footer_menu );
		} );
	};

	$scope.saveSettings = function()
	{

		// Restangular.all("siteFooterMenuItem").customPUT(footer_menu_item, footer_menu_item.id).then(function () {
		// });
		$( ".menu_item" ).each( function( key, value )
		{

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

			$postMenuItem = $( value ).data( "component" );
			$postMenuItem.sort_order = key;
			delete $postMenuItem.isOpen;
			Restangular.all( "siteFooterMenuItem" ).customPUT( $postMenuItem, $postMenuItem.id ).then( function()
			{
			} );
		} );

		Restangular.all( "siteMetaData" ).customPOST( $scope.sales_option, "save" ).then( function()
		{
			toastr.success( "Settings are saved!" );
		} );
	}

	$scope.selectUrl = function( item, selected_url, show_next )
	{

		var api_resources = [ 'lesson', 'customPage', 'post', 'download', 'livecast', 'supportArticle' , 'bridgePage'];
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
				//console.log( downloads )
				$scope.show_next = true;
				$scope.loaded_items = downloads;

			} )
		}
		else
		{
			Restangular.all( selected_url ).customGET( '', { site_id: item.site_id } ).then( function( response )
			{
				if( response.route == 'customPage' )
				{
					response.route = 'page';
				}
				if( response.route == 'supportArticle' )
				{
					response.route = 'support-article';
				}
				response.items.forEach( function( entity )
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
			////console.log(sourceItemHandleScope.itemScope.sortableScope.$id+" "+destSortableScope.$id);
			return sourceItemHandleScope.itemScope.sortableScope.$id == destSortableScope.$id;
		},
		itemMoved: function( $event )
		{
			//console.log( "moved" + $event.source.sortableScope );
		},//Do what you want},
		orderChanged: function( $event )
		{
			//console.log( "orderchange" + $event );
		},//Do what you want},
		containment: '#board'//optional param.
	};

	$scope.footerDragControlListeners = {
		accept: function( sourceItemHandleScope, destSortableScope )
		{
			////console.log(sourceItemHandleScope.itemScope.sortableScope.$id+" "+destSortableScope.$id);
			return sourceItemHandleScope.itemScope.sortableScope.$id === destSortableScope.$id;
		},
		itemMoved: function( $event )
		{
			//console.log( "moved" + $event.source.sortableScope );
		},//Do what you want},
		orderChanged: function( $event )
		{
			//console.log( "orderchange" + $event );
		},//Do what you want},
		containment: '#board'//optional param.
	};

	$scope.resolve();
} );
