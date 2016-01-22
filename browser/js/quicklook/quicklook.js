app.controller('QuicklookModalCtrl', function ($scope, $uibModal) {

  $scope.animationsEnabled = true;

  $scope.open = function (product) {


//THIS IS SHOWING UP IN THE LINTER AS BEING DEFINED BUT NEVER USED
//DO WE NEED THIS????
  $uibModal.open({
      animation: $scope.animationsEnabled,
      templateUrl: 'js/quicklook/quicklook.html',
      controller: 'ModalInstanceCtrl',
      size: 'md',
      resolve: {
        theProduct: function () {
          return product;
        }
      }
    });
  };


})

.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, theProduct) {

  $scope.close = () => {
    $uibModalInstance.close(); 
  }

  $scope.product = theProduct;


});