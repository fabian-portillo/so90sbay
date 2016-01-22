app.directive('sidebar', function (SidebarFactory) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: '/js/common/directives/sidebar/sidebar.html',
    link: function (scope) {

      scope.categories = [
        { label: 'Toys', state: 'toys' },
        { label: 'Posters', state: 'posters' },
        { label: 'Video Games', state: 'video games' },
        { label: 'Beanie Babies', state: 'beanie babies' },
        { label: 'Clothing', state: 'clothing' },
        { label: 'Music', state: 'music' },
        { label: 'Action Figures', state: 'action figures' },
        { label: 'Celebrity Playdates', state: 'celebrity playdate' },
        { label: 'Magic Cards', state: 'magic the gathering cards' },
        { label: 'Games', state: 'games' },
        { label: 'Sega', state: 'sega' },
        { label: 'Board Games', state: 'board games' },
        { label: 'Pokemon Cards', state: 'pokemon' },
        {label: 'Movies', state: 'vhs' }
      ];

      scope.sidebarState = SidebarFactory.getSidebarState;
      scope.toggleCategories = SidebarFactory.toggleCategories;
      
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
