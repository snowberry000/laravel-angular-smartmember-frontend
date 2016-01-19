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

  

  // $scope.imageUpload = function(files , type){
  //   for (var i = 0; i < files.length; i++) {
  //       var file = files[i];
  //       Upload.upload({
  //           url: $scope.app.apiUrl + '/utility/upload',
  //           file: file
  //       })
  //       .success(function (data, status, headers, config) {
  //           var editor = $.summernote.eventHandler.getModule();
  //           file_location = '/uploads/'+data.file_name;
  //           if(type=='transcript')
  //               editor.insertImage($scope.editable2, data.file_name);
  //           else
  //               editor.insertImage($scope.editable, data.file_name);
  //           //$scope.lesson.content = $scope.lesson.content + '<img src=\''+data.file_name+'\'>'
  //       }).error(function (data, status, headers, config) {
  //     });
  //   }
  // }
    
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
        $scope.company = response;state.params
        $rootScope.current_company = $scope.company;
        $state.transitionTo($state.current, $state.params, { 
          reload: true, inherit: false, location: false
        });
     })
   }
});