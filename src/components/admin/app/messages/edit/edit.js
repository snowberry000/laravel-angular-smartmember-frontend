var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.messages.edit", {
			url: "/edit/:id?",
			templateUrl: "/templates/components/admin/app/messages/edit/edit.html",
			controller: "EditMessageController",
			params: {
				auto:false,
				clone:null
			}
		} )
} );

app.controller( "EditMessageController", function( $scope, $localStorage,Restangular,$location, RestangularV3, $rootScope, $stateParams, $state, smMembers, $http,$timeout , toastr, $location)
{
	$rootScope.hasMemberId = false;
	if($location.search().member_id)
	{
		//console.log("memberid");
		//alert($location.
		RestangularV3.one('member',$location.search().member_id).get().then(function(response){
			//alert("response" + JSON.stringify(response));
			$scope.message.name= "To: " + response.email;
			$scope.message.from_email = $localStorage.user.email;
			$scope.filters = {Email:{name:"Email",type:"string",attribute:"email",table:"users",show_filterbox:true,action:"is",value:response.email}}
			$scope.segments.active_segment = 'message';	
			$rootScope.hasMemberId = true;
		});

		//message.from_email= 
	}

	$scope.from_users = [];
	$scope.filters= {};
	$scope.segments = {'active_segment': 'name'};
	$scope.message = {};
	$scope.message.unsubscribe_option = true;
	$scope.type = $location.search().type;
	//alert($scope.type);

	if(!$location.search().member_id)
	{
		$scope.type = $rootScope.filter_type;
		$scope.filters = $rootScope.choosen_filters || {};
	}


	$stateParams.auto = $location.search().auto == 'true' ? true : false;
	$stateParams.clone = $location.search().clone;
	$scope.attributes = [];
	$scope.events = [];
	$scope.operation = $rootScope.filter_operation || '$and';
	//$scope.type = $location.search().type;
	$scope.total_count = 0;

	$scope.messageBodyType= 'New';
	if($stateParams.id)
	{
		$scope.messageBodyType = 'Edit' ;
	}
	else if($stateParams.clone)
	{
		$scope.messageBodyType = 'Clone';
	}

	
	$scope.init =function (){
		//company/members
		$scope.auto = $stateParams.auto;

		if($stateParams.id)
		{
			RestangularV3.one('message/'+$stateParams.id).get().then(function(response){
				$scope.auto = response.auto;
				if(response.filters_operand)
					$scope.operation = response.filters_operand;
				if(response.filters)
					$scope.filters = angular.isArray(response.filters) ? {} : response.filters;
				if(response.filters_type)
					$scope.type = response.filters_type;
				$scope.message = response;
				$rootScope.hasMemberId = true;
				//$scope.counts = {'all-sent':$scope.sentMessages.length , 'all-draft':$scope.draftMessages.length};
			});
		}
		else if($stateParams.clone)
		{
			RestangularV3.one('message/'+$stateParams.clone).get().then(function(response){
				$scope.auto = response.auto;
				if(response.filters_operand)
					$scope.operation = response.filters_operand;
				if(response.filters)
					$scope.filters = angular.isArray(response.filters) ? {} : response.filters;
				if(response.filters_type)
					$scope.type = response.filters_type;
				$scope.message = {name:response.name,unsubscribe_option:response.unsubscribe_option , subject:response.subject, company_id:response.company_id, content:response.content, filters:response.filters, filters_operand:response.filters_operand,auto:response.auto,from_email:response.from_email};
				$rootScope.hasMemberId = true;
				

				//$scope.counts = {'all-sent':$scope.sentMessages.length , 'all-draft':$scope.draftMessages.length};
			});
		}
		RestangularV3.all('company/members').getList().then(function(response){
			$scope.from_users = response;//[{email:'mohs@asd.com',first_name:'asd',last_name:'asdasd'}];
			if(response.length>0 && !$stateParams.id && !$scope.message.from_email )
			{
				$scope.message.from_email = response[0].email;
				$scope.message.assigned_to = response[0].email;
			}
			for(var i=0;i<$scope.from_users.length;i++)
			{
				if($scope.from_users[i].first_name || $scope.from_users[i].last_name)
					$scope.from_users[i].name = $scope.from_users[i].first_name+' '+$scope.from_users[i].last_name;
				else
				{
					$scope.from_users[i].name = $scope.from_users[i].email;
				}
				//console.log($scope.from_users[i]);
			}

		});
	}

	$scope.init();
	

	// $scope.LoadAttributes = function()
	// {
	// 	smMembers.Attributes( { shown: 1, archived: 0 } ).then( function( response )
	// 	{//do stuff});
	// 		console.log( 'attributes', response );

	// 		$scope.member_custom_attributes = response;
	// 	} );

	// 	$http.get( 'json/member_default_attributes.json' ).success( function( response )
	// 	{
	// 		$scope.attributes = response.data;
	// 	} );
	// }

	// $scope.toggleFilter = function(filter){
	// 	console.log($scope.filters)
	// 	var index = _.findWhere($scope.filters , {name : filter.name});
	// 	if(!index){
	// 		filter.show_filterbox = true;
	// 		$scope.filters[filter.name] = filter;
	// 	}else{
	// 		delete $scope.filters[filter.name];
	// 		$scope.paginate();
	// 	}
	// }

	$scope.deleteMessage = function(){
		$type = $scope.message.activated;
		if($type)
			$segmentParam = {segment:'all-live'};
		else
		{
			$segmentParam = {segment:'all-drafts'};
		}
		$scope.message.remove().then(function(response){
			if($stateParams.auto)
				$state.go( 'admin.app.messages.auto',$segmentParam);
			else
				$state.go( 'admin.app.messages.manual',$segmentParam);
		});	
	}

	// $scope.addCustomAttributes = function(attributes){
		
	// 	for (var i 		= 0; i < attributes.length; i++) {
	// 		if(!_.findWhere($scope.attributes, {attribute: attributes[i].attribute})){
	// 			$scope.attributes.push(attributes[i]);
	// 		}
	// 	};

	// }

	// $scope.addEventAttributes = function(attributes){
		
	// 	for (var i = 0; i < attributes.length; i++) {
	// 		if(!_.findWhere($scope.events, {name: attributes[i].name})){
	// 			$scope.events.push(attributes[i]);
	// 		}
	// 	};

	// }

	// $scope.paginate = function( search )
	// {
	// 	//$scope.loading = true;
	// 	var filter_copy = angular.copy($scope.filters);
	// 	angular.forEach(filter_copy , function(value , key){
	// 		delete value.options;
	// 	})
	// 	RestangularV3.all('').customGET('member',{filters: JSON.stringify(_.toArray(filter_copy)),operation : $scope.operation , p: 1})
	// 		.then(function(response){
	// 			$scope.loading = false;
	// 			if(response)
	// 			{
	// 				$scope.total_count = response.total_count;
	// 				$rootScope.segment_member_count = response.total_count;
	// 				$scope.data = RestangularV3.restangularizeCollection( null, response.data, 'member' );

	// 				if (response.custom_attributes){
	// 					$scope.addCustomAttributes(response.custom_attributes);
	// 				}
	// 				if (response.events){
	// 					$scope.addEventAttributes(response.events);
	// 				}	
	// 			}
	// 		});
	// }

	$scope.save = function(){
		if(!$scope.message.name || $scope.message.name=='')
		{
			toastr.error('Please name your message');
			return;
		}

		$from_user = _.find($scope.from_users, function(from_user){ return from_user.email == $scope.message.from_email; });
		if($from_user)
		{
			$scope.message.from_name  = $from_user.first_name+' '+$from_user.last_name;
			$scope.message.member_id = $from_user._id;

		}

		$scope.message.filters = $scope.filters;
		$scope.message.filters_operand = $scope.operation;
		$scope.message.filters_type = $scope.type;
		$scope.message.activated = false;
		$scope.message.auto = $scope.auto;

		if(!$stateParams.id)
		{
			RestangularV3.all('message').post($scope.message).then(function(response){
				toastr.success("Your message has been saved");
				if($scope.message.auto==true)
					$state.go('admin.app.messages.auto',{"segment":"all-drafts"});
				else
					$state.go('admin.app.messages.manual',{"segment":"all-drafts"});
			})
		}
		else
		{
			// RestangularV3.all('message').post($scope.message).then(function(response){
			// 	toastr.success("Your message has been saved");
			// })
			$cloned = angular.copy($scope.message);
			RestangularV3.all('message').customPUT($cloned, $scope.message._id).then(function(response){
				toastr.success("Your message has been updated!");
				if($scope.message.auto==true)
					$state.go('admin.app.messages.auto',{"segment":"all-drafts"});
				else
					$state.go('admin.app.messages.manual',{"segment":"all-drafts"});
			});
		}
		
	}
	// $scope.LoadAttributes();
	
	// $scope.paginate();

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



	$scope.setLiveNow = function(){
		if(!$scope.message.name || $scope.message.name=='')
		{
			toastr.error('Message name can not be empty');
			return;
		}
		if(!$scope.hasAnyFilter())
		{
			toastr.error('Please select at least one filter for you audience');
			return;
		}
		if(!$scope.message.subject || $scope.message.subject == '')
		{
			toastr.error('Message Subject can not be empty');
			return;
		}
		

		$from_user = _.find($scope.from_users, function(from_user){ return from_user.email == $scope.message.from_email; });
		if($from_user)
		{
			$scope.message.from_name  = $from_user.first_name+' '+$from_user.last_name;
			$scope.message.member_id = $from_user._id;
		}

		$scope.message.auto = $scope.auto;
		$scope.message.filters = $scope.filters;
		$scope.message.activated = true;
		$scope.message.filters_operand = $scope.operation;

		$scope.message.set_live_at=moment().unix();
		$scope.message.filters_type = $scope.type;


		if(!$stateParams.id)
		{
			RestangularV3.all('message').post($scope.message).then(function(response){
				toastr.success('Message created.');
				if($scope.message.auto==true)
					$state.go('admin.app.messages.auto',{"segment":"all-live"});
				else
					$state.go('admin.app.messages.manual',{"segment":"all-sent"});
			})
		}
		else
		{

			$cloned = angular.copy($scope.message);
			RestangularV3.all('message').customPUT($cloned, $scope.message._id).then(function(response){
				toastr.success("Your message is updated and set live!");
				if($scope.message.auto==true)
					$state.go('admin.app.messages.auto',{"segment":"all-live"});
				else
					$state.go('admin.app.messages.manual',{"segment":"all-sent"});
			});
		}

	}


	$scope.progressBar=function($currentNode,$event){
		if ($currentNode=='name') {
			if(!$scope.message.name || $scope.message.name=='')
			{
				toastr.error("please enter a message name");
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
				toastr.error("please select atleast one filter");
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
			$scope.segments.active_segment="message";
			$event.preventDefault();
			$event.stopPropagation();
		}
		else if ($currentNode=='message') {
			if(!$scope.message.subject || $scope.message.subject == '')
			{
				toastr.error("please enter a message subject");
				return;
			}
			$scope.segments.active_segment="review";
			$event.preventDefault();
			$event.stopPropagation();
		}
	}

    if($rootScope.filters){
		$scope.segments.active_segment = 'message';
		$scope.message.unsubscribe_option = true;
		$scope.message.name = $stateParams.auto ? 'auto' : 'manual';
		$scope.message.name += '-message-' + Date.now();
	}
	
});