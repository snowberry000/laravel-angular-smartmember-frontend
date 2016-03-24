var app = angular.module("app");

app.config(function($stateProvider) {
	$stateProvider.state("admin.app.smart-sites.settings.general",{
		url: '/general',
		templateUrl: '/templates/components/admin/app/smart-sites/settings/general/general.html',
		controller: 'AdminAppSmartSitesSettingsGeneralController'
	})
});

app.controller('AdminAppSmartSitesSettingsGeneralController', function($scope, $localStorage, RestangularV3, toastr, smModal) {

	$scope.ticket=[];
	$scope.user={};
	$scope.ticket.site_id = $scope.user.company_id;
	$scope.togglePassword = false;

	$scope.image_change =false;

	var user = RestangularV3.one('user' , $localStorage.user.id);
	user.get().then(function(response) {
		console.log(response);
		$localStorage.user = response;
		$scope.user = response;
	});
	
	// console.log($scope.user);

	$scope.saveChanges = function(currentPassword) {
		RestangularV3.all('user').customPOST({current_password : currentPassword} , 'verifyUser').then(function(response){
			
			if(response.verified == true) {
				user.put({first_name : $scope.user.first_name,last_name : $scope.user.last_name, email: $scope.user.email}).then(function(response){
					$scope.user = response;
					$localStorage.user.username = response.username;
					$localStorage.user.email = response.email;
					toastr.success("Your profile details has been changed!");
				});
			}
			else {
				toastr.error('Changes not saved, wrong current password entered');
			}
		})
	}

	$scope.showChangePasswordModal = function() {

		smModal.Show("admin.app.change-password");
	}

	$scope.imageUpdate = function() {
		$scope.image_change = true;
	}

	
	$scope.saveProfileImage = function(){
		user.put({profile_image : $scope.user.profile_image}).then(function(response){
			$scope.user.profile_image = response.profile_image;
			$localStorage.user.profile_image = response.profile_image;
			toastr.success("Your profile picture has been changed!");
		})
	}
})