app.config( function( $stateProvider ) {

  $stateProvider.state( 'account', {

    url: '/account',
    templateUrl: '/js/account/account.html',
    controller: 'AccountCtrl',
    resolve: {
      'user' : function( AuthService ) {
        return AuthService.getLoggedInUser();
      }
    }

  })

}).controller( 'AccountCtrl', function ( $scope, user ) {

  $scope.user = user;
  $scope.navOptions = [

    { name: "Account Options", state: "options" },
    { name: "Order History", state: "orderHistory" }

  ];

})