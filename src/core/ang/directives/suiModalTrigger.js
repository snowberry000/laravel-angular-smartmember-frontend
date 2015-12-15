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

app.directive('suiModal', [ 'smModal', function( smModal ){
	return {
		transclude: true,
		restrict: 'EA',
		template: '{{name}}',
		scope: {
			useCtrl: "@",
			email: "@"
		},
		link: function(scope, element, attrs) {

			$( element ).click( function( e )
			{
				scope.open();
			} );

			scope.open = function(){

				console.log( 'trying to open' );
				smModal.show( attrs.state, {});

				console.log( 'just opened?' );

				/*var modalInstance = $modal.open({
					templateUrl: templateDir+attrs.instanceTemplate +'.tpl.html',
					controller:  scope.useCtrl,
					size: 'lg',
					windowClass: 'app-modal-window',
					backdrop: true,
					resolve: {
						custEmail: function(){
							return {email: scope.email};
						}
					}
				});
				modalInstance.result.then(function(){
					console.log('Finished');
				}, function(){
					console.log('Modal dismissed at : ' + new Date());
				});*/
			};
		}
	};
}]);