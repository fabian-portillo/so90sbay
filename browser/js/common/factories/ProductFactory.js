app.factory('ProductFactory', function ($http) {
    var factory = {};

    factory.getAllProducts = () => {
        return $http({
            method: 'GET',
            url: '/api/product'
        })
        .then((response)=> {
            return response.data;
        })
    }

    factory.getProductById = (id) => {
        return $http({
            method: 'GET',
            url: '/api/product/' + id
        })
        .then((response)=> {
            return response.data;
        })
    }

    factory.getProductReviews = (id) => {
        return $http({
            method: 'GET',
            url: '/api/product/' + id + '/reviews'
        })
        .then((response)=> {
            return response.data;
        })
    }

    factory.getProductCategories = (category) => {
        return $http({
            method: 'GET',
            url: '/api/product/category/' + category
        })
        .then((response)=> {
            return response.data;
        })
    }

    factory.createNewProduct = () => {
        return $http({
            method: 'POST',
            url: '/api/product/'
        })
        .then((response)=> {
            return response.data;
        })
    }

    return factory;

});
