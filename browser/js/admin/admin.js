app.config( function ( $stateProvider ) {

  var installed_panels = [
    'products',
    'users',
    'orders'
  ];

  $stateProvider.state( 'adminControlPanel', { 

    url: '/admin',
    templateUrl: '/js/admin/admin.html',
    controller: 'AdminCtrl',
    resolve: {
      'isAdmin' : function( AuthService ) {
        return AuthService.getLoggedInUser( true )
        .then( function( user ) {
          return user !== null && user.isAdmin;
        });
      },
      'panels' : function() { return installed_panels }
    }

  });

  installed_panels = installed_panels.map( function( panel ) {
    var panelInstance = {
      name: panel,
      niceName : panel[0].toUpperCase() + panel.slice( 1 ),
      src : '/js/admin/panels/' + panel + '.js',
      templateSrc : '/js/admin/panels/' + panel + '.html',
    }

    $stateProvider.state( 'adminControlPanel.' + panelInstance.name, {

      url: '/' + panelInstance.name + '?search',
      templateUrl: panelInstance.templateSrc,
      controller: panelInstance.niceName + 'PanelCtrl',
      resolve: {
        'search' : function( $stateParams ) {
          return $stateParams.search;
        }
      }
      // resolve: {
      //   'panel' : function() { return panelInstance }
      // }

    });

    return panelInstance;
  });

}).controller( 'AdminCtrl', function( $scope, $state, isAdmin, panels ) {

  if ( !isAdmin ) {
    
    console.log( "You aren't authorized to view this page" );
    $state.go('home');

  }

  $scope.panels = panels;

});