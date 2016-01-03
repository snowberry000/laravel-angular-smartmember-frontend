var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "public.administrate.team.helpdesk.tickets", {
			url: "/tickets",
			templateUrl: "/templates/components/public/administrate/team/helpdesk/tickets/tickets.html",
			controller: "TicketsController"
		} )
} );

app.controller( "TicketsController", function( $scope, $location, $localStorage, $rootScope, $state, Restangular, notify )
{
	$site = $rootScope.site;
	$user = $rootScope.user;

	$scope.tickets = [];
	$scope.type_to_fetch = 'open';

	$scope.ticket_users = [];
	$scope.currentPage = 1;
	$scope.itemsPerPage = 25;
	$scope.pagination = { currentPage: 1 };

	$scope.disable = false;
	$scope.requesting_data = false;

	$scope.FetchTickets = function()
	{
		$scope.requesting_data = true;

		var search_parameters = {
			p: $scope.pagination.currentPage,
			status: $scope.type_to_fetch,
			site_id: $site.id
		}

		Restangular.all( '' ).customGET( 'supportTicket', search_parameters ).then( function( response )
		{
			$scope.tickets[ $scope.pagination.currentPage ] = response.tickets;
			$scope.pagination.total_count = response.count;
			$scope.requesting_data = false;

			for( var i = $scope.tickets[ $scope.pagination.currentPage ].length - 1; i >= 0; i-- )
			{
				if( $scope.tickets[ $scope.pagination.currentPage ][ i ].agent != null && _.findLastIndex( $scope.ticket_users, { id: $scope.tickets[ $scope.pagination.currentPage ][ i ].agent.id } ) < 0 )
				{
					$scope.ticket_users.push( {
						"id": $scope.tickets[ $scope.pagination.currentPage ][ i ].agent.id,
						"user_name": $scope.tickets[ $scope.pagination.currentPage ][ i ].agent.first_name + ' ' + $scope.tickets[ $scope.pagination.currentPage ][ i ].agent.last_name,
						"email": $scope.tickets[ $scope.pagination.currentPage ][ i ].agent.email,
						"image": $scope.tickets[ $scope.pagination.currentPage ][ i ].agent.profile_image
					} );
				}
			};
		} );
	}

	$scope.$watch( 'type_to_fetch', function( new_value, old_value )
	{
		$scope.FetchTickets();

	}, true );

	$scope.startDate = new Date();
	$scope.endDate = new Date();
} );