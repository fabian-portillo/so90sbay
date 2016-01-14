app.config(function ($stateProvider){
	$stateProvider.state('categoryList', {
		url: '/product/category/:category',
		templateUrl: '/js/list-by-category/categoryList.html',
		controller: function($scope, ProductFactory, catProducts) {
			$scope.products = catProducts;
		},
		resolve: {
			catProducts: function (ProductFactory, $stateParams) {
				return ProductFactory.getProductCategories($stateParams.category);
			}
		}
	})
})