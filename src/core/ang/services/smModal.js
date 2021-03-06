app.factory( 'smModal', [ '$state', 'ModalService' , '$rootScope', function( $state, ModalService , $rootScope)
{
	return {
		Show: function( state, params, state_data, cb )
		{
			if( state_data )
			{
				var state_data = state_data;
			}
			else
			{
				var state_data = $state.get( state );
			}

			//console.log( 'params', params );
			//console.log( stateParams )
			var stateParams = {};
			if( params )
			{
				angular.forEach( params, function( value, key )
				{
					if( key != 'modal_options' )
					{
						stateParams[ key ] = value;
					}
				} )
			}

			// Just provide a template url, a controller and call 'showModal'.
			ModalService.showModal( {
				templateUrl: typeof state_data.templateUrl == 'function' ? state_data.templateUrl( stateParams ) : state_data.templateUrl,
				controller: state_data.controller ? state_data.controller : function()
				{
				},
				inputs: {
					$stateParams: stateParams
				}
			} ).then( function( modal )
			{
				var parts = location.hostname.split( '.' );
				var subdomain = parts.shift();
				if($rootScope)
					$rootScope.current_modal = modal;
				var the_options = {
					observeChanges: true,
					duration: 100,
					closable: subdomain == 'my' ? false : false,
					autofocus: false,
					dimmerSettings: {
						opacity: 0.3
					},
					context: 'body'
				};

				if( params && params.modal_options )
				{
					angular.forEach( params.modal_options, function( value, key )
					{
						the_options[ key ] = value;
					} )
				}

				the_options.onVisible = function()
				{
                    modal.element.closest('.ui.dimmer').css( 'z-index', 999999 );
					modal.element.addClass( 'smooth_changes' );
					$('.ui.popup').popup( 'hide all' );
				};
				the_options.onHidden = function()
				{
					modal.element.removeClass( 'smooth_changes' );


				};

				//console.log( 'the_options:', the_options );
				// The modal object has the element built, if this is a bootstrap modal
				// you can call 'modal' to show it, if it's a custom modal just show or hide
				// it as you need to.
				modal.element.modal( the_options).modal( 'show' );

				modal.close.then( function( result )
				{
					if( !the_options.allowMultiple || the_options.allowMultiple == 'false' )
					{
						// force-close the dimmer incase it gets stuck
						$('.ui.dimmer').dimmer('hide');
					}

					modal.element.remove();
					console.log( "I guess we closed it?" );
					//$scope.message = result ? "You said Yes" : "You said No";
					if( cb )
					{
						cb( result );
					}
				} );
			} );
		},
		Close: function( state )
		{
			$( '.ui.modal' ).modal( 'hide all' );
		},
		Refresh: function()
		{
			$( '.ui.modal' ).modal( 'refresh' );
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