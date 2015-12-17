var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("public.admin.account",{
			url: "/account",
			templateUrl: "/templates/components/public/admin/account/account.html",
			controller: "AccountController"
		})
}); 

app.controller('AccountController', function ($scope,$rootScope, $state, $location, $localStorage,$user ,Restangular, toastr) {
	$scope.user = $user;
	$scope.full_name = $scope.user.first_name + ' ' + $scope.user.last_name;
	$scope.full_name=$scope.full_name.trim();
	$scope.emailAdding=false;

	var user = Restangular.one('user' , $localStorage.user.id);
	if ($location.search().verification_hash)
	{
	        Restangular.one('linkedAccount/merge').customPOST({'verification_hash' :$location.search().verification_hash}).then(function(response){
	            if (response.status && response.status == 'OK')
	            {
	                toastr.success("Accounts linked");
	            }
	            $state.go("public.admin.account.settings", {}, {reload: true});
	        })
	}
	window.onbeforeunload = function (event) {
		if(!$scope.validate())
		{
		  var message = 'Image is not saved!';
		  if (typeof event == 'undefined') {
		    event = window.event;
		  }
		  if (event) {
		    event.returnValue = message;
		  }
		  return message;
		}
	}

	$scope.$on('$locationChangeStart', function (event, next, current) {
		$urlParsed=current.split('/');
		console.log($urlParsed[$urlParsed.length-1]=="photo");
		if(!$scope.validate()&&($urlParsed[$urlParsed.length-1]=="photo"))
		{
	        var answer = confirm("Image is not saved, Sure you want to leave?");
	        if (!answer) {
	            event.preventDefault();
	        }
    	}
    });

	$scope.validate=function(){
		return $rootScope.user.profile_image==$scope.user.profile_image;
	}

	$scope.saveName = function(full_name){
        $scope.full_name = full_name;
		full_name = full_name.split(' ');
		$scope.user.first_name = full_name.shift();
		$scope.user.last_name = full_name.join(' ');
		$rootScope.user.first_name=$scope.user.first_name.trim();
		$rootScope.user.last_name=$scope.user.last_name.trim();
		
		user.put({first_name : $scope.user.first_name , last_name : $scope.user.last_name}).then(function(response){
			$scope.user = response;
			$localStorage.user.first_name = response.first_name;
			$localStorage.user.last_name = response.last_name;
			toastr.success("Your name has been changed!");
		})
	}

	$scope.saveUsername = function(){
		user.put({username : $scope.user.username}).then(function(response){
			$scope.user = response;
			$localStorage.user.username = response.username;
			toastr.success("Your username has been changed!");
		})
	}

	$scope.saveEmail = function(){
		user.put({email : $scope.user.newemail}).then(function(response){
			$scope.user = response;
			$localStorage.user.email = response.email;
			toastr.success("Your email has been changed!");
		})
	}

	$scope.linkAccount = function(){
		if (! $scope.user.newemail) return;
		$scope.emailAdding=true;
		Restangular.all('linkedAccount').customPOST({email : $scope.user.newemail, link: 1} , 'link').then(function(response){
			$scope.emailAdding=false;
			if (response.status && response.status == 'OK')
			{
                toastr.success("Email successfully added");
				$scope.user.linked_accounts.push(response.account);
				console.log($scope.user.linked_accounts);
			}
			else 
			{
				if (response.message){
					toastr.error(response.message);
				}
				else{
					toastr.error("Something went wrong while linking the requested account");
				}
			}
			
		})
	}

	$scope.removeLinkedAccount = function(account){
		Restangular.one('linkedAccount' , account.id).remove().then(function(response){
			console.log(response);
			if (response && response.success == true)
			{
				toastr.success("Account successfully removed");
				$scope.user.linked_accounts = _.without($scope.user.linked_accounts , account)
			}
		})
	}

	$scope.togglePrimary = function(account){
		Restangular.all('linkedAccount').customPOST({id : account.id} , 'togglePrimary').then(function(response){
			if (response && response.status=='OK')
			{
				toastr.success("Primary account changed");
				$scope.user.email = account.linked_email;
				$scope.user.linked_accounts = _.without($scope.user.linked_accounts , account);
				$scope.user.linked_accounts.push(response.account);
			}
			else 
			{
				if (response.message){
					toastr.error(response.message);
				}
				else{
					toastr.error("Something went wrong while linking the requested account");
				}
			}
		})
	}

	$scope.merge = function(account){

		Restangular.all('linkedAccount').customPOST({id : account.id} , 'claim').then(function(response){
			if (response && response.success)
			{
				toastr.success('Verification email sent ');
                account.claimed = true;
			}
			else 
			{
				if (response.message){
					toastr.error(response.message);
				}
				else{
					toastr.error("Something went wrong while linking the requested account");
				}
			}
			
		})
	}

	$scope.resendVerification = function(email) {
		Restangular.one('user/resendVerification').customPOST({'email' : email}).then(function(response){
			if (response.status && response.status == 'OK')
			{
				toastr.success("Verification email sent!");
			}
		})
	}

	$scope.savePassword = function(current_password , newpassword){
		Restangular.all('user').customPOST({current_password : current_password , newpassword : newpassword } , 'changePassword').then(function(response){
			toastr.success("Your password has been changed!");
		})
	}

	$scope.saveProfileImage = function(){
		user.put({profile_image : $scope.user.profile_image}).then(function(response){
			$rootScope.user.profile_image = response.profile_image;
			$localStorage.user.profile_image = response.profile_image;
			toastr.success("Your profile picture has been changed!");
		})
	}
});
