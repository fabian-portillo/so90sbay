app.factory('ReviewFactory', function ($http) {
	var factory = {};

	factory.addReview = (newReview) => {
		return $http({
			method: 'POST',
			url:'/api/review/',
			data: newReview
		})
		.then((response)=> {
			return response.data;
		})
	}
	return factory;
})