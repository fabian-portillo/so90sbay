app.directive('productThumbnail', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/product-thumbnail/product-thumbnail.html',
        scope: {
        	product: '='
        }
    };

});