app.controller( 'UsersPanelCtrl', function( $scope, UserFactory, search ) {

  $scope.search = search;

  $scope.saveUser = function( u ) {

    var uid = u._id;
    delete u._id;

    UserFactory.update( uid, u )
    .then( function( updatedUser ) {
      
      var uidx = $scope.users.indexOf( u );
      $scope.users[uidx] = updatedUser;

    });

  }

  $scope.deleteUser = function( u ) {

    if ( confirm( "Are you sure you want to delete " + u.email + "? This action cannot be undone." ) ) {

      UserFactory.delete( u._id )
      .then( function() {

        var uidx = $scope.users.indexOf( u );
        $scope.users.splice( uidx, 1 );

      });

    }

  }

  UserFactory.fetchAll()
  .then( function( users ) {

    $scope.users = users;

  })

});