app.directive( 'suiModalTrigger', [ '$rootScope', 'smModal', '$templateCache', function( $rootScope, smModal, $templateCache )
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$( next_item ).click( function( e )
			{
				var template = $templateCache.get( $rootScope.$state.get( attributes.state ).templateUrl );

				console.log( 'the template url', $rootScope.$state.get( attributes.state ).templateUrl, 'the template', template, 'the state', attributes.state );
				$('body').append( template );

				smModal.show( attributes.state, {});

			} );
		}
	};
} ] );