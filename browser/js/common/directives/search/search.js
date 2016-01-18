app.directive('search', function ($rootScope, $state, SearchFactory) {

    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/search/search.html',
        link: function (scope) {
            scope.search = SearchFactory.search;
        }

    };

});
