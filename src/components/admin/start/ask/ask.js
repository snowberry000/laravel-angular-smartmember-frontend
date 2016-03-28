var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.start.ask",{
			url: "/ask",
			templateUrl: "/templates/components/admin/start/ask/ask.html",
			controller: "StartAskController"
		})
}); 

app.controller("StartAskController", function ($scope , Start , $location , RestangularV3) {
	$scope.step1 = 'completed';
	$scope.step2 = 'active';
	$scope.step3 = '';

	$scope.email = $location.search().email;
	Start.validate($scope.email);

	$scope.message_text = 'Hey, \n\n'
	+ 'I\'d love if you could install Smart Member for me. I\'ll get an email when the installation is complete. Todd, an engineer at Smart Member, is CC\'d if you have any questions. \n\n'
	+ '{{ INSTALL_LINK }}\n\n'
	+ 'Thanks.';

	$scope.sendEmail = function(){
		$scope.loading = true;
		RestangularV3.all('message').customPOST({to : $scope.receiver , 'from' : $scope.email , 'message' : $scope.message_text} , 'ask').then(function(response){
			$scope.loading = false;
			$location.path('/start/account/register').search('email' , $scope.email);
		})
	}
});