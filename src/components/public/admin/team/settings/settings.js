var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.team.settings",{
			url: "/settings",
			templateUrl: "/templates/components/public/admin/team/settings/settings.html",
			controller: "TeamSettingsController"
		})
}); 

app.controller("TeamSettingsController", function ($scope , $localStorage,$state, $rootScope , Restangular, toastr ) {
	
    $company=null;
    $user=$rootScope.user;
    Restangular.one('company/getUsersCompanies').get().then(function(response){
        $company=response;
        $scope.company = {};
        if($company && $company.companies)
            $scope.company = _.find($company.companies, {selected : 1})
    });

    

    $scope.save = function(){
        if(!$scope.company)
            return;
        Restangular.all('company').customPUT({name : $scope.company.name} , $scope.company.id).then(function(response){
            toastr.success("Company name successfully changed!");
            $rootScope.current_company = $scope.company;
            $state.reload();
        })
    }
});