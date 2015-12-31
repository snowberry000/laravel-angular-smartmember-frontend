app.directive( 'smAccess', function()
{
	return {
		restrict: 'A',
		link: function( scope, element, attributes ){
			var take_action = true;
			if (attributes.type && (attributes.type == 1 || (attributes.type==3 && scope.site.is_member))){
				return;
			}

			for (var i = 0; i < scope.site.capabilities.length; i++) {

				if(scope.site.capabilities[i] == attributes.smAccess){
					//Check if user has appropriate access level
					if (!scope.site.is_admin && attributes.smAccess == "view_restricted_content"){
						for (var i = 0; i < scope.site.current_access_levels.length; i++) {
							if(scope.site.current_access_levels[i] == attributes.level){
								return;
							}
						};
					}else{
						return;
					}
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
					case "show":
						$(element).show();
						break;
				}
			}
		}
	};
});