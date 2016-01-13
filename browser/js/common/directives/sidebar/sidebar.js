app.directive('sidebar', function () {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/common/directives/sidebar/sidebar.html',
    link: function (scope) {

      scope.categories = [
        { label: 'toys', state: 'products.toys' },
        { label: 'posters', state: 'products.posters' },
        { label: 'video games', state: 'products.video-games' },
        { label: 'stuffed animals', state: 'products.stuffed-animals' },
        { label: 'clothing', state: 'products.clothing' },
        { label: 'music', state: 'products.music' }
      ];


    }
  };
});
