var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.app.admin.support.creator", {
			url: "/creator",
			templateUrl: "/templates/components/public/app/admin/support/creator/creator.html",
			controller: "TicketCreatorController",
			resolve: {
				loadPlugin: function( $ocLazyLoad )
				{
					return $ocLazyLoad.load( [
						{
							name: 'ngSanitize'
						},
						{
							name: 'ui.select'
						}
					] );
				}
			}
		} )
} );

app.controller( "TicketCreatorController", function( $scope, $state, $localStorage, $rootScope, Restangular, toastr )
{
	$scope.ticket = {};
	$scope.agents = [];
	$scope.searched_users = [];

	

	Restangular.all( '' ).customGET( 'siteRole?type=support' ).then( function( response )
	{
		$scope.agents = response.items;
		$scope.agents = _.uniq(myArray, 'user_id');
	} );

	
	

	Restangular.one( 'supportTicket' ).customGET( 'sites' ).then( function( response )
	{
		$scope.sites = response.sites;
		$scope.ticket.company_id = response.company_id;
	} );

	$scope.getFileName = function( $fileName )
	{
		if( $fileName )
		{
			$splitted = $fileName.split( '/' );
			return $splitted[ $splitted.length - 1 ];
		}
		else
		{
			return "";
		}

	}

	$scope.search_users = function( search )
	{
		if( !search )
		{
			return;
		}
		Restangular.all( "" ).customGET( "siteRole", {
			site_id: $scope.ticket.site_id,
			q: search,
			count: 10
		} ).then( function( response )
		{
			if( response.items.length == 0 )
			{
				//$scope.searched_users = [{email : search , fisrt_name : 'New User'}]
				$scope.searched_users = _.pluck( response.items, 'user' );
				console.log( "searchedusers: " + $scope.searched_users );
			}
			else
			{
				$scope.searched_users = _.pluck( response.items, 'user' );
				console.log( "searchedusers: " + $scope.searched_users );
			}
		} );
	}

	$scope.validateEmail = function (email) {
	    var re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
	    return re.test(email);
	}

	$scope.save = function()
	{
		// alert($scope.validateEmail($scope.ticket.user_email));
		if(!$scope.ticket.user_email || !$scope.validateEmail($scope.ticket.user_email))
		{
			toastr.error('Email address required');
			return;
		}
			

		var ticket = angular.copy( $scope.ticket );

		ticket.user_id = ticket.user_email.id;
		ticket.user_email = ticket.user_email.email;
		ticket.site_id = $rootScope.site.id;

		Restangular.all( 'supportTicket' ).post( ticket ).then( function( response )
		{
			$rootScope.site.unread_support_ticket+=1;
			toastr.success( "Ticket Created successfully!" );
			$state.go('public.app.admin.support.tickets');
		} );
	}
} );