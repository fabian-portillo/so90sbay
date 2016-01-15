app.factory('SearchFactory', function ($http, $state) {
	var factory = {};

	factory.search = (search) => {
		return $http({
			method: 'POST',
			url: '/api/product/search',
			data: {searchInput: search},
			headers: {'Content-Type': 'application/json'}
		})
		.then((response)=>{
			$state.get('searchResults').data.searchResults = response.data;
		})
		.then(()=>{
			if($state.$current.name === 'searchResults'){
				$state.go($state.current, {}, {reload: true});
			}
			else $state.go('searchResults')
		})
	}

	return factory;
})