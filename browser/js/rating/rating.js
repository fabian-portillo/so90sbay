app.directive('starRating', function() {

  return {
    restrict: 'E',
    templateUrl: 'js/rating/rating.html',
    scope: {
      stars: '='
    },
    link: function( scope ) {

      scope.starIcon = function( value ) {
        return scope.stars >= value ? "glyphicon-star" : "glyphicon-star-empty";
      }

    }
  }

})