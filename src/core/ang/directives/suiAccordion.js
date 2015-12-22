app.directive( 'suiAccordion', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$(next_item).accordion();
		}
	};
} );