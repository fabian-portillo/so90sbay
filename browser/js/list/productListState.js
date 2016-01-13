app.config(function($stateProvider){
	$stateProvider.state('productList', {
		url: '/product-category',
		templateUrl: '/js/list/product-list.html',
		controller: function ($scope, ProductFactory, theProducts) {
			$scope.products = theProducts;
		},
		resolve: {
			theProducts: function (ProductFactory) {
				return ProductFactory.getAllProducts();
			}
		}			
	})
})