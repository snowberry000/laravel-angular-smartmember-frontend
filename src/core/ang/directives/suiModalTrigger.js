app.directive( 'suiModalTrigger', [ 'smModal', '$templateCache', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$( next_item ).click( function( e )
			{
				//smModal.ClearModals();
				scope.ShowModal( attributes.template );

				//smModal.show( attributes.state, {});

			} );
		}
	};
} ] );
