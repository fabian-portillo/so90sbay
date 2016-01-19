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
            $scope.slides = [{title: 'Dope Toys', image: 'http://i.imgur.com/1SvIQ3z.png', state:'categoryList ({ category: "toys" })'}, {title: 'Video games', image: 'http://i.imgur.com/DFgIs9i.jpg', state:'categoryList ({ category: "video games" })'}, {title: 'Fresh CDs', image: 'http://i.imgur.com/CQSYCda.jpg', state:'categoryList ({ category: "music" })'}, {title: 'Beanie Babies', image: 'http://i.imgur.com/dcd6GJo.jpg', state:'categoryList ({ category: "beanie babies" })'}, {title: 'Furbymania', image: 'http://i.imgur.com/xrw9b3t.png', state:'categoryList ({ category: "toys" })'}];
        },

    });
});