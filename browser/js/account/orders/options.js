app.config( function( $stateProvider ) {

  $stateProvider.state( 'account.options', {

    url: '/',
    templateUrl: '/js/account/orders/options.html',
    controller: 'AccountOptionsCtrl',
    resolve: {
      'user' : function( AuthService ) {
        return AuthService.getLoggedInUser();
      }
    }

  })

}).controller( 'AccountOptionsCtrl', function ( $scope, user, UserFactory ) {

  $scope.user = user;

  $scope.saveUser = function() {
    var update = {
      email : $scope.user.email
    }

    UserFactory.update( user._id, update )
    .then( function( newUser ) {
      $scope.user = newUser;
    });
  }

  $scope.savePassword = function() {
    if ( $scope.passReset.new !== $scope.passReset.confirm ) {
      $scope.error = "New password must match confirmed password";
      return;
    }

    var update = {
      password : $scope.passReset.new
    }

    UserFactory.update( user._id, update )
    .then( function( newUser ) {
      $scope.user = newUser;
    });
  }

})