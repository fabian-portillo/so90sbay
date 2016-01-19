app.factory( 'UserFactory', function( $http ) {

  var UserFactory = {};

  var transformToBody = function( res ) { return res.data };

  UserFactory.fetchAll = function() {

    return $http.get('/api/user')
    .then( transformToBody );

  }

  UserFactory.update = function( id, data ) {

    return $http.put('/api/user/' + id, data)
    .then( transformToBody );

  }

  UserFactory.delete = function( id ) {

    return $http.delete('/api/user/' + id);

  }

  UserFactory.getOrders = function( id ) {

    return $http.get('/api/user/' + id + '/orders')
    .then( res => res.data )
    .then( null, function(err) {
      return { error: err };
    });

  } 

  return UserFactory;

});