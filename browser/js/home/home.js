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
                })
            }
        },
        controller: function ($scope, ProductFactory, allProducts, recProducts, $timeout) {
            $scope.products = [];
            $timeout(function() {
                $scope.products = recProducts ? recProducts : allProducts;
            }, 1000);
            $scope.slides = [{image: 'http://i.imgur.com/vSt2W4A.png', state:'categoryList ({ category: "toys" })'}, {image: 'http://i.imgur.com/xrw9b3t.png', state:'categoryList ({ category: "video games" })'}];
        },

    });
});