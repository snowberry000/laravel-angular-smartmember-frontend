var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.members", {
			url: "/members/:segment",
			templateUrl: "/templates/components/admin/app/members/members.html",
			controller: "MembersController"
		} )
} );

app.controller( "MembersController", function( $scope, $localStorage , smModal, $location ,RestangularV3,toastr, $rootScope, $stateParams, $state, smMembers, $http,$timeout )
{	
	$scope.attributes = [];
	$scope.user = $localStorage.user;
	$scope.events = [];
	$rootScope.segment_member_count = 0;
	$scope.segment = _.findWhere($scope.segments , {permalink : $stateParams.segment});
	$scope.operation = '$and';
	$scope.type = 'member';
	$scope.searchTimeout = "";
	$rootScope.page_title = "People";

	if( !$stateParams.segment )
	{
		$state.params.segment = 'all-members';

		$state.go( $state.current, $state.params, {reload:true} );
		return;
	}

	$scope.clearSelection =function(){
		for (var i = 0; i < $scope.data.length; i++) {
			delete $scope.data[i].is_checked;
		};
	}

	$scope.checkSelection =function(){
		for (var i = 0; i < $scope.data.length; i++) {
			if($scope.data[i].is_checked)
			{
				return true;
			} 
		};
	}

	$scope.countSelection =function(){
		var counter = 0;
		for (var i = 0; i < $scope.data.length; i++) {
			if($scope.data[i].is_checked)
			{
				counter++;
			} 
		};

		return counter;
	}

	$scope.bulkDelete = function (){
		if(!$scope.checkSelection())
		{
			toastr.error('Please select the members to delete');
			return;
		}

		var filteredData = _.filter($scope.data, function($temp){ return $temp.is_checked });
		$deleteMembers = _.pluck(filteredData, '_id');
		swal({   
				title: "Delete Members",   
				text: "Are you sure, you want to delete these "+$deleteMembers.length+" members?",   
				type: "warning",
				confirmButtonText: "Yes, delete them!", 
				cancelButtonText: "cancel!",   
				showCancelButton: true,   
				closeOnConfirm: true,   
				showLoaderOnConfirm: true, 
			}, function(isConfirm){ 
				if(isConfirm)
				{
					RestangularV3.all( 'member/bulkDelete' ).customPOST({members:$deleteMembers}).then(function(response){
						toastr.success(response +' members deleted!');
						$state.go("admin.app.members" ,{"segment":"all-members"},{ reload: true });
					});
				}
		});
	}

	$scope.export = function(){
		
		var filteredData = _.filter($scope.data, function(temp){ return temp.is_checked });

		if(!filteredData || filteredData.length ==0){
			var filter_copy = angular.copy($scope.filters);
			angular.forEach(filter_copy , function(value , key){
				delete value.options;
			});
			var url = 'http://api-3.'+ $rootScope.app.domain + '/member/export?filters='+JSON.stringify(filter_copy)+'&operation='+$scope.operation+'&type='+$scope.type+'&access_token='+$localStorage.user.access_token;
			window.open(url, '_blank');
		}else{
			var exported_members = _.pluck(filteredData, '_id');
			exported_members = _.pluck(exported_members, '$id');

			var results = _.map(
			    _.where($scope.data, {is_checked : true}), 
			    function(person) {
			        return { first_name : person.first_name, last_name : person.last_name , email : person.email};
			    }
			);

			var csvContent = "data:text/csv;charset=utf-8,";
			results.forEach(function(infoArray, index){
			   infoArray = _.toArray(infoArray);
			   dataString = infoArray.join(",");
			   csvContent += index < results.length ? dataString+ "\n" : dataString;

			}); 

			var encodedUri = encodeURI(csvContent);
			var link = document.createElement("a");
			link.setAttribute("href", encodedUri);
			link.setAttribute("download", "member.csv");
			
			var clickEvent = new MouseEvent("click", {
			    "view": window,
			    "bubbles": true,
			    "cancelable": false
			});

			link.dispatchEvent(clickEvent);			
		}
	}

	$scope.toggleFilter = function(filter){
		$scope.pagination.current_page = 1;
		console.log($scope.filters)
		var index = _.findWhere($scope.filters , {name : filter.name});
		if(!index){
			filter.show_filterbox = true;
			$scope.filters[filter.name] = filter;
		}else{
			//console.log("filter" + JSON.stringify(filter));
			$hadFilter = $scope.hasSpecificFilter(filter);
			delete $scope.filters[filter.name];
			delete filter.action;
			if($hadFilter)
				$scope.paginate();
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

	$scope.$watch('filters' , function(newValue, oldValue){
		$scope.pagination.current_page = 1;
		var same = angular.equals(newValue, $scope.filters_copy);
		var empty = angular.equals({} , $scope.filters);
		if (oldValue != newValue && !same && !empty){
			$scope.show_segement_button = true;
		}else{
			$scope.show_segement_button = false;
		}

		if(oldValue != newValue && $scope.segment && $scope.segment._id && !same && !empty){
			$scope.show_update_button = true;
		}else{
			$scope.show_update_button = false;
		}

	} , true)

	$scope.loading = false;
	$scope.query = '';
	$scope.data = [];
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		disable: false,
		total_count: 0
	};

	$scope.LoadAttributes = function()
	{

		$http.get( 'json/member_default_attributes.json' ).success( function( response )
		{
			$scope.attributes = response.data;
		} );
	}

	// $scope.$watch( 'pagination.current_page', function( new_value, old_value )
	// {
	// 	if( new_value != old_value )
	// 	{
	// 		$scope.paginate();
	// 	}
	// } );

	$scope.escape = function(text) {
	  return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
	};


	$scope.createSegment = function(){
		swal({   
				title: "Create New Segment",   
				text: "Enter your segment name",   
				type: "input",   
				showCancelButton: true,   
				closeOnConfirm: false,   
				showLoaderOnConfirm: true, 
			}, function(inputValue){
				if (inputValue === false) return false;
				else if(inputValue==='')
				{
					swal.showInputError("Segment name cannot be empty");
					return false;
				}
				else if(inputValue){
					RestangularV3.all('segment').post({
						title: inputValue,
						filters: JSON.stringify($scope.filters),
						filters_operand : $scope.operation,
						filters_type : $scope.type,
						member_count : $scope.pagination.total_count,
						created_by: $scope.user.id
					}).then(function(response){
						swal("Created","Your Segment has been created successfully" , "success");
						$scope.segments.push(response);
					});
				}
				
				
		});
	}

	$scope.updateSegment = function(){
		RestangularV3.all('segment').customPUT({filters: JSON.stringify($scope.filters), filters_operand : $scope.operation , filters_type : $scope.type , member_count : $scope.pagination.total_count} , $scope.segment._id).then(function(response){
			swal("Your Segment has been updated successfully");
			for(var i = 0; i < $scope.segments.length ; i++){
				if($scope.segments[i]._id == $scope.segment._id){
					$scope.segments[i] = response;
					break;
				}
			}
		});
	}

	$scope.deleteSegment = function(){
		swal({   
				title: "Delete",   
				text: "Are you sure you want to delete this segment?",   
				showCancelButton: true,   
				closeOnConfirm: true,   
				showLoaderOnConfirm: true, 
			}, function(inputValue){ 
				if(inputValue){
					RestangularV3.one('segment' , $scope.segment._id).remove().then(function(response){
						swal("Your Segment has been deleted successfully");
						$state.params.segment = 'all-members';

						$state.go( $state.current, $state.params, {reload:true} );
						return;
					});
				}
		});
	}

	$scope.addCustomAttributes = function(attributes){
		
		for (var i 		= 0; i < attributes.length; i++) {
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
	
	$scope.checkFilter = function(){
        $objectKeys = _.keys($scope.filters) ;
        for(var i=0;i<$objectKeys.length;i++)
        {
            if($scope.filters[$objectKeys[i]].type == 'string' && ($scope.filters[$objectKeys[i]].action == 'has_any_value' || $scope.filters[$objectKeys[i]].action == 'is_unknown'))
            {
              return true;
            }
            if($scope.filters[$objectKeys[i]].type == 'string' && $scope.filters[$objectKeys[i]].value)
            {
                return true;
            }
        }
        return false;
    }


    $scope.setFilters = function (){

    	$http.get( 'json/member_default_attributes.json' ).success( function( response )
    	{
    		$name = $location.search().name;
			if($location.search().name)
			{
				$tempFilter={};
				$tempFilter = _.findWhere(response.data,{name:$name});
				$tempFilter.show_filterbox =true;
				if($location.search().value!='unknown')
				{
					if($tempFilter.type == 'string')
					{
						$tempFilter.action = 'is';
						$tempFilter.value = $location.search().value;
					}
					if($tempFilter.type == 'date')
					{
						$tempFilter.action = 'on';
						$tempFilter.value = $location.search().value;
					}
					if($tempFilter.type == 'number')
					{
						$tempFilter.action = 'is';
						$tempFilter.value = Number($location.search().value);
					}
					if($tempFilter.type == 'bool')
					{
						$tempFilter.action = $location.search().value == 'true' ? 'is_true' : 'is_false';
						$tempFilter.value = "";
					}
					if($tempFilter.type == 'select')
					{
						$tempFilter.action = 'is';
						$tempFilter.value = $location.search().value;
						RestangularV3.all($tempFilter.route).customGET().then(function(response){
							$tempFilter.options = response;
						});
					}
				}
				else
				{
					$tempFilter.action = 'is_unknown';
					$tempFilter.value = "";
				}
				$scope.filters = {};
				$scope.filters[$tempFilter.name] = $tempFilter;
		    }
		    else
		    {
		    	$scope.filters = {};
		    }

		    if($stateParams.segment == 'all-leads')
				$scope.type = 'lead';
			else
				$scope.type = 'member';


			$scope.paginate();
		});
    }


    $scope.loadMore = function (){
    	if(!$scope.data || $scope.data.length==0)
    		$scope.loading = true;
    	$scope.pagination.disable=true;
    	var $params = { p: $scope.pagination.current_page };

    	if( $scope.query )
    	{
    		$params.q = encodeURIComponent( $scope.query );
    	}
    	var filter_copy = angular.copy($scope.filters);
    	$rootScope.appliedFilters = $scope.filters;
    	angular.forEach(filter_copy , function(value , key){
    		delete value.options;
    		// if(value.type == 'string')
    		// 	value.value = $scope.escape(value.value);
    	})
    	
    	RestangularV3.all('').customGET('member',{filters: JSON.stringify(_.toArray(filter_copy)), operation : $scope.operation , p: $params.p , type : $scope.type})
    		.then(function(response){
    			$scope.pagination.current_page++;
    			$scope.loading = false;
    			$scope.pagination.total_count = response.total_count;
    			$rootScope.segment_member_count = response.total_count;
    			$scope.dataFetch = RestangularV3.restangularizeCollection( null, response.data, 'member' );
    			if($scope.dataFetch && $scope.dataFetch.length > 0)
    			{
    				$scope.pagination.disable=false;
    			}
    			$scope.data = $scope.data.concat($scope.dataFetch);
				$rootScope.membersData = $scope.data;
    			if (response.custom_attributes){
    				$scope.addCustomAttributes(response.custom_attributes);
    			}
    			if (response.events){
    				$scope.addEventAttributes(response.events);
    			}		
    		});
    }
    // $scope.loadMore();

	$scope.paginate = function( search )
	{
		console.log('search');
		console.log(search);
		$scope.data = [];
		$scope.pagination.disable=false;
		$scope.pagination.current_page = 1;
		$scope.loadMore();	
	}


	$scope.LoadAttributes();

	

	if($scope.segment){
		$scope.filters = JSON.parse($scope.segment.filters);
		$scope.operation = $scope.segment.filters_operand;
		$scope.type = $scope.segment.filters_type;
		$scope.filters_copy = angular.copy($scope.filters);
		console.log($scope.filters);
		$scope.paginate();
	}
	else{
		$scope.setFilters();
	}


	

	
	$scope.createMessage = function(auto){

		var filteredData = _.filter($scope.data, function(temp){ return temp.is_checked });
		if(filteredData && filteredData.length > 0 && !auto){
			var exported_members = _.pluck(filteredData, 'email');

			smModal.Show(null , {emails : _.toArray(exported_members)} , {templateUrl : 'templates/components/admin/app/common/selected-message.html' , controller : 'selectedMessageController'});
			return;
		}

		$rootScope.choosen_filters = $scope.filters;
		$rootScope.filter_operation = $scope.operation;
		$rootScope.filter_type = $scope.type
		$location.path('/messages/edit/').search('auto' , auto+'');
	}

	$scope.toggleMembers = function(){
		if( !$scope.segment || !$scope.segment._id)
		{
			$state.params.segment = 'all-members';

			$state.go( $state.current, $state.params, {reload:true} );
			return;
		}
		$scope.type = 'member';
		$scope.paginate();
	}

	$scope.toggleLeads = function(){
		if( !$scope.segment || !$scope.segment._id)
		{
			$state.params.segment = 'all-leads';

			$state.go( $state.current, $state.params, {reload:true} );
			return;
		}
		$scope.type = 'lead';
		$scope.paginate();
	}

	$scope.importDialog = function(){
		smModal.Show(null , {} , {templateUrl : 'templates/modals/import.html' , controller : 'importController'});
	}

	$scope.addTag = function(){
		var filteredData = _.filter($scope.data, function(temp){ return temp.is_checked });
		smModal.Show(null , {} , {templateUrl : 'templates/modals/tag.html' , controller : 'tagController'} , null , {data : filteredData , filters : $scope.filters});

	}

	$scope.selectedMembers = function(){
		var filteredData = _.filter($scope.data, function(temp){ return temp.is_checked });
		return filteredData;
	}
	
});



app.controller('importController' , function($scope , RestangularV3 , smModal , toastr){
	$scope.import_data = {};
	RestangularV3.all('').customGET('key',{bypass_paging:true}).then(function(response){
		$scope.keys = response.items;
	});
	$scope.import = function(){
		if(!$scope.import_data.emails){
			$scope.error = "Please enter an email to import";
			return;
		}

		var emails = $scope.import_data.emails.split(/[\ \n\,]+/);
		var pattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
		for(var i=0; i < emails.length ; i++){
			if(!emails[i].match(pattern)){
				$scope.error = "The email address " + emails[i] + " is not valid";
				return;
			}
		}
		console.log($scope.import_data);
		RestangularV3.all('member').customPOST({emails : $scope.import_data.emails , keys : $scope.import_data.keys} , "import").then(function(response){
			smModal.Close();
			swal("Imported","Import has been successful" , "success");
		});
	}
});

app.controller('selectedMessageController' , function($scope , RestangularV3 , smModal , toastr , $stateParams){
	$scope.email = {recipients : $stateParams.emails};
	$scope.error = null;
	$scope.errors = [];
	$scope.remove = function(email){
		$scope.email.recipients = _.without($scope.email.recipients , email);
	}

	$scope.send = function(){
		$scope.errors = [];
		if(!$scope.email.subject || !$scope.email.message || !$scope.email.recipients || $scope.email.recipients.length == 0 ){
			if(!$scope.email.subject)
				$scope.errors.push('Subject');
			if(!$scope.email.message)
				$scope.errors.push('message');
			if(!$scope.email.recipients || $scope.email.recipients.length == 0)
				$scope.errors.push('recipients');
			$scope.error = $scope.errors.join(',');
			$scope.error.replace(/(^,)|(,$)/g, "");
			if($scope.errors.length>1)
				$scope.error+=" are required";
			else
				$scope.error+=" is required";


			return;
		}

		RestangularV3.all('message').customPOST($scope.email , 'selected').then(function(response){
			toastr.success("Message sent");
			smModal.Close();
		});
	}
})

