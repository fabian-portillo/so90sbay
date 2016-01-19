app.factory( 'UserFactory', function( $http, ProductFactory, $q ) {

  var UserFactory = {};
  var cachedRecHistory = [];

  var transformToBody = function( res ) { return res.data };

  UserFactory.fetchAll = function() {

    return $http.get('/api/user')
    .then( transformToBody );

  }

  UserFactory.getRecHistory = function ( id ) {

    return $http.get('/api/user/' + id)
      .then(function (user) {
        return user.data.recHistory.reduce(function (prev, current) {
          if (prev.indexOf(current) < 0) {
            prev.push(current);
            return prev;
          }
        }, []);
      })
      .then(function (filteredRecHistory) {
        return filteredRecHistory.map(function (idxOfProduct) {
          return ProductFactory.getProductById(idxOfProduct);
        })
      })
      .then(function (promisifiedProductArray) {
        return $q.all(promisifiedProductArray);
      })
      .then(function (productsArray) {
        angular.copy(productsArray, cachedRecHistory);
        return cachedRecHistory;
      })
  }

  UserFactory.update = function( id, data ) {

    return $http.put('/api/user/' + id, data)
    .then( transformToBody );

  }

  UserFactory.delete = function( id ) {

    return $http.delete('/api/user/' + id);

  }

  return UserFactory;

});
