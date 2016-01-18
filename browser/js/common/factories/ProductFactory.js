app.factory('ProductFactory', function ($http, Session) {
    var factory = {};
    var recProducts = [];

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

    factory.createNewProduct = (newProduct) => {
        return $http({
            method: 'POST',
            url: '/api/product/',
            data: newProduct
        })
        .then((response)=> {
            return response.data;
        })
    }

    factory.updateProduct = (id, update) => {
        return $http({
            method: 'PUT',
            url: '/api/product/' + id,
            data: update
        })
        .then((response)=> {
            return response.data;
        })
    }

     factory.deleteProduct = (id) => {
        return $http({
            method: 'DELETE',
            url: '/api/product/' + id
        })
        .then((response)=> {
            return response.data;
        })
    }

    return factory;

});
