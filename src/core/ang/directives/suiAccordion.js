app.directive( 'suiAccordion', ['smModal', '$timeout', function( smModal, $timeout )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$( next_item ).accordion( {
				duration: 100,
				onChange: function()
				{
					$timeout( function()
					{
						//smModal.Refresh();
					}, 100 );
				}
			} );
		}
	};
}]);