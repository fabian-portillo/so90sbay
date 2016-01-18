app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        resolve: {
            allProducts: function (ProductFactory) {
                return ProductFactory.getAllProducts();
            },
            recProducts: function (ProductFactory, Session, $q) {
                var productsToReturn
                if (Session.user) {    
                    var promisifiedProducts = Session.user.recHistory.map(function (id) {
                        return ProductFactory.getProductById(id);
                    });
                    return $q.all(promisifiedProducts)
                        .then(function (arrayOfAllProducts) {
                            productsToReturn = arrayOfAllProducts;
                        })
                        .then(function () {
                            return function () {
                                return productsToReturn;
                            }
                        })
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