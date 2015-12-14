var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.site.appearance.settings",{
			url: "/settings",
			templateUrl: "/templates/components/admin/site/appearance/settings/settings.html",
			controller: "SettingsController",
			resolve: {
				$site_options: function( Restangular )
				{
					return Restangular.all( 'siteMetaData' ).customGETLIST( "getOptions", [ 'site_logo', 'access_deny_image', 'logo_url', 'homepage_url','sign_box_border_size','sign_box_border_color','login_button_text','register_button_text','sign_button_text_color','sign_button_color','sign_bg_image' ] );
				}
			}
		})
}); 

app.controller("SettingsController", function ($scope, $rootScope, $localStorage, $location, $site , $site_options , $stateParams, $modal, Restangular, toastr) {
	 $scope.site_options = {};
	 $.each($site_options, function (key, data) {
	    $scope.site_options[data.key] = data.value;
	});
	 $scope.site_options.isOpen = false;
	 $rootScope.not_homepage_setting = false;

	 $scope.updateMenuItem = function ( model ) {
	     $scope.site_options.cap_icon = model.custom_icon;
	     $('#cap_icon i').attr('class','').addClass('fa ' + $scope.site_options.cap_icon );
	     delete $scope.site_options.open;
	 }

	 $scope.save = function () {
	     delete $scope.site_options.url;
	     delete $scope.site_options.open;
	     Restangular.all('siteMetaData').customPOST($scope.site_options, "save").then(function () {
	         toastr.success("Options are saved!");
	         $scope.site_options.isOpen = false;
	         $localStorage.homepage_url = $scope.site_options.homepage_url;
	     });
	 }

	 $scope.selectUrl = function(item , selected_url , show_next){
	 
	   var api_resources = ['lesson' , 'customPage' , 'post' , 'download' , 'livecast' , 'supportArticle', 'bridgePage'];
	   if(!selected_url)
	       return;
	   if(api_resources.indexOf(selected_url)<0)
	   {
	       item.url = selected_url;
	       $scope.site_options['homepage_url'] = selected_url;
	       $scope.show_next = show_next;
	       $scope.site_options.isOpen = false;
	   }
	   else if(selected_url == 'download'){
	     console.log(item.site_id)
	     Restangular.all('').customGET('download',{site_id: $site.id}).then(function(response){
	         var downloads = response.downloads;
	         downloads.forEach(function(entity){
	             entity.url = entity.permalink;
	         })
	         $scope.show_next = true;
	         $scope.loaded_items = downloads;
	           
	     })
	   }
	   else
	   {
	     Restangular.all(selected_url).getList({site_id: $site.id}).then(function(response){
	         if(response.route == 'customPage')
	             response.route = 'page';
	         if(response.route == 'supportArticle')
	             response.route = 'support-article';
	         response.forEach(function(entity){
	             entity.url = entity.permalink;
	         })
	         $scope.show_next = true;
	         $scope.loaded_items = response;
	           
	     })
	   }
	 }
});