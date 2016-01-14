app.directive('sidebar', function (SidebarFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/common/directives/sidebar/sidebar.html',
    link: function (scope, element, attrs) {

      scope.categories = [
        { label: 'toys', state: 'products.toys' },
        { label: 'posters', state: 'products.posters' },
        { label: 'video games', state: 'products.video-games' },
        { label: 'stuffed animals', state: 'products.stuffed-animals' },
        { label: 'clothing', state: 'products.clothing' },
        { label: 'music', state: 'products.music' }
      ];

      scope.sidebarState = SidebarFactory.getSidebarState;
    }
  };
})
.directive('sidebarMover', function (SidebarFactory) {
  return {
    restrict: 'A',
    link: function (scope) {
      scope.sidebarState = SidebarFactory.getSidebarState;
    }
  };
});
