var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.email.sendmail",{
			url: "/sendmail/:id?",
			params: {
				queueEmailData: null,
				job : false,
			},
			templateUrl: "/templates/components/public/administrate/team/email/sendmail/sendmail.html",
			controller: "SendmailController",
			resolve: {
				emailLists: function(Restangular , $site){
					return Restangular.all('emailList/sendMailLists').getList();
				},
				sites : function(Restangular){
					return Restangular.one('supportTicket').customGET('sites');
				},
				emails: function(Restangular , $site){
					return Restangular.all('email').getList();
				},
				accessLevels: function(Restangular , $site){
					return Restangular.all('accessLevel/sendMailAccessLevels').getList();
				},
				superAdmin: function( Restangular ) {
					return Restangular.one('user').customGET('isSuperAdmin');
				}
			}
		})
}); 

app.controller("SendmailController", function ($scope) {

});