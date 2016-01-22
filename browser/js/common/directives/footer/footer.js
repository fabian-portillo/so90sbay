app.directive('footer', function () {

    return {
        restrict: 'E',
        scope: {},
        templateUrl: 'js/common/directives/footer/footer.html',
        link: function (scope) {

            scope.items = [
                { label: 'Terms of Use', state: 'home' }
            ];


        }

    };

});
