app.directive('sidebar', function (SidebarFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/common/directives/sidebar/sidebar.html',
    link: function (scope, element, attrs) {

      scope.categories = [
        { label: 'Toys', state: 'toys' },
        { label: 'Posters', state: 'posters' },
        { label: 'Video Games', state: 'video games' },
        { label: 'Stuffed Animals', state: 'stuffed animals' },
        { label: 'Clothing', state: 'clothing' },
        { label: 'Music', state: 'music' }
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
