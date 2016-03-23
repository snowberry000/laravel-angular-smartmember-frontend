var app = angular.module("app");

app.config(function($stateProvider){
	$stateProvider
		.state("admin.app.access.edit-key",{
			url: "/edit-key/:id?",
			templateUrl: "/templates/components/admin/app/access/edit-key/edit-key.html",
			controller: "AccessKeyEditController"
		})
}); 

app.controller("AccessKeyEditController", function ($rootScope,$location,$scope,$stateParams,RestangularV3,$state,toastr ) {
    $rootScope.hasMemberId = false;
	$scope.filters = {};
	$scope.key = {};
	$scope.operation = '$and';
	$scope.type = 'member';
	$scope.segments = {'active_segment': 'name'};
	$scope.loading = false;
	$scope.total_count = 0;
	$stateParams.clone = $location.search().clone  ? true : false;
	$scope.page_title = "New";
	if($stateParams.id){
		$scope.page_title = 'Edit';
		RestangularV3.one('key',$stateParams.id).get().then(function(response){
			$scope.key = response;
			$scope.filters = response.filters ? response.filters : {};
			$scope.operation = response.filters_operand ? response.filters_operand  : '$and';
			$scope.type = response.filters_type ? response.filters_type  : 'member';
			$rootScope.hasMemberId = true;
			//$rootScope.filters = $scope.filters;
		});
	}
	else if($stateParams.clone)
	{
		$scope.page_title = 'Clone';
		RestangularV3.one('key',$location.search().clone).get().then(function(response){
			$scope.key = {company_id:response.company_id,filters:response.filters, filters_operand:response.filters_operand, filters_type: response.filters_type, name :response.name};
			delete $scope.key._id;
			$scope.filters = response.filters ? response.filters : {};
			$scope.operation = response.filters_operand ? response.filters_operand  : '$and';
			$rootScope.hasMemberId = true;
			//$rootScope.filters = $scope.filters;
		});
	}

	$scope.deleteKey = function(){
		$type = $scope.key.activated;
		if($type)
			$segmentParam = {segment:'all-live'};
		else
		{
			$segmentParam = {segment:'all-drafts'};
		}

		RestangularV3.all( 'key' ).customDELETE( $scope.key._id ).then( function()
		{
			$state.go( 'admin.app.access.keys',$segmentParam);
		} );
	}
	

	$scope.save = function (activated){
		$scope.key.activated = activated;

		if(!$scope.key.name || $scope.key.name==''){
			toastr.error('Key name can not be empty');
			return;
		}

		if (!$scope.hasAnyFilter()){
			toastr.error('Please select at least one filter for your audience');
			return;
		};
		if($scope.key.activated == true && !$scope.key.set_live_at)
		{
			$scope.key.set_live_at= moment().unix();
		}

		$scope.key.filters = $scope.filters;
		$scope.key.filters_operand = $scope.operation ? $scope.operation : '$and';
		$scope.key.filters_type = $scope.type ? $scope.type : 'member';
		if ($stateParams.id){	
			$cloned = angular.copy($scope.key);
			RestangularV3.all( "key" ).customPUT( $cloned, $scope.key._id ).then( function(response)
			{
				if($scope.key.activated==false)
					$state.go('admin.app.access.keys',{segment: 'all-drafts'});
				else
					$state.go('admin.app.access.keys');
			});

		}else{
			RestangularV3.all('key').post($scope.key).then(function(response){
				if($scope.key.activated==false)
					$state.go('admin.app.access.keys',{segment: 'all-drafts'});
				else
					$state.go('admin.app.access.keys');
			});
		}
	}

	$scope.hasAnyFilter = function (){
		$keys = _.keys($scope.filters);
		for(var i=0;i<$keys.length;i++){
			value = $scope.filters[$keys[i]];
			if(value.type && value.type == 'string')
			{
				if(value.action)
				{
					if(value.action == 'is_unknown' || value.action == 'has_any_value')
					{
						return true;
					}
					else
					{
						if(value.value)
						{
							return true;
						}
					}
				}
			}
			else if(value.type && value.type == 'date')
			{
				if(value.action && (value.action == 'more_than' || value.action == 'less_than' || value.action == 'exactly'))
				{
					if(value.value || value.value=='0')
					{
						return true;
					}
				}
				else if(value.action && (value.action == 'after' || value.action == 'on' || value.action == 'before' || value.action == 'is_unknown' || value.action == 'has_any_value')  )
				{
					if(value.action == 'is_unknown' || value.action == 'has_any_value')
					{
						return true;
					}
					else
					{
						if(value.value)
						{
							return true;
						}
					}	
				}
			}
			else if(value.type && value.type == 'select'){
				if($keys[i]=='Sites')
				{
					if(value.options)
						if(value.value)
							return true;
				}
				else if($keys[i]=='Segments')
				{
					if(value.options)
						if(value.value)
							return true;
				}
				else if($keys[i]=='Tag')
				{
					if(value.options)
						if(value.value)
							return true;
				}
				else if($keys[i]=='Browser Language')
				{
					if(value.options)
						if(value.value)
							return true;
				}
			}
			else if(value.type && value.type=='number')
			{
				if(value.action == 'is_unknown' || value.action == 'has_any_value')
					{
						return true;
					}
					else
					{
						if(value.value || value.value=='0')
						{
							return true;
						}
					}	

			}
			else if(value.type && value.type == 'bool'){
				if(value.action)
				{
					return true;
				}
			}
		}

		return false;
	}

	$scope.progressBar=function($currentNode,$event){
		if ($currentNode=='name') {
			if(!$scope.key.name || $scope.key.name=='')
			{
				return;
			}
			else
			{
				$scope.segments.active_segment="audience";
				$event.preventDefault();
				$event.stopPropagation();
			}
		}
		else if ($currentNode=='audience') {
		
			if(!$scope.hasAnyFilter())
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

	/*
	
	$scope.data = [];
	
	
	$scope.key = {};

	$scope.setLiveNow = function () {
		if(!$scope.key.name || $scope.key.name=='')
		{
			toastr.error('Key name can not be empty');
			return;
		}
		if(!$scope.hasAnyFilter())
		{
			toastr.error('Please select at least one filter for you audience');
			return;
		}

		$scope.key.activated = true;
		$scope.key.filters = $scope.filters;
		$scope.key.filters_operand = $scope.operation;

		RestangularV3.all('key').post($scope.key).then(function(response){
			toastr.success("Your Key has been saved");
		})
	}

	$scope.save = function () {
		$scope.key.activated = false;
		$scope.key.filters = $scope.filters;
		$scope.key.filters_operand = $scope.operation;

		RestangularV3.all('key').post($scope.key).then(function(response){
			toastr.success("Your Key has been saved");
		})
	}



	
	
	*/

});