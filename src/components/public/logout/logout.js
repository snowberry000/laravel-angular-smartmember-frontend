var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.logout",{
			url: "/logout",
			controller: "LogoutController"
		})
}); 

app.controller("LogoutController", function ($state, User) {
	User.signOut();
});