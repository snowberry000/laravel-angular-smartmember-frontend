app.directive( 'suiRating', function($timeout)
{
	return {
		restrict: 'A',
		require: 'ngModel',
		link: function( scope, next_item, attributes, model )
		{
			var options = {};
			

			options.onRate = function(value){
				model.$setViewValue(value)
			}
			options.maxRating = 5;
			options.initialRating = attributes.initialRating || 0;
			options.interactive = attributes.interactive=="true" ? true : false;

			$(next_item).rating( options );
		}
	};
} );