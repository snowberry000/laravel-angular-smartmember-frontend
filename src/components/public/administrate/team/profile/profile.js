var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.administrate.team.profile",{
			url: "/profile",
			templateUrl: "/templates/components/public/administrate/team/profile/profile.html",
			controller: "TeamProfileController"
		})
}); 

app.controller("TeamProfileController", function ($scope, $localStorage,$state, $rootScope , Restangular, toastr, $filter) {
  $company =null;
  $user=$rootScope.user;
  Restangular.one('company/getUsersCompanies').get().then(function(response){
    $company=response;
    $scope.company = {};
    if($company && $company.companies)
      $scope.company = _.find($company.companies, {selected : 1});
    $scope.company.display_name = $scope.company.display_name ? $scope.company.display_name : $scope.company.name;
  });
  

    $scope.onBlurTitle = function ($event) {
        if (! $scope.company.permalink)
            $scope.company.permalink = $filter('urlify')( $scope.company.name);
    }
    $scope.onBlurSlug = function ($event) {
        if ($scope.company.permalink)
            $scope.company.permalink = $filter('urlify')($scope.company.permalink);
    }
    
   $scope.save = function(){
     if(!$scope.company)
        return;
     
     var params = {
        'display_name' : $scope.company.display_name,
        'subtitle' : $scope.company.subtitle,
        'display_image' : $scope.company.display_image,
        'bio' : $scope.company.bio,
        'hide_revenue' : $scope.company.hide_revenue,
        'hide_sites' : $scope.company.hide_sites,
        'hide_members' : $scope.company.hide_members,
        'hide_total_lessons' : $scope.company.hide_total_lessons,
        'hide_total_downloads' : $scope.company.hide_total_downloads,
        'permalink' : $scope.company.permalink
     };

     Restangular.all('company').customPUT(params , $scope.company.id).then(function(response){
        toastr.success("Company settings were successfully saved!");
        $scope.company = response;
        $rootScope.current_company = $scope.company;
        $state.transitionTo($state.current, $state.params, { 
          reload: true, inherit: false, location: false
        });
     })
   }
});