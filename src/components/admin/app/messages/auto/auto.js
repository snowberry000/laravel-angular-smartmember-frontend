var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.messages.auto", {
			url: "/auto/:segment",
			templateUrl: "/templates/components/admin/app/messages/auto/auto.html",
			controller: "AutoMessagesController"
		} )
} );

app.controller( "AutoMessagesController", function( $scope,$localStorage, Restangular, RestangularV3, $rootScope, $stateParams, $state, smMembers, $http,$timeout )
{
	if( !$stateParams.segment )
	{
		$state.params.segment = 'all-live';

		$state.go( $state.current, $state.params, {reload:true} );
		return;
	}

	$scope.init = function (){
		$scope.$parent.search_parameters.auto = true;
		if($stateParams.segment == 'all-live' )
		{
			delete $scope.$parent.search_parameters.from_email ;
			$scope.$parent.search_parameters.activated = true;
			$rootScope.auto = {current_tab : "All live messages"};
		}
		else if($stateParams.segment == 'all' )
		{
			delete $scope.$parent.search_parameters.from_email ;
			delete $scope.$parent.search_parameters.activated ;
			$rootScope.auto = {current_tab : "All messages"};
		}
		else if($stateParams.segment == 'all-drafts' )
		{
			delete $scope.$parent.search_parameters.from_email ;
			$scope.$parent.search_parameters.activated = false;
			$rootScope.auto = {current_tab : "All draft messages"};
		}
		else if($stateParams.segment == 'all-mine' )
		{
			delete $scope.$parent.search_parameters.activated ;
			$scope.$parent.search_parameters.from_email = $localStorage.user.email;
			$rootScope.auto = {current_tab : "All mine messages"};
		}
		$scope.$parent.paginate();
		
	}

	$scope.init();

	
	

	$scope.getFilterMessage = function ($argFilters,$argOperation,$filterType){

		$filterString = "";
		if($argFilters)
		{
			$.each($argFilters,function(key,value){
				console.log("key " + key + "value" + JSON.stringify(value));
				if(!$filterString)
				{
					$filterString += 'Type is '+($filterType||'member') ;
				}
				if(value.type && value.type == 'string')
				{
					if(value.action)
					{
						if(value.action == 'is_unknown' || value.action == 'has_any_value')
						{
							$filterString += ' where '+key+' '+value.action.replace(new RegExp('_', 'g'),' ')+' '+value.value+' ';
							$filterString += ($argOperation == '$and') ? 'and':'or';
						}
						else
						{
							if(value.value)
							{
								$filterString += ' where '+key+' '+value.action.replace(new RegExp('_', 'g'),' ')+' '+value.value+' ';
								$filterString += ($argOperation == '$and') ? 'and':'or';
							}
						}
					}
				}
				else if(value.type && value.type == 'date')
				{
					if(value.action && (value.action == 'more_than' || value.action == 'less_than' || value.action == 'exactly'))
					{
						$filterString += ' where '+key+' '+value.action.replace(new RegExp('_', 'g'),' ')+' '+value.value+' days ago ';
						$filterString += ($argOperation == '$and') ? 'and':'or';
					}
					else if(value.action && (value.action == 'after' || value.action == 'on' || value.action == 'before' || value.action == 'is_unknown' || value.action == 'has_any_value')  )
					{
						if(value.action == 'is_unknown' || value.action == 'has_any_value')
						{
							$filterString += ' where '+key+' '+value.action.replace(new RegExp('_', 'g'),' ')+' '+value.value+' ';
							$filterString += ($argOperation == '$and') ? 'and':'or';
						}
						else
						{
							if(value.value)
							{
								$filterString += ' where '+key+' '+value.action.replace(new RegExp('_', 'g'),' ')+' '+moment(value.value).format('DD-MM-YYYY')+' ';
								$filterString += ($argOperation == '$and') ? 'and':'or';
							}
						}	
					}
				}
				else if(value.type && value.type == 'select'){
					if(key=='Sites')
					{
						if(value.options)
							for(var i=0; i<value.options.length; i++)
							{
								if(value.options[i]['_id']== value.value)
								{
									$filterString += ' where '+key+' '+value.action.replace(new RegExp('_', 'g'),' ')+' '+value.options[i]['name']+' ';
									break;
								}

							}
					}
					else if(key=='Segments')
					{
						if(value.options)
							for(var i=0; i<value.options.length; i++)
							{
								if(value.options[i]['_id']== value.value)
								{
									$filterString += ' where '+key+' '+value.action.replace(new RegExp('_', 'g'),' ')+' '+value.options[i]['title']+' ';
									break;
								}
							}
					}
					else if(key=='Tag')
					{
						if(value.options)
							for(var i=0; i<value.options.length; i++)
							{
								if(value.options[i]['_id']== value.value)
								{
									$filterString += ' where '+key+' '+value.action.replace(new RegExp('_', 'g'),' ')+' '+value.options[i]['name']+' ';
									break;
								}
							}
					}

					else if(key=='Browser Language')
					{
						if(value.options)
							for(var i=0; i<value.options.length; i++)
							{
								if(value.options[i]['_id']== value.value)
								{
									$filterString += ' where '+key+' '+value.action.replace(new RegExp('_', 'g'),' ')+' '+value.options[i]['name']+' ';
									break;
								}
							}
					}

				}
				else if(value.type && value.type == 'bool'){
					if(value.action)
					{
						$filterString += ' where '+key+' '+value.action.replace(new RegExp('_', 'g'),' ')+' '+value.value+' ';
						$filterString += ($argOperation == '$and') ? 'and':'or';
					}
				}
			}
			);
		}
		$filterStringSplitted = $filterString.split(" ");
		if($filterStringSplitted.length > 0)
			if($filterStringSplitted[$filterStringSplitted.length-1]!='member' && $filterStringSplitted[$filterStringSplitted.length-1]!='lead')
				$filterStringSplitted.splice($filterStringSplitted.length-1,1);
		return $filterStringSplitted.join(" ");
	}
	
	$scope.percentage = function(num,denum){
		if(denum && denum>0)
			return Number(((num/denum)*100).toFixed(1));
		else
			return 0;
	}

	$scope.CreateNewMessage = function()
	{
		// Create a new message, then redirect to edit it
		$state.go( 'admin.app.messages.edit', {auto: true} );
	}

	
});