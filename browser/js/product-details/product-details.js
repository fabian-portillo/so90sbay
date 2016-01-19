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

}).controller( 'ProductDetailCtrl', function ( $scope, product, userId, reviews, Cart, ReviewFactory, ProductFactory, UserFactory, AuthService, $rootScope ) {

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
    if (userId !== null) return true;
    return false;
  }

  $scope.loggedIn = $scope.checkUser();

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

  $rootScope.$on('reviewsUpdated', function () {
      ProductFactory.getProductReviews($scope.product._id)
      .then(function(newReviews){
        $scope.product.reviews = newReviews;
        $scope.setEmail($scope.product.reviews);
      })
    });

  $scope.addReview = function () {
    ReviewFactory.addReview($scope.newReview)
    .then(function() {
      $scope.newReview = {
        title: null,
        body: null,
        rating: null,
        user: userId._id,
        product: product._id
      };
      $scope.newReviewForm.$setPristine();
      $scope.newReviewForm.$setUntouched();
      $scope.hideForm();
    });
  }

  $scope.getId = function (item){
    return item.user;
  }

  $scope.getEmail = function(user){
    return UserFactory.getEmail(user);
  }

  $scope.setEmail = function(review){
    var ids = review.map($scope.getId);
    var emails = ids.map($scope.getEmail);

    Promise.all(emails)
    .then(function(emails){
      for (var i = 0; i < emails.length; i++) {
        $scope.product.reviews[i].userEmail = emails[i];
      }
        $scope.$digest();
    })
  }

  $scope.setEmail($scope.product.reviews);
  
});