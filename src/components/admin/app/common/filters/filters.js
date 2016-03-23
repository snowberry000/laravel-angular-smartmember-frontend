app.controller( "FiltersController", function( $scope, Restangular, RestangularV3, $rootScope, $stateParams, $state, smMembers, $http,$timeout , toastr, $location )
{

	$scope.attributes = [];
	$scope.events = [];
	//$scope.type = $location.search().type;

	$scope.isEmpty = function (obj) {
	    for(var prop in obj) {
	        if(obj.hasOwnProperty(prop))
	            return false;
	    }

	    return true;
	}

	$scope.updateAttributes = function(){
		$.each($scope.attributes,function(key,value){
			if($scope.filters[value.name])
			{
				value.action=$scope.filters[value.name].action;
				value.value=$scope.filters[value.name].value;
			}
		});
	}

	$scope.$watch('filters', _.debounce(function (filter) { 
		
		$scope.updateAttributes();
		if($rootScope.hasMemberId)
		{
			$scope.paginate();
			$rootScope.hasMemberId=false;
		}
		
		else
		{
			$hadFilter = $scope.hasSpecificFilter(filter);

		    if($hadFilter)
		    $scope.paginate();
		}

		}, 1000)
	,true);

	// $scope.$watch('filters', function(newVal, oldVal){
	// 	console.log("changed filters");
	//     console.log(newVal);
	//     console.log(oldVal);
	//     $scope.paginate();
	//     // if(!$scope.isEmpty(newVal) && $scope.isEmpty(oldVal))
	//     // {
	//     // 	//console.log('paginating');
	//     // 	$scope.paginate();
	//     // }
	// }, true);

$scope.escape = function(text) {
	  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};

	$scope.hasValidFilter = function ($filter_copy) {
		for(var key in $filter_copy)
		{
			if($filter_copy[key].type == 'string' && ($filter_copy[key].action == 'has_any_value' || $filter_copy[key].action == 'is_unknown'))
			{
				continue;
			}
			if($filter_copy[key].type == 'string' && !$filter_copy[key].value )
			{
				console.log('deleting');
				console.log($filter_copy[key]);
				delete $filter_copy[key]
			}
				
		}
		return $filter_copy;
	}
	$scope.paginate = function( search )
	{
		//$scope.loading = true;

		var filter_copy = angular.copy($scope.filters);
		filter_copy = $scope.hasValidFilter(filter_copy);

		angular.forEach(filter_copy , function(value , key){
			delete value.options;
			// if(value.type == 'string')
			// 	value.value = $scope.escape(value.value);
		})

		RestangularV3.all('').customGET('member',{filters: JSON.stringify(_.toArray(filter_copy)),operation : $scope.operation , p: 1 , type : $scope.type})
			.then(function(response){
				if(response)
				{
					$scope.$parent.$parent.loading = false;
					$scope.$parent.$parent.total_count = response.total_count;
					$rootScope.segment_member_count = response.total_count;
					if($scope.hasAnyFilter())
					$scope.$parent.$parent.data = RestangularV3.restangularizeCollection( null, response.data, 'member' );

					if (response.custom_attributes){
						$scope.addCustomAttributes(response.custom_attributes);
					}
					if (response.events){
						$scope.addEventAttributes(response.events);
					}	
				}
					
			});
	}

	

	$scope.LoadAttributes = function()
	{

		$http.get( 'json/member_default_attributes.json' ).success( function( response )
		{
			$scope.attributes = response.data;
		} );
	}

	$scope.toggleFilter = function(filter){
		var index = _.findWhere($scope.filters , {name : filter.name});
		if(!index){
			filter.show_filterbox = true;
			$scope.filters[filter.name] = filter;
		}else{
			$hadFilter = $scope.hasSpecificFilter(filter);
			delete $scope.filters[filter.name];
			delete filter.action;
			if($hadFilter)
				$scope.paginate();
		}
		if(!$scope.hasAnyFilter()){
			$("#audienceTable td").remove();
		}
	}
	$scope.hasSpecificFilter = function ($name){
		//$keys = _.keys($scope.filters);
		var value = $name;

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
				if($name.name=='Sites')
				{
					if(value.options)
						if(value.value)
							return true;
				}
				else if($name.name=='Segments')
				{
					if(value.options)
						if(value.value)
							return true;
				}
				else if($name.name=='Tag')
				{
					if(value.options)
						if(value.value)
							return true;
				}
				else if($name.name=='Browser Language')
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
		

		return false;
	}

	$scope.addCustomAttributes = function(attributes){
		
		for (var i = 0; i < attributes.length; i++) {
			if(!_.findWhere($scope.attributes, {attribute: attributes[i].attribute})){
				$scope.attributes.push(attributes[i]);
			}
		};

	}

	$scope.addEventAttributes = function(attributes){
		
		for (var i = 0; i < attributes.length; i++) {
			if(!_.findWhere($scope.events, {name: attributes[i].name})){
				$scope.events.push(attributes[i]);
			}
		};

	}

	$scope.toggleMembers = function(){
		$scope.type = 'member';
		$scope.$parent.$parent.type = 'member';
		$scope.paginate();
	}

	$scope.toggleLeads = function(){
		$scope.type = 'lead';
		$scope.$parent.$parent.type = 'lead';
		$scope.paginate();
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
			else if(value.type && value.type == 'number')
			{
				if(value.action)
				{
					if(value.action == 'is_unknown' || value.action == 'has_any_value')
					{
						return true;
					}
					else
					{
						if(value.value || value.value === 0)
						{
							return true;
						}
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

	$scope.LoadAttributes();
	$scope.paginate();

} );