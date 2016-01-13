var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.app.support-tickets",{
			url: "/support-tickets",
			templateUrl: "/templates/components/public/app/support-tickets/support-tickets.html",
			controller: "PublicSupportTicketsController",
            data : {requiresLogin : true,state:"public.app.support-tickets" }
		})
}); 

app.controller('PublicSupportTicketsController', function ($scope, $site,$rootScope,$localStorage, $state, $stateParams,$filter, Restangular, toastr ) {
    $scope.loading=true;
    $rootScope.page_title=$rootScope.site.name+' - Support Tickets';
    Restangular.all('supportTicket').customGET('userTickets').then(function(response){
        $scope.loading=false;
        $tickets=response;
        $scope.tickets = $tickets;
    });
    
});