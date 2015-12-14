app.factory( 'smModal', function()
{
	return {
		show: function( modal_id, options )
		{
			$(modal_id ).modal( options ).modal( 'show' );
		},
		attach: function( modal_id, events )
		{
			console.log( 'attaching ' + events + ' to ' + modal_id );
			$(modal_id ).modal( 'attach events', events );
		},
		next: function( modal_id, options, events )
		{
			$(modal_id ).modal( options ).modal( 'attach events', events );
		},
		toggle : function( modal_id, options )
		{
			$(modal_id ).modal( options ).modal( 'toggle' );
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

} );