app.directive( 'suiModalTrigger', [ '$rootScope', 'smModal', '$templateCache', function( $rootScope, smModal, $templateCache )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$( next_item ).click( function( e )
			{
				//smModal.ClearModals();
				smModal.AddModal( attributes.template );
				smModal.PopModals();

				//smModal.show( attributes.state, {});

			} );
		}
	};
} ] );
