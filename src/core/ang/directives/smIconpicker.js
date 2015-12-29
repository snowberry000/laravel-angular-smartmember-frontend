app.directive( 'smIconpicker', function($http)
{
	return {
		restrict: 'E',
		scope : '=',
		templateUrl: 'templates/modals/iconpicker.html',
		link: function( scope, element, attrs )
		{
			scope.modalIcon=attrs.icon;
			scope.selected =function ($icon){
		    	scope.modalIcon=$icon.iconClass;
		    }
		},
		controller: function ($scope, $element,$http) {
		    $scope.init = function () {
		    	$http.get('json/icons.json').success(function(response) {
		    		$icons = response.data;
		    		$scope.icons=$icons;
	    	        return response.data;
	    	    });
		    }
		    $scope.search = function ($query){
		    	$scope.icons = _.filter($icons, function($icon){ return $icon.iconName.toUpperCase().indexOf($query.toUpperCase())>-1; });
		    }
		}
	};
} );