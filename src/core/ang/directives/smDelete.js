app.directive( 'smDelete', function()
{
	return {
		restrict: 'A',
		link: function( scope, element, attributes ){
			element.bind('click',function(){
				console.log(attributes);

				$(".delete.modal")
					.modal('setting',{
						onApprove: function(){
							alert(attributes.smDelete);
							scope.deleteResource(attributes.smDelete)
						}
					})
					.modal('show');

				console.log("Delete modal");
			});
		}
	};
});