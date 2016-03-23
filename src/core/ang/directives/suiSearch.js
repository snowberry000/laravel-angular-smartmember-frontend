app.directive( 'suiSearch', [ '$http', '$localStorage', function( $http, $localStorage )
{
	return {
		templateUrl: '/templates/modals/search.html',
		restrict: 'A',
		controller: function($scope,Restangular,$rootScope, toastr , RestangularV3){
			
			// $scope.$watch('query',function(){
			// 	$scope.search();
			// });
			// $scope.query='';
			$scope.result = null;
			$rootScope.searchLoading = false;
			var body = angular.element(document).find('body');

			$scope.search = function(){
				
				$scope.result=null;
				$scope.hideSearch = false;
				var route = $scope.route+'?q='+ encodeURIComponent($scope.query);
				if($scope.params){
					route = $scope.route+'?q='+ encodeURIComponent($scope.query) + '&' + $scope.params;
				}

				if($scope.api=="3")
				{
					if($scope.query.length > 0)
					{
						$rootScope.searchLoading = true;
						RestangularV3.all('').customGET(route).then(function(response){
							$scope.result = response;
							if(response.items)
							{
								$scope.result = response.items;
							}
							$rootScope.searchLoading = false;
						});
					}
				} 
				else if($scope.query.length > 0)
				{
					$rootScope.searchLoading = true;
					Restangular.all('').customGET($scope.route+'?q='+ encodeURIComponent($scope.query)).then(function(response){
						$scope.result = response;
						if(response.items)
						{
							$scope.result = response.items;
						}
						$rootScope.searchLoading = false;
					});
				}
			}

			if($scope.searchQuery)
			{
				// alert($scope.searchQuery);
				$scope.query=$scope.searchQuery;
				setTimeout(function() {$scope.search();}, 1000);
				
			}

			

			body.click(function(event) {
			
				if(event.target.classList[1] != "search-filter"){
					$scope.hideSearch = true;
					$scope.$apply();
				}else{
					$scope.hideSearch = false;
					$scope.$apply();
				}
			});
			
		},
		link: function( scope, next_item, attributes )
		{
			scope.route = attributes. route;
			scope.redirect =  attributes.redirect;
			scope.api = attributes.api;
			scope.searchQuery = attributes.searchQuery;
			scope.params = attributes.params || null;
		}
		// link: function( scope, next_item, attributes )
		// {
		// 	var options = {
		// 		type: 'category',
		// 		searchDelay : 2000,
		// 		apiSettings: {
		// 			url: attributes.url + '?q={query}' || scope.app.apiUrl + '/lesson?q={query}',
		// 			beforeXHR: function( xhr )
		// 			{
		// 				// adjust XHR with additional headers
		// 				xhr.setRequestHeader( 'Authorization', 'Basic ' + $localStorage.user.access_token );
		// 				return xhr;
		// 			},
		// 			onResponse: function( the_data )
		// 			{

		// 				console.log( 'the_data', the_data );
		// 				var response = {
		// 					results: {}
		// 				};
		// 				// translate GitHub API response to work with search
		// 				if(the_data.total_count)
		// 				{
		// 					the_data = the_data.items;
		// 				}

		// 				$.each( the_data, function( index, item )
		// 				{
		// 					var maxResults = 8;
		// 					if( index >= maxResults )
		// 					{
		// 						return false;
		// 					}
		// 					// create new language category
		// 					if( response.results[attributes.route] === undefined )
		// 					{
		// 						response.results[attributes.route] = {
		// 							name: attributes.name,
		// 							results: []
		// 						};
		// 					}
		// 					// add result to category
		// 					// var url = item.permalink || (attributes.redirect + item._id);
		// 					var url = attributes.redirect + item._id;
		// 					response.results[attributes.route].results.push( {
		// 						title: item.title || item.name,
		// 						description: '',//item.content,
		// 						url: '/' + url 
		// 					} );
		// 				} );
		// 				return response;
		// 			},
		// 		}
		// 	};

		// 	$( next_item ).search( options );
		// }
	};
} ] );