app.factory('ReviewFactory', function ($http, $rootScope) {
	var factory = {};

	factory.addReview = (newReview) => {
		return $http({
			method: 'POST',
			url:'/api/review/',
			data: newReview
		})
		.then((response)=> {
			//trigger loader through product-detailsCTRL
			$rootScope.$broadcast('reviewsUpdated', newReview);

			return response.data;
		})
		
	}
	return factory;
})