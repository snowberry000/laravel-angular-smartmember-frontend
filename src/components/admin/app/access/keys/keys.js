var app = angular.module( "app" );

app.config( function( $stateProvider )
{
	$stateProvider
		.state( "admin.app.access.keys", {
			url: "/keys/:segment",
			templateUrl: "/templates/components/admin/app/access/keys/keys.html",
			controller: "KeysAccessController"
		} )
} );

app.controller( "KeysAccessController", function( $scope, Restangular, RestangularV3 ,$rootScope, $stateParams, $state, smMembers, $http,$timeout )
{

	$scope.loading = false;
	$scope.keys = [];

	var search_parameters = {
	}
	
	$scope.pagination = {
		current_page: 1,
		per_page: 25,
		total_count: 0
	};

	if( !$stateParams.segment )
	{
		$state.params.segment = 'all-live';

		$state.go( $state.current, $state.params, {reload:true} );
		return;
	}

	if( $stateParams.segment=='all-live' )
	{
		$scope.page_title = 'All live keys';
	}
	else if( $stateParams.segment=='all-drafts' )
	{
		$scope.page_title = 'All draft keys';
	}
	else
	{
		$scope.page_title = 'All keys';
	}

	$scope.$watch( 'pagination.current_page', function( new_value, old_value )
	{
		if( new_value != old_value )
		{
			$scope.paginate();
		}
	} );

	
	$scope.paginate = function(){
		$scope.loading =true;
		search_parameters.p = $scope.pagination.current_page;
		if( $stateParams.segment=='all-live' )
		{
			search_parameters.activated = true;
		}
		else if( $stateParams.segment=='all-drafts' )
		{
			search_parameters.activated = false;
		}

		RestangularV3.all( '' ).customGET( 'key' ,search_parameters).then( function( data ){
			$scope.loading = false;
			$scope.keys = data.items;
			$scope.pagination.total_count = data.total_count;
		})
	}

	$scope.paginate();

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

	$scope.CreateNewKey = function()
	{
		// Create a new message, then redirect to edit it
		$state.go( 'admin.app.access.edit-key');
	}

	
});