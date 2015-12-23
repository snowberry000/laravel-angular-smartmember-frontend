app.directive( 'suiPopup', function()
{
	return {
		restrict: 'A',
		link: function( scope, next_item, attributes )
		{
			var the_options = {
				hoverable: attributes.edit ? true : (attributes.hoverable || false),
				position : attributes.position || 'top center',
				html: attributes.edit ? '<button class="ui tiny red button" ng-click="smModal.Show(\'' + attributes.state + '\'' + (attributes.stateattributes ? ',' + attributes.stateattributes : '') + ');">edit</button>' : '',
				target : attributes.target || '',
				exclusive: true,
				preserve: true,
				delay: {
					show: 100,
					hide: attributes.edit ? 500 : 20
				}
			};

			//console.log( the_options, attributes );

			$(next_item).popup(the_options);
		}
	};
} );