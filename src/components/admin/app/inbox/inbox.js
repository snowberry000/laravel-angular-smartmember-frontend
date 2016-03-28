var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.inbox", {
			url: "/inbox",
			templateUrl: "/templates/components/admin/app/inbox/inbox.html",
			controller: "InboxController"
		} )
} );

app.controller( "InboxController", function( $scope, $location, smModal, $timeout, $rootScope, $localStorage, $stateParams, $state, $filter, Restangular, RestangularV3 , notify)
{
	$user = $rootScope.user;
	$rootScope.page_title = "Conversations";
	$scope.date_order = 'desc';

	$scope.getAgents = function (){
		RestangularV3.all( '' ).customGET('ticket/getAgentId').then( function( data )
		{
			$scope.company_agents = data;
		} );
	}
	
	$scope.tickets = [];
	$scope.type_to_fetch = 'open';
	$scope.agent_to_fetch = 'all';

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

	//$scope.SetGridClasses( 'autoflow' );
	
	$scope.SetCurrentConversation = function( next_value )
	{
		$scope.current_conversation = next_value;
	};

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.FetchTickets();
		}
	} );

	$scope.disable = false;
	$scope.requesting_data = false;

	$scope.sortTickets = function( $type )
	{
		$scope.pagination.current_page = 1;
		$scope.sortTicket.type = $type;
		$scope.FetchTickets();
	}

	$scope.searchTickets = function()
	{
		$scope.pagination.current_page = 1;
		$scope.FetchTickets();
	}



	$scope.ticketsOrder = function(orderby)
	{
		if(orderby == 'asc'){
			$scope.date_order = 'asc';
			$scope.FetchTickets();
		}else{
			$scope.date_order = 'desc';
			$scope.FetchTickets();
		}
	}

	$scope.FetchByType = function(type){

		if(type == 'open' || type == 'closed'){
			$scope.type_to_fetch = type;
		}else{
			$scope.type_to_fetch = 'open';
		}
		$scope.FetchTickets();
	}


	$scope.FetchTickets = function()
	{
		$scope.requesting_data = true;


		var search_parameters = {
			p: $scope.pagination.current_page,
			status: $scope.type_to_fetch
			// sortBy: $scope.sortTicket.type,
		}

		if($scope.agent_to_fetch != 'all')
		{
			search_parameters.agent_id = $scope.agent_to_fetch;
		}
		if($scope.date_order)
		{
			search_parameters.orderBy = $scope.date_order;
			search_parameters.orderByColumn = 'created_at';
		}

		

		if( $scope.sites && $scope.sites.length > 0 )
		{
			search_parameters.sites = $scope.sites.join( ',' );
		}

		RestangularV3.all( 'ticket' ).customGET('',search_parameters ).then( function( response )
		{
			$scope.tickets[ $scope.pagination.current_page ] = response.items;
			$scope.pagination.total_count = response.total_count;
			$scope.requesting_data = false;
			// if(!$scope.agents){
			// 	$scope.agents = $filter('orderBy')(response.agents, "agent.first_name"); // Update agents only when is agent model is empty..
			// }

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
			}
			;

			$scope.getAgents();
		} );
	}

	$scope.showSite = function( site_id )
	{
		var site = _.findWhere( $scope.available_sites, { id: site_id } );
		return site.domain ? site.domain : site.subdomain + '.smartmember.' + $rootScope.app.env
	}

	$scope.addTag = function(){
		var filteredData = _.filter($scope.data, function(temp){ return temp.is_checked });
		smModal.Show(null , {} , {templateUrl : 'templates/modals/tag.html' , controller : 'tagController'} , null , {data : filteredData , filters : $scope.filters});

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