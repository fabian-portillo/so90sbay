app.config(function ($stateProvider){
	$stateProvider.state('searchResults', {
		url: '/product/search-results',
		templateUrl: '/js/search-results/search-results.html',
		controller: function($scope, $state) {
			$scope.products = $state.get('searchResults').data.searchResults;
		},
		data: {searchResults: null}
	})
})