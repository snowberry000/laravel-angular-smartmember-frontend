var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.team.integrations.facebook_group",{
			url: "/facebook_group/:add_group?",
			templateUrl: "/templates/components/admin/team/integrations/facebook_group/facebook_group.html",
			controller: "FacebookGroupController"
		})
}); 

app.controller("FacebookGroupController", function ($scope, toastr,$localStorage, $modal, Restangular, $http, notify,Facebook) {
		$scope.facebook_groups = [];
		$scope.group_id = {}
		$scope.group_id.selected = $scope.site.is_admin ? 0 : $scope.site.facebook_group_id
		Restangular.one('facebook').customGET('groups-joined', {user_id: $localStorage.user.id}).then(function(response){

	        if( response.length > 0 ) {
	            angular.forEach(response, function (value, key) {
	                $scope.facebook_groups.push(value);
	            });
	        }

			if ($scope.facebook_groups.length == 0)
				$scope.facebook_groups = false;

			$scope.show_add_group = false;

			if ($scope.site.facebook_app_id){
				$scope.show_add_group = true;
			}
		});
		var user_options = {};
		$scope.joinGroup = function(group_id){
			console.log(group_id)

	        group = _.findWhere( $scope.site.integration, {type:'facebook_group',remote_id: group_id}) || _.findWhere( $scope.site.integration, {type:'facebook_group',remote_id: group_id + ''});

	        FB.init({
	            appId      : group.username,
	            xfbml      : true,
	            version    : 'v2.4'
	        });

	        FB.login(function(response){
	            var user_id = response.authResponse.userID;

	            $http.put($scope.app.apiUrl + "/user/" + $localStorage.user.id ,{facebook_user_id: user_id}).then(function(response){
	                FB.ui({
	                    method: 'game_group_join',
	                    id: group.remote_id
	                }, function(response) {
	                    if (response.added == true) {
	                        swal('Congratulations, you have joined our Facebook Group!', 'You can access the group at any time by clicking the Facebook icon on the right side of the members area.');
	                        user_options.fb_group_joined = group.remote_id;
	                        Restangular.all('user').customPOST({user_options: user_options, user_id: $localStorage.user.id}, "saveFacebookGroupOption").then(function(response){
	                            $scope.facebook_groups = response;
	                        });
	                    } else {
	                        if (response.error_code == 4001){
	                            user_options.fb_group_joined = group.remote_id;
	                            Restangular.all('user').customPOST({user_options: user_options, user_id: $localStorage.user.id}, "saveFacebookGroupOption").then(function(response){
	                                swal("You are already a member of this group");
	                                $scope.facebook_groups = response;
	                            });
	                        }
	                    }
	                });
	            })
	        }, {scope: ''});

		}

	    $scope.saveGroup = function(group_id) {
	        $http.post($scope.app.apiUrl + "/saveAlFb/" + group_id, {access_levels: $scope.site.fb_group_access_levels}).then(function(response) {
	            // notify({
	            //         message:'Your group access levels have been saved',
	            //         classes: 'alert-success',
	            //         templateUrl : 'templates/modals/notifyTemplate.html'
	            //     });
	            toastr.success('Your group access levels have been saved', 'Toastr fun!');

	        });
	    }

		$scope.addGroup = function(){
			$scope.showDialog();
		}

		$scope.setAppId = function(){
			$http.put($scope.app.apiUrl + "/site/" + $scope.site.id,
				{
					facebook_app_id: $scope.site.facebook_app_id,
					facebook_secret_key: $scope.site.facebook_secret_key
				}).success(function(){
					$scope.show_add_group = true;
				});
		}

		$scope.showDialog = function(app_id){
			console.log($scope.site.facebook_app_id)
			FB.init({
		      appId      : $scope.site.facebook_app_id,
		      xfbml      : true,
		      version    : 'v2.4'
		    });

			FB.login(function(){
	 			FB.ui({
				  method: 'game_group_create',
				  name: 'My Test Group',
				  description: 'A description for the test group',
				  privacy: 'CLOSED',
				},
				function(response) {
					
									
				    if (response && response.id) {
				    	FB.api('/' +  response.id, function(group){
				    		console.log("Facebook", group);
				    		$http.post($scope.app.apiUrl + '/facebook/setgroup',{
					    		"group_id": response.id.toString(),
					    		"username": group.name,
					    		"password": group.privacy, 
					    	}).success(function(res){
					    		$scope.facebook_groups.push(res);
					    	})
				    	});
				    	
				    } else {

				    }
				 }
				);
			}, {scope: ''});		
		}
});