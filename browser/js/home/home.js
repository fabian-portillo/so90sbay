app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        resolve: {
            allProducts: function (ProductFactory) {
                return ProductFactory.getAllProducts();
            },
            recProducts: function (UserFactory, Session) {
                if (Session.user) {
                    return UserFactory.getRecHistory(Session.user._id);
                }
            }
        },
        controller: function ($scope, ProductFactory, allProducts, recProducts, Session, $timeout) {
            $scope.products = [];
            $timeout(function() {
                $scope.products = recProducts ? recProducts : allProducts;
            }, 1000);
            $scope.slides = [{image: 'http://i.imgur.com/vSt2W4A.png', state:'categoryList ({ category: "toys" })'}, {image: 'http://i.imgur.com/xrw9b3t.png', state:'categoryList ({ category: "video games" })'}];
        },

    });
});