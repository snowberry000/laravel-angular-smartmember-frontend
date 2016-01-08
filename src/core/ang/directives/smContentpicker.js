// app.directive('urlSelector', function ( $parse) {
//   return {
//     restrict : 'A',
//     scope: '=',//{ method:'&method' },
//     replace : false ,
//     require : 'ngModel',
//     templateUrl: function(elem,attrs) {
//        return attrs.templateUrl || "templates/modals/popover.html"
//     },
//     link : function(scope, element, attrs , ctrl) {
//        scope.$watch('ctrl.$viewValue',function(){
//          scope.model = ctrl.$viewValue;
//          if(attrs.type)
//             scope.model.type = attrs.type;

//        }

//       )
//     }
//  }
// });

app.directive( 'smContentpicker', function( smModal, $compile )
{
	return {
		restrict: 'AE',
		scope: '=',
		require: 'ngModel',
		templateUrl: 'templates/modals/content-picker.html',
		link: function( scope, next_item, attributes, ctrl )
		{
			var the_options = {
				onShow: function( el )
				{ // load data (it could be called in an external function.)
					var popup = this;
					if( attributes.html )
					{
						$.ajax( {
							url: attributes.html
						} ).done( function( result )
						{
							popup.html( result );
							$compile( popup.contents() )( scope );
						} ).fail( function()
						{
							popup.html( 'error' );
						} );
					}
				}
			};

			scope.$watch( 'selected_url', function( new_value, old_value )
			{
				console.log( "our value changed from " + old_value + " to " + new_value );

            }, true);

			$(next_item).dropdown( the_options );

            scope.next_item = next_item;
		},
		controller: function( $scope )
		{
			$scope.close = function()
			{
				$( $scope.next_item ).popup( 'remove popup' );
			}
		}
	};
} );