app.directive( 'smDelete', function()
{
	return {
		restrict: 'A',
		link: function( scope, element, attributes ){
			element.bind('click',function(){
				$(".small.delete.modal")
					.modal({
						allowMultiple: true,
						onApprove: function(){
							scope.deleteResource(attributes.smDelete);
							$(".small.delete.modal").modal('hide');
							return true;
						}
					})
					.modal('show');
			});
		}
	};
});