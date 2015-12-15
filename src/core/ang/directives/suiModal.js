app.directive( 'suiModal', ['$rootScope', function($rootScope,$state)
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			$(next_item).click( function(e) {

				if( attributes.secondary_modal )
				{
					$rootScope.secondary_modal = $rootScope.$state.get( attributes.state ).templateUrl;
					$('.secondary_modal' ).modal('show');
				}
				else
				{
					$rootScope.primary_modal = $rootScope.$state.get( attributes.state ).templateUrl;
					$('.primary_modal').modal('show');
				}

			});
		}
	};
} ]);