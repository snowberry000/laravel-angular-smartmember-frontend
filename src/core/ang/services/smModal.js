app.factory( 'smModal', ['$rootScope', function( $rootScope )
{
	return {
		ClearModals: function()
		{
			//$rootScope.loaded_modals = [];
			$rootScope.primary_modal_template = '';
		},
		AddModal: function( template_path )
		{
			console.log( "pushing this modal: ", template_path );
			//$rootScope.loaded_modals.push( template_path );
			$rootScope.primary_modal_template = template_path;

			console.log( "Loaded modals: ", $rootScope.loaded_modals );
		},
		PopModals: function()
		{
			console.log( "showing this modal: ", $rootScope.primary_modal_template );
			//$('.ui.modal').modal( 'hide all' );
			$('.ui.modal').modal({
				allowMultiple: false,
				onHidden: function(e){

					//$rootScope.loaded_modals = [];

					$(this).remove();
				}
			}).modal( 'show' );

		},
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

}]);