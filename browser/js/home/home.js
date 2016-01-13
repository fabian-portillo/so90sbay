app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function ($scope, ProductFactory, allProducts) {
        	$scope.products = allProducts;
            $scope.slides = [{text: 'test', image: 'http://cdn.buzznet.com/assets/users16/pattygopez/default/justin-timberlake-britney-spears--large-msg-131118867529.jpg'}, {text: 'test2', image: 'http://toysfromthe90s.com/wp-content/uploads/2015/03/pogs.jpg'}];
        },
        resolve: {
        	allProducts: function(ProductFactory){
        		return ProductFactory.getAllProducts();
        	}
        }
    });
});