app.directive( 'smEditable', function()
{
	return {
		restrict: 'A',
		link: function( scope, element, attributes ){
			$.fn.editable.defaults.mode = 'inline';
			scope.$watch(attributes.isEditable , function(value){
				//console.log(value);
				if(value){
					$(element).editable('show');
				}else{
					$(element).editable('hide');
				}
			})
			$(element).editable({
				type: 'text',
				toggle : 'manual'
			})
		}
	};
});