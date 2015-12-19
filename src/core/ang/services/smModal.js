app.factory( 'smModal', [ '$state', 'ModalService', function( $state, ModalService )
{
	return {
		Show: function( state )
		{
			var state_data = $state.get( state );
			console.log( 'state_data', state, state_data );

			// Just provide a template url, a controller and call 'showModal'.
			ModalService.showModal( {
				templateUrl: state_data.templateUrl,
				controller: state_data.controller ? state_data.controller : function()
				{
				}
			} ).then( function( modal )
			{
				// The modal object has the element built, if this is a bootstrap modal
				// you can call 'modal' to show it, if it's a custom modal just show or hide
				// it as you need to.
				modal.element.modal( {
					observeChanges: true,
					inverted: false,
					duration: 100,
					dimmerSettings: {
						opacity:0.3
					}
				} ).modal( 'show' );

				modal.close.then( function( result )
				{
					console.log( "I guess we closed it?" );
					$scope.message = result ? "You said Yes" : "You said No";
				} );
			} );
		},
		show_old: function( modal_id, options )
		{
			$( modal_id ).modal( options ).modal( 'show' );
		},
		attach: function( modal_id, events )
		{
			console.log( 'attaching ' + events + ' to ' + modal_id );
			$( modal_id ).modal( 'attach events', events );
		},
		next: function( modal_id, options, events )
		{
			$( modal_id ).modal( options ).modal( 'attach events', events );
		},
		toggle: function( modal_id, options )
		{
			$( modal_id ).modal( options ).modal( 'toggle' );
		},
		hide: function( modal_id )
		{

			if( modal_id )
			{
				$( modal_id ).modal( 'hide' );
			}
			else
			{
				$( '.ui.modal' ).modal( 'hide' );
			}
		}
	};

} ] );