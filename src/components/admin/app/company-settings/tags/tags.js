var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider.state("admin.app.company-settings.tags",{
		url: '/tags',
		templateUrl: '/templates/components/admin/app/company-settings/tags/tags.html',
		controller: 'TagsInSettingsController'
	});
})

app.controller('TagsInSettingsController', function($scope, RestangularV3, $localStorage, $timeout, toastr){

	$scope.tagResponse = false;
	RestangularV3.all('tag/get').customGET().then(function(response){
			$scope.allTags = response;
			$scope.tagResponse = true;
		});

	$scope.showAll = function(){

		RestangularV3.all('tag/toggle_all').post({status: 'enable'}).then(function(response){
			if(response != 'true'){
				toastr.error('Oops! Something went wrong. Please try again.');
			}else{
				toastr.success('Success! All tags are now visible.');
				$timeout(function(){
					location.reload();
				},500);
			}
		});

	}

	$scope.hideAll = function(){

		RestangularV3.all('tag/toggle_all').post({status: 'disable'}).then(function(response){
			if(response != 'true'){
				toastr.error('Oops! Something went wrong. Please try again.');
			}else{
				toastr.success('Success! All tags are now hidden.');
				$timeout(function(){
					location.reload();
				},500);
			}
		});
	}

	$scope.toggle = function(id){

		$scope.finalStatus = 'enable;'

		for(var i = 0; i < $scope.allTags.length; i++){	
			if($scope.allTags[i]._id == id){
				var tempStatus= $scope.allTags[i].status;
				$scope.finalStatus = tempStatus == 'enable' ? 'disable' : 'enable';
			}
		}

		RestangularV3.all('tag/toggle').post({status: $scope.finalStatus, _id: id}).then(function(response){
			if(response != 'true'){
				toastr.error('Oops! Something went wrong. Please try again.');
			}else{
				toastr.success('Success! Tag status has been changed.');
				$timeout(function(){
					location.reload();
				},500);
			}
		});




	}



})