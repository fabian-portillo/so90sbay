app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function ($scope, ProductFactory, allProducts) {
        	$scope.products = allProducts;
        },
        resolve: {
        	allProducts: function(ProductFactory){
        		return ProductFactory.getAllProducts();
        	}
        }
    });
});