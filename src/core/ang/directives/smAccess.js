app.directive( 'smAccess', function()
{
	return {
		restrict: 'A',
		link: function( scope, element, attributes ){
			var take_action = true;

			for (var i = 0; i < scope.site.capabilities.length; i++) {
				if(scope.site.capabilities[i] == attributes.smAccess){
					return;
				}
			}

			if (take_action){
				switch(attributes.ifNot){
					case 'hide': 
						$(element).hide();
						break;
					case 'disable':
						$(element).prop('disable',true);
						break;
				}
			}
		}
	};
});