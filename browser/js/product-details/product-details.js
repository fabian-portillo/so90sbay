app.config( function ( $stateProvider ) {

  $stateProvider.state( 'productDetails', {

    url: '/products/:productId',
    templateUrl: '/js/product-details/product-details.html',
    controller: 'ProductDetailCtrl',
    resolve: {
      'product' : function( ProductFactory, $stateParams ) {
        return ProductFactory.getProductById( $stateParams.productId );
      },
      'reviews' : function( ProductFactory, $stateParams ) {
        return ProductFactory.getProductReviews( $stateParams.productId );
      },
      'userId': function (AuthService) {
        return AuthService.getLoggedInUser();
      }
    }

  });

}).controller( 'ProductDetailCtrl', function( $scope, product, userId, reviews, Cart, ReviewFactory, ProductFactory, AuthService ) {

  $scope.product = product;
  $scope.product.reviews = reviews;

  $scope.mainImage = $scope.product.photo[0];

  $scope.addToCart = function() {
    Cart.add( 1, $scope.product._id );
  }

  $scope.changeMainImage = function( image ) {
    $scope.mainImage = image;
  }

  $scope.visible = false;


  $scope.showForm = function() {
    $scope.visible = true;
    $scope.newReview = {
      title: null,
      body: null,
      rating: null,
      user: userId._id,
      product: product._id
    }
  }

  $scope.hideForm = function(){
    $scope.visible = false;
    $scope.newReviewForm.$setPristine();
    $scope.newReviewForm.$setUntouched();
  }

  $scope.checkUser = function () {
    console.log(userId);
    if (userId !== null) return true;
    return false;
  }

  $scope.loggedIn = $scope.checkUser();

  console.log($scope.loggedIn);

  $scope.newReview = {
    title: null,
    body: null,
    rating: null,
    user: userId,
    product: product._id
  }


  $scope.setRating = function(rate) {
    $scope.newReview.rating = rate;
    $scope.currentRating = rate;
  }

  $scope.stars = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5
  };

  $scope.addReview = function () {
    ReviewFactory.addReview($scope.newReview)
    .then(function(review) {
      $scope.newReview = {
        title: null,
        body: null,
        rating: null,
        user: userId._id,
        product: product._id
      };
      $scope.newReviewForm.$setPristine();
      $scope.newReviewForm.$setUntouched();
    });
  }
  

});