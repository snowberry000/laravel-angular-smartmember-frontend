app.directive( 'suiAccordion', ['smModal', function( smModal )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$( next_item ).accordion( {
				duration: 100,
				onChange: function()
				{
					smModal.Refresh();
				}
			} );
		}
	};
}]);