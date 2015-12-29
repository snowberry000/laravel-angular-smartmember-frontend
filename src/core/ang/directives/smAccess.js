app.directive( 'smAccess', function()
{
	return {
		restrict: 'A',
		link: function( scope, element, attributes ){
			var take_action = false;

			for (var i = 0; i < scope.site.capabilities.length; i++) {
				if(scope.site.capabilities[i] == attributes.smAccess){
					take_action = true;
					break;
				}
			}

			if (take_action){
				alert("Take Action");
			}else{
				alert("DO not take action");
			}


			console.log(scope.site.capabilities);
		}
	};
});