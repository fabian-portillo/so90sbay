app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function ($scope, ProductFactory, allProducts) {
        	$scope.products = allProducts;
            $scope.slides = [{image: 'http://i.imgur.com/vSt2W4A.png', state:'categoryList ({ category: "toys" })'}, {image: 'http://i.imgur.com/xrw9b3t.png', state:'categoryList ({ category: "video games" })'}];
        },
        resolve: {
        	allProducts: function(ProductFactory){
        		return ProductFactory.getAllProducts();
        	}
        }
    });
});