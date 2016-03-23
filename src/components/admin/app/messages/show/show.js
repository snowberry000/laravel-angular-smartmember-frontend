var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.messages.show", {
			url: "/show/:id",
			templateUrl: "/templates/components/admin/app/messages/show/show.html",
			controller: "ShowMessageController",
			params: {
				auto:false
			}
		} )
} );

app.controller( "ShowMessageController", function( $scope,$location, Restangular,RestangularV3, $rootScope, $stateParams, $state, smMembers, $http, $timeout )
{
	$scope.filters={};
	$stateParams.auto = $location.search().auto == 'true' ? true :false ;

	$scope.message ={_id:$stateParams.id,auto:$stateParams.auto};
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	$scope.init = function(){
		RestangularV3.one('message/'+$stateParams.id).get().then(function(response){
			$scope.message = response;
			$scope.paginate();
			
			if(response.filters_operand)
				$scope.operation = response.filters_operand;
			if(response.filters)
				$scope.filters = response.filters;
		});
	}

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );
	$scope.paginate = function(){
		RestangularV3.all('queue?message_id='+$scope.message._id+'&sent=true&p=' + $scope.pagination.current_page).customGET('').then(function(response){
				$scope.message.queues = response.items;
				$scope.pagination.total_count = response.total_count;
			});
	}
	$scope.init();

	$scope.getFilterMessage = function ($argFilters,$argOperation,$filterType){

		$filterString = "";
		if($argFilters)
		{
			$.each($argFilters,function(key,value){
				console.log("key " + key + "value" + JSON.stringify(value));
				// if(!$filterString)
				// {
				// 	$filterString += 'Type is '+($filterType||'member') ;
				// }
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

} );