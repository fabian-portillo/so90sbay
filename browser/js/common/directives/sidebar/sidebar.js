app.directive('sidebar', function (SidebarFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/common/directives/sidebar/sidebar.html',
    link: function (scope, element, attrs) {

      scope.categories = [
        { label: 'Toys', state: 'products.toys' },
        { label: 'Posters', state: 'products.posters' },
        { label: 'Video Games', state: 'products.video-games' },
        { label: 'Stuffed Animals', state: 'products.stuffed-animals' },
        { label: 'Clothing', state: 'products.clothing' },
        { label: 'Music', state: 'products.music' }
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
