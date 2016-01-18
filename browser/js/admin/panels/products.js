app.controller( 'ProductsPanelCtrl', function( $scope, ProductFactory ) {

  function splitAndTrim( str, del ) {

    if ( !str ) return undefined;
    return str.split( del ).map( function( substr ) {
      return substr.trim();
    });

  }

  function sanitizeProduct( p ) {

    p.category = splitAndTrim( p.categoryString, ',' );
    p.photo = splitAndTrim( p.photoString, '\n' );

    delete p.categoryString;
    delete p.photoString;
    delete p._id;
    delete p.__v;

    return p;

  }

  function prepareProduct( p ) {

    p.categoryString = p.category.join(',');
    p.photoString = p.photo.join('\n');
    return p;

  }

  $scope.saveProduct = function( p ) {

    var pid = p._id;
    ProductFactory.updateProduct( pid, sanitizeProduct( p ) )
    .then( prepareProduct )
    .then( function( updatedP ) {
      p = updatedP;
    });

  }

  $scope.createProduct = function( p ) {

    ProductFactory.createNewProduct( sanitizeProduct( p ) )
    .then( prepareProduct )
    .then( function( newProduct ) {
      p = {};
      $scope.products.push( newProduct );
    });

  }

  $scope.deleteProduct = function( p ) {

    if( confirm( "Are you sure you want to delete " + p.title + "? This action cannot be undone.") ) {
      ProductFactory.deleteProduct( p._id )
      .then( function() {
        var pidx = $scope.products.indexOf( p );

        if ( pidx > -1 ) $scope.products.splice( pidx, 1 );
      });
    }

  }

  ProductFactory.getAllProducts()
  .then( function( products ) {

    $scope.products = products.map( prepareProduct );
  
  })

});