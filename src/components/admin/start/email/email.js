var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.start.email",{
			url: "/email",
			templateUrl: "/templates/components/admin/start/email/email.html",
			controller: "EmailController"
		})
}); 

app.controller("EmailController", function ($scope , $location , $rootScope, RestangularV3 , $localStorage) {

	$scope.createUser = function(email){
		$scope.loading = true;
		RestangularV3.all('auth').customPOST({email : email} , 'companyregister').then(function(response){
			$scope.loading = false;
			$rootScope.new_user = response.user;
			$rootScope.new_user_company = response.company;
			$scope.next(email);
		});
	}

	$scope.next = function(email){
		$location.path('/start/options').search('email' , email);
	}
});