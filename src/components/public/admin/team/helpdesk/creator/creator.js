var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.admin.team.helpdesk.creator", {
			url: "/creator",
			templateUrl: "/templates/components/public/admin/team/helpdesk/creator/creator.html",
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

app.controller( "TicketCreatorController", function( $scope, $localStorage, $rootScope, $state, smModal, Restangular, toastr )
{
	$scope.ticket = {};
	$scope.agents = [];
	$scope.searched_users = [];

	Restangular.all( 'siteRole' ).getList( { type: 'support' } ).then( function( response )
	{
		$scope.agents = response;
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

	$scope.save = function()
	{
		var ticket = angular.copy( $scope.ticket );

		ticket.user_id = ticket.user_email.id;
		ticket.user_email = ticket.user_email.email;
		ticket.site_id = $rootScope.site.id;

		Restangular.all( 'supportTicket' ).post( ticket ).then( function( response )
		{
			toastr.success( "Ticket Created successfully!" );
			smModal.Show('public.admin.team.helpdesk.tickets');
		} );
	}
} );