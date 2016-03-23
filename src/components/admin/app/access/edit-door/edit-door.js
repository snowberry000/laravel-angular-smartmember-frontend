var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.access.edit-door",{
			url: "/edit-door/:id?",
			templateUrl: "/templates/components/admin/app/access/edit-door/edit-door.html",
			controller: "AccessDoorEditController"
		})
}); 

app.controller("AccessDoorEditController", function ($scope,$location,$state,RestangularV3,toastr, $stateParams, $timeout, $q) {
	$scope.page_title = "New";

	$scope.door = {};
	$scope.segments = {'active_segment': 'name'};
	$scope.loading = false;
	$stateParams.clone = $location.search().clone  ? true : false;

	var editOrClone = null;
	var keyList = null;
	keyList = RestangularV3.all('').customGET('key',{bypass_paging:true}).then(function(response){
		$scope.keys = response.items;
	});

	if($stateParams.id){
		$scope.page_title='Edit';
		editOrClone = RestangularV3.one('door',$stateParams.id).get().then(function(response){
			$scope.door = response;
			// $scope.setSelectedKeys();
		});
	}
	else if($stateParams.clone)
	{
		$scope.page_title = 'Clone';
		editOrClone = RestangularV3.one('door',$location.search().clone).get().then(function(response){
			$scope.door = response;
			delete $scope.door._id;
			delete $scope.door.created_at;
			delete $scope.door.updated_at;
			delete $scope.door.permalink;
		});
	}

	if(editOrClone != null) {
		
		$q.all([keyList, editOrClone]).then(function() {
			$timeout($scope.setSelectedKeys, 1000);
		});
	}

	$scope.contains =function($keysArg,$keyArg){

		if($keysArg && $keysArg.indexOf($keyArg)>=0)
			return true;
		else
			return false;
	}

	$scope.deleteDoor = function(){
		$type = $scope.door.type;
		if($type=='open')
			$segmentParam = {segment:'open'};
		else if($type=='closed')
		{
			$segmentParam = {segment:'closed'};
		}
		else if($type=='locked')
		{
			$segmentParam = {segment:'locked'};
		}

		RestangularV3.all( 'door' ).customDELETE( $scope.door._id ).then( function()
		{
			$state.go( 'admin.app.access.doors',$segmentParam);
		} );
	}

	$scope.save = function(activated){
		if(!$scope.door.name || $scope.door.name=='' || !$scope.door.type)
		{
			toastr.error('Please select a door name and door type');
			return;
		}
		if($scope.door.type == 'locked' && (!$scope.door.keys || $scope.door.keys.length == 0) ){
			toastr.error('Please choose door keys');
			return;
		}

		if($scope.door.type!='locked')
		{
			if($scope.door.keys && $scope.door.keys.length>0)
				$scope.door.keys = [];
		}

		if ($stateParams.id){
			$cloned = angular.copy($scope.door);
			RestangularV3.all( "door" ).customPUT( $cloned, $scope.door._id ).then($scope.postSave);
		}else{
			RestangularV3.all('door').post($scope.door).then($scope.postSave);
		}
	}

	$scope.postSave = function(response){
		if(response.activated==false)
			$state.go('admin.app.access.doors',{segment: 'all-drafts'});
		else
			$state.go('admin.app.access.doors');
	}

	$scope.progressBar=function($currentNode,$event){
		if ($currentNode=='name') {
			if(!$scope.door.name || $scope.door.name=='')
			{
				return;
			}
			else
			{
				$scope.segments.active_segment="channel";
				$event.preventDefault();
				$event.stopPropagation();
			}
		}
		else if ($currentNode=='channel') {
		
			if(!$scope.door.type)
			{
				return;
			}
			else if($scope.door.type == 'locked')
			{
				$scope.segments.active_segment="audience";
				$event.preventDefault();
				$event.stopPropagation();
			}
			else
			{
				$scope.segments.active_segment="review";
				$event.preventDefault();
				$event.stopPropagation();
			}
		}
		else if ($currentNode=='audience') {
		
			if(!$scope.door.keys || $scope.door.keys.length == 0)
			{
				return;
			}
			else
			{
				$scope.segments.active_segment="review";
				$event.preventDefault();
				$event.stopPropagation();
			}
		}
	}

	
	$scope.setSelectedKeys = function() {			
		$(".ui.fluid.dropdown").dropdown({allowLabels:true})
		for(var i=0; i < $scope.door.keys.length; i++)
		{
			console.log($scope.door.keys[i]);
			$(".ui.fluid.dropdown").dropdown('set selected', [$scope.door.keys[i]]);
		}	
	}
	
});