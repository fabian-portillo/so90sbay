app.config(function ($stateProvider){
	$stateProvider.state('searchResults', {
		url: '/product/search-results',
		templateUrl: '/js/search-results/search-results.html',
		controller: function($scope, $state, $timeout) {
			$scope.products = [];
			$timeout(function() {
                $scope.products = $state.get('searchResults').data.searchResults;  
            }, 500);
		},
		data: {searchResults: null}
	})
})