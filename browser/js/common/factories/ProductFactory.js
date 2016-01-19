app.factory('ProductFactory', function ($http, $q) {
    var factory = {};
    var cachedSimilarCats = [];

    factory.getAllProducts = function() {
        return $http({
            method: 'GET',
            url: '/api/product'
        })
        .then(function(response) {
            return response.data;
        })
    }

    factory.getProductById = function(id) {
        return $http({
            method: 'GET',
            url: '/api/product/' + id
        })
        .then(function(response) {
            return response.data;
        })
    }

    factory.getProductReviews = function(id) {
        return $http({
            method: 'GET',
            url: '/api/product/' + id + '/reviews'
        })
        .then(function(response) {
            return response.data;
        })
    }

    factory.getProductCategories = function(category) {
        return $http({
            method: 'GET',
            url: '/api/product/category/' + category
        })
        .then(function(response) {
            return response.data;
        })
    }

    factory.getMultipleCats = function(array) {
        var promisifiedCats = array.map(function (cat) {
            return factory.getProductCategories(cat);
        });
        return $q.all(promisifiedCats)
            .then(function (products) {
                angular.copy(products[0], cachedSimilarCats)
                return cachedSimilarCats;
            });
    }

    factory.createNewProduct = function(newProduct) {
        return $http({
            method: 'POST',
            url: '/api/product/',
            data: newProduct
        })
        .then(function(response) {
            return response.data;
        })
    }

    factory.updateProduct = function(id, update) {
        return $http({
            method: 'PUT',
            url: '/api/product/' + id,
            data: update
        })
        .then(function(response) {
            return response.data;
        })
    }

     factory.deleteProduct = function(id) {
        return $http({
            method: 'DELETE',
            url: '/api/product/' + id
        })
        .then(function(response) {
            return response.data;
        })
    }

    return factory;

});
