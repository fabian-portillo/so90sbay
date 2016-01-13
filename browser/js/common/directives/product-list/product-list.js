app.directive('productList', function (ProductFactory) {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/product-list/product-list.html',
		scope: {
			products: '='
		}
	}
})