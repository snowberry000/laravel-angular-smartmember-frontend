var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider.state("admin.app.change-password",{
		url: '/change-password',
		templateUrl: "/templates/components/admin/app/change-password/change-password.html",
		controller: "ChangePasswordController"
	})
});

app.controller("ChangePasswordController", function($scope, $localStorage, toastr, smModal, RestangularV3){

	$scope.user = $localStorage.user;
	

	$scope.changePassword = function(current_password, new_password, new_password2) {
		
		if(new_password!=new_password2) {
			toastr.error("New password and Re-Entered new password doesn't match");
		}
		else if(new_password.length<6)
		{
			toastr.error("Password must have atleast 6 characters");
		}
		else {
			RestangularV3.all('user').customPOST({current_password : current_password , newpassword : new_password } , 'verifyUser').then(function(response){
				if(response.verified == true) {
					toastr.success("Your password has been changed!");
					smModal.Close("admin.app.change-password");
				}
				else {
					toastr.error('Password not changed, wrong current password entered');
				}
			});
		}
	}

})