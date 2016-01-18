app.directive('productList', function (ProductFactory) {
	return {
		restrict: 'E',
		templateUrl: 'js/common/directives/product-list/product-list.html',
		scope: {
			products: '='
		},
		link: function(scope){
			scope.currentOrder = ''
			scope.setOrder = (filter) => {
				scope.currentOrder = filter;
			}
		}
	}
})