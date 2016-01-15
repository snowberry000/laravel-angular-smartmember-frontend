describe('PublicController', function() {
	beforeEach(module('app'));

	var $controller;

	beforeEach(inject(function(_$controller_){
		// The injector unwraps the underscores (_) from around the parameter names when matching
		$controller = _$controller_;
	}));

	describe('$scope.isSitelessPage', function() {
		var $scope, controller;

		beforeEach(function() {
			$scope = {};
			controller = $controller('PublicController', { $scope: $scope });
		});

		it('returns true if the current page doesn\'t belong to a site', function() {
			$scope.current_hostname = 'help.smartmember.com';
			expect( $scope.isSitelessPage() ).toEqual(false);
		});
		it('returns true if the current page belongs to system', function() {
			$scope.current_hostname = 'my.smartmember.com';
			expect( $scope.isSitelessPage() ).toEqual(true);
		});
		it('returns true if the "www" page belongs to system', function() {
			$scope.current_hostname = 'www.smartmember.com';
			expect( $scope.isSitelessPage() ).toEqual(true);
		});
	});
});