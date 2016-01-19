app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        resolve: {
            allProducts: function (ProductFactory) {
                return ProductFactory.getAllProducts();
            },
            recProducts: function (UserFactory, AuthService) {
                return AuthService.getLoggedInUser().then(function (user) {
                    if (user) {
                        return UserFactory.getRecHistory(user._id);
                    } else {
                        return;
                    }
                });
            },
            similarProducts: function (ProductFactory, recProducts) {
                return ProductFactory.getMultipleCats(recProducts[recProducts.length - 1].category);
            }
        },
        controller: function ($scope, ProductFactory, allProducts, recProducts, $timeout, similarProducts) {
            $scope.products = [];
            $timeout(function() {
                if (recProducts) {
                    $scope.recentlyViewed = recProducts.slice(-4);
                    $scope.products = similarProducts;
                } else {
                    $scope.products = allProducts;
                }
            }, 1000);
            $scope.slides = [{image: 'http://i.imgur.com/vSt2W4A.png', state:'categoryList ({ category: "toys" })'}, {image: 'http://i.imgur.com/xrw9b3t.png', state:'categoryList ({ category: "video games" })'}];
        },

    });
});