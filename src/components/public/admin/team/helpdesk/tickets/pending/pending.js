var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.helpdesk.tickets.pending",{
			url: "/pending",
			templateUrl: "/templates/components/public/admin/team/helpdesk/tickets/pending/pending.html",
			controller: "PendingController"
		})
}); 

app.controller("PendingController", function ($scope ,$location, $localStorage,$rootScope, $state, $user, $modal, Restangular, notify,$site) {

	$scope.tickets=[];
	$scope.sites =[];
	$scope.ticket_users=[];
	$scope.currentPage = 1;
	$scope.itemsPerPage = 25;
	$scope.pagination = {currentPage : 1};
	
	$scope.disable = false;
	$scope.$parent.selection = {ticketSelected : false , selectedTickets :[]};
	
	Restangular.one('supportTicket').customGET('sites').then(function(response){
	    $scope.sites =response.sites;
	});
	
	if($location.search().assignee){
	    $scope.search = {agent_id : $location.search().assignee};
	}


	$scope.search={'startDate': moment().format("L"),'endDate': moment().add(1,'days').format("L"),date:'false','assignment':"all",'assignee':0,date_option:'',site_id:0};
	$scope.paginate = function(){
	    $scope.loading = true;
	    
	    var search_parameters = {
	        p: $scope.pagination.currentPage,
	        status: 'pending',
	        assignment: $scope.search.assignment,
	        assignee: $scope.search.assignee,
	        'start_date': $scope.search.startDate,
	        'end_date': $scope.search.endDate,
	        date: $scope.search.date
	    }

	    if( typeof $scope.search.site_id != 'undefined' && $scope.search.site_id != 0 )
	        search_parameters.site_id = $scope.search.site_id;

	    Restangular.all('').customGET('supportTicket',search_parameters).then(function (response) {
	        $scope.tickets[$scope.pagination.currentPage] = response.tickets;
	        $scope.pagination.total_count=response.count;
	        $scope.loading = false;
	        for (var i = $scope.tickets[$scope.pagination.currentPage].length - 1; i >= 0; i--) {
	            if( $scope.tickets[$scope.pagination.currentPage][i].agent != null && _.findLastIndex($scope.ticket_users, {id: $scope.tickets[$scope.pagination.currentPage][i].agent.id})<0)
	                $scope.ticket_users.push({"id": $scope.tickets[$scope.pagination.currentPage][i].agent.id, "user_name":$scope.tickets[$scope.pagination.currentPage][i].agent.first_name + ' ' + $scope.tickets[$scope.pagination.currentPage][i].agent.last_name,"email":$scope.tickets[$scope.pagination.currentPage][i].agent.email,"image":$scope.tickets[$scope.pagination.currentPage][i].agent.profile_image});
	        };
	    });
	}
	$scope.paginate();
	$scope.filterSearch=function()
	{
	    $scope.pagination.currentPage = 1;
	    $scope.tickets=[];
	    $scope.pagination.total_count = 0;
	    $scope.paginate();
	}

	$scope.updateMultiple = function(property , value){
	    var data = {property : property , value : value}
	    data.tickets = $scope.$parent.selection.selectedTickets;
	    Restangular.all('supportTicket').customPUT(data , 'bulk' ).then(function(response){
	        if(response.success){
	            if(property=='agent_id'){
	                for (var i = $scope.filtered_tickets.length - 1; i >= 0; i--) {
	                    if($scope.$parent.selection.selectedTickets.indexOf($scope.filtered_tickets[i].id) >= 0){
	                        var t= _.find(response.tickets , {id : $scope.filtered_tickets[i].id})
	                        $scope.filtered_tickets[i] = t;
	                    }
	                };
	            }
	            else{
	                $scope.filtered_tickets = _.reject($scope.filtered_tickets , function(item){ return $scope.$parent.selection.selectedTickets.indexOf(item.id)>=0 });
	                $scope.tickets = _.reject($scope.tickets , function(item){ return $scope.$parent.selection.selectedTickets.indexOf(item.id)>=0 });
	                $scope.total_items.total_items -= $scope.$parent.selection.selectedTickets.length;
	                $scope.filter();
	            }
	            $scope.$parent.selection = {ticketSelected : false , selectedTickets :[]};
	            $scope.all_selected = false;
	        }
	    })
	}

	$scope.selectAll = function(){
	    $scope.all_selected = !$scope.all_selected;
	    for (var i = $scope.filtered_tickets.length - 1; i >= 0; i--) {
	        $scope.filtered_tickets[i].selected = $scope.all_selected;
	    };
	    if($scope.all_selected)
	        $scope.$parent.selection = {ticketSelected : true , selectedTickets:_.pluck($scope.filtered_tickets , 'id')}
	    else
	        $scope.$parent.selection = {ticketSelected : false , selectedTickets :[]};
	}

	$scope.siteUrl = function(ticket) {
	    var site = _.findWhere($scope.sites, {id: parseInt( ticket.site_id )}) || _.findWhere($scope.sites, {id: ticket.site_id + ''});

	    if( typeof site != 'undefined' )
	        return site.subdomain + '.smartmember.com';
	    else
	        return '';
	}

	$scope.startDate=new Date();
	$scope.endDate=new Date();
});