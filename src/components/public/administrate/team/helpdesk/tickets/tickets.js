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

app.controller( "TicketsController", function( $scope, $location, $localStorage, $rootScope, $state, Restangular, $timeout )
{
	$site = $rootScope.site;
	$user = $rootScope.user;

    Restangular.all('user/sites').getList({capability: 'manage_support_tickets'}).then(function(response){
        response.sort(function(a,b){
            var first_one = a.domain && a.domain != '' ? a.domain : a.subdomain + '.smartmember.' + $scope.app.env;
            var second_one = b.domain && b.domain != '' ? b.domain : b.subdomain + '.smartmember.' + $scope.app.env;

            if( first_one > second_one )
                return 1;
            else if( second_one > first_one )
                return -1;
            else
                return 0;
        });

        $scope.available_sites = response;
        $timeout(function(){
            //couldn't figure out what the directive should be to do this...
            $('.ui.dropdown').dropdown();
        })
    });

	$scope.tickets = [];
	$scope.type_to_fetch = 'open';

	$scope.ticket_users = [];
	$scope.current_page = 1;
	$scope.itemsPerPage = 25;
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	$scope.sortTicket = {};
    $scope.ticket_query = '';

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.FetchTickets();
		}
	} );

	$scope.disable = false;
	$scope.requesting_data = false;

	$scope.sortTickets = function($type) {
		$scope.pagination.current_page = 1;
		$scope.sortTicket.type = $type;
		$scope.FetchTickets();
	}

    $scope.searchTickets = function() {
        $scope.pagination.current_page = 1;
        $scope.FetchTickets();
    }

    $scope.sites = [
        $site.id
    ];

	$scope.FetchTickets = function()
	{
		$scope.requesting_data = true;

		var search_parameters = {
			p: $scope.pagination.current_page,
			status: $scope.type_to_fetch,
			sortBy: $scope.sortTicket.type
		}

        if( $scope.ticket_query )
            search_parameters.q = $scope.ticket_query;

        if( $scope.sites && $scope.sites.length > 0 ) {
            search_parameters.sites = $scope.sites.join(',');
        }

		Restangular.all( '' ).customGET( 'supportTicket', search_parameters ).then( function( response )
		{
			$scope.tickets[ $scope.pagination.current_page ] = response.tickets;
			$scope.pagination.total_count = response.count;
			$scope.requesting_data = false;

			for( var i = $scope.tickets[ $scope.pagination.current_page ].length - 1; i >= 0; i-- )
			{
				if( $scope.tickets[ $scope.pagination.current_page ][ i ].agent != null && _.findLastIndex( $scope.ticket_users, { id: $scope.tickets[ $scope.pagination.current_page ][ i ].agent.id } ) < 0 )
				{
					$scope.ticket_users.push( {
						"id": $scope.tickets[ $scope.pagination.current_page ][ i ].agent.id,
						"user_name": $scope.tickets[ $scope.pagination.current_page ][ i ].agent.first_name + ' ' + $scope.tickets[ $scope.pagination.current_page ][ i ].agent.last_name,
						"email": $scope.tickets[ $scope.pagination.current_page ][ i ].agent.email,
						"image": $scope.tickets[ $scope.pagination.current_page ][ i ].agent.profile_image
					} );
				}
			};
		} );
	}

	$scope.$watch( 'type_to_fetch', function( new_value, old_value )
	{
		$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};
		$scope.FetchTickets();

	}, true );

	$scope.startDate = new Date();
	$scope.endDate = new Date();
} );