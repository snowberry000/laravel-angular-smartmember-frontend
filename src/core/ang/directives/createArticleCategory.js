app.directive( 'smCreate', function()
{
	return {
		restrict: 'A',
		scope: '=',
		templateUrl: 'templates/modals/create_category.html',
		link: function( scope, element, attrs )
		{
			scope.modalIcon = attrs.icon;
			scope.selected = function( $icon )
			{
				scope.modalIcon = $icon.iconClass;
			}
		}
	};
});