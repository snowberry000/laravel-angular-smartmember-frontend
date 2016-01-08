app.directive( 'suiProgress', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var the_options = {
				text: {
					success: 'setup completed!'
				}
			};

			if( attributes.text == 'member' )
			{
				the_options[ 'text' ] = {
					active: 'Importing: {value} of ' + attributes.total + ' members processed',
					success: '{total} Members Imported!'
				};
			}

			$( next_item ).progress( the_options );

			console.log( 'progress options', the_options );
			console.log( 'progress attributes', attributes );
			if( attributes.starttrigger )
			{
				$( next_item ).progress( 'increment', attributes.value );
			}

			scope.next_item = next_item;
			/*scope.$watch(attributes.value, function(value){

			 if( attributes.value > 0 )
			 $(next_item).progress('increment', value);//( value );
			 });*/
		},
		controller: function( $scope, $rootScope )
		{
			$rootScope.$watch( 'site.wizard_step', function( value )
			{
				console.log( 'we got some wizard values: ', value );
				if( value && $rootScope.site && $rootScope.site.wizard_step )
				{
					if( $rootScope.site.wizard_step > 0 )
					{
						$( $scope.next_item ).progress( { value: value } );
					}//( value );
				}
				else
				{
					$( $scope.next_item ).progress( { value: 0 } );//( value );
				}
			} );
		}
	};
} );