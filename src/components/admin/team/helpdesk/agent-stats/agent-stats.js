var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.helpdesk.agent-stats",{
			url: "/agent-stats",
			templateUrl: "/templates/components/admin/team/helpdesk/agent-stats/agent-stats.html",
			controller: "AgentStatsController",
			resolve: {
                $support_tickets: function(Restangular) {
                    return Restangular.all('').customGET('supportTicket?p=1');
                },
                $agents : function(Restangular , $site) {
                    return Restangular.all('role').customGET('agents');
                }
            }
		})
}); 

app.controller("AgentStatsController", function ($scope, $localStorage,$rootScope,$agents, $state, $user, $modal, Restangular, notify,$site,$unassigned_tickets , $my_open_tickets , $sites) {
	 $scope.agents=$agents;
	 $scope.user = $user;
	 $scope.my_open_tickets = $my_open_tickets.tickets;
	 $scope.sites = $sites.sites;
	 $scope.total_my_open_tickets = $my_open_tickets.count;
	 $scope.unassigned_tickets = $unassigned_tickets.tickets;
	 $scope.total_unassigned_tickets = $unassigned_tickets.count;
	 $scope.total_tickets = $scope.total_unassigned_tickets + $scope.total_my_open_tickets;
	 $scope.$parent.total_tickets = $scope.total_tickets;

	 $scope.ticket = {company_id : $sites.company_id , site_id : $sites.sites ? $sites.sites : []};

	 $scope.ticket.sites = $sites.sites;

	 $scope.selection = {ticketSelected : false , selectedTickets :[]};

	 $scope.parseResponse=function($support_tickets)
	 {
	     $scope.unassigned_tickets=[];
	     $scope.my_assigned_tickets=[];

	     for(var i=0;i<$support_tickets.length;i++) {

	         if($support_tickets[i].agent_id == 0 )
	             $scope.unassigned_tickets.push($support_tickets[i]);
	         else if( $support_tickets[i].agent_id == $user.id )
	             $scope.my_assigned_tickets.push($support_tickets[i]);

	     }
	 }

	 $scope.isAgent = function(agents){
	     var agent = _.findWhere(agents ,{user_id : $user.id});
	     if(agent){
	         return true;
	     }
	     return false;
	 }


	// $scope.parseResponse($support_tickets);
	 $scope.currentTickets = 1;
	 $scope.agents = $agents;
	 $rootScope.is_agent = true;
	 if(!$scope.isAgent($agents)){
	     $rootScope.is_agent = false;
	     $state.go('admin.account.memberships');
	 }

	 $scope.loadMore = function(){
	     $scope.disable = true;
	     Restangular.all('').customGET('supportTicket?p='+(++$scope.currentTickets)).then(function (response) {
	         $support_tickets = $support_tickets.concat(response);
	         //$scope.parseResponse($support_tickets);
	         if(response.length>0)
	             $scope.disable = false;
	     });
	 }

	 console.log($scope.agents);

	 $scope.openModal = function(){
	     var modalInstance = $modal.open({
	         templateUrl: '/templates/modals/ticket_modal.html',
	         controller: "modalController",
	         scope: $scope
	     });
	     modalInstance.result.then(function () {
	         if($scope.ticket.user_email)
	         {
	             $scope.ticket.user_id = $scope.ticket.user_email.id;
	             $scope.ticket.user_email = $scope.ticket.user_email.email;
	         }
	         var ticket = angular.copy($scope.ticket);
	         delete ticket.sites;
	         Restangular.all('supportTicket').post(ticket).then(function (response) {
	             response.user = $scope.ticket.user_name;
	             response.status = 'Open';
	             if(response.agent_id==0)
	                 $scope.unassigned_tickets.push(response);
	             else if(response.agent_id==$user.id)
	                 $scope.my_open_tickets.push(response);
	             $scope.ticket = {company_id : $scope.ticket.company_id , site_id : $scope.ticket.site_id , sites : $scope.ticket.sites};
	         });
	     })
	 }

	 $scope.$watch('selection.selectedTickets' , function(selectedTickets){
	     if(selectedTickets.length==0){
	         $scope.selection.ticketSelected = false;
	     }
	 })

	 $scope.selectionChange = function(ticket){
	     var exists = $scope.selection.selectedTickets.indexOf(ticket.id) >= 0;
	     if(exists){
	         $scope.selection.selectedTickets = _.without($scope.selection.selectedTickets , ticket.id);
	     }else{
	         $scope.selection.selectedTickets.push(ticket.id);
	         $scope.selection.ticketSelected = true;
	     }
	 }

	 $scope.updateMultiple = function(property , value){
	     var data = {property : property , value : value}
	     data.tickets = $scope.selection.selectedTickets;
	     Restangular.all('supportTicket').customPUT(data , 'bulk' ).then(function(response){
	         if(response.success){
	             $scope.my_open_tickets = _.reject($scope.my_open_tickets , function(item){ return $scope.selection.selectedTickets.indexOf(item.id)>=0 });
	             $scope.all_selected = false;
	         }
	     })
	 }

	 $scope.selectAll = function(){
	     $scope.all_selected = !$scope.all_selected;
	     for (var i = $scope.my_open_tickets.length - 1; i >= 0; i--) {
	         $scope.my_open_tickets[i].selected = $scope.all_selected;
	     };
	     if($scope.all_selected)
	         $scope.selection = {ticketSelected : true , selectedTickets:_.pluck($scope.my_open_tickets , 'id')}
	     else
	         $scope.selection = {ticketSelected : false , selectedTickets :[]};
	 }

	 $scope.search_users = function(search){
	     if(!search)
	         return;
	     Restangular.all('role').getList({site_id : $scope.ticket.site_id , q : search , count :10 }).then(function(response){
	         if(response.length==0){
	             //$scope.searched_users = [{email : search , fisrt_name : 'New User'}]
	             $scope.searched_users = _.pluck(response , 'user');
	         }else
	             $scope.searched_users = _.pluck(response , 'user');
	     })
	 }

	 $scope.siteUrl = function(ticket) {
	     var site = _.findWhere($scope.sites, {id: parseInt( ticket.site_id )}) || _.findWhere($scope.sites, {id: ticket.site_id + ''});

	     if( typeof site != 'undefined' )
	         return site.subdomain + '.smartmember.com';
	     else
	         return '';
	 }

	 $scope.customSort = function(ticket){
	     if(ticket.last_replied_at)
	         return ticket.last_replied_at
	     return ticket.created_at;
	 }
});