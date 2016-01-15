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
    p = sanitizeProduct( p );
    ProductFactory.updateProduct( pid, p )
    .then( prepareProduct )
    .then( function( updatedP ) {
      p = prepareProduct( updatedP );
    });

  }

  $scope.createProduct = function( p ) {

    console.log("creating product!")

    p = sanitizeProduct( p );
    ProductFactory.createNewProduct( p )
    .then( function( newProduct ) {
      p = {};
      $scope.products.push( prepareProduct( newProduct ) );
    });

  }

  $scope.deleteProduct = function( p ) {

    ProductFactory.deleteProduct( p._id );

  }

  ProductFactory.getAllProducts()
  .then( function( products ) {

    $scope.products = products.map( prepareProduct );
  
  })

});