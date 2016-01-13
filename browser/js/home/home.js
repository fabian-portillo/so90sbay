app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: function ($scope, ProductFactory, theProducts) {
          $scope.products = theProducts;
        },
        resolve: {
          theProducts: function(ProductFactory){
            return ProductFactory.getAllProducts();
          }
        }
    });
});