app.controller('QuicklookModalCtrl', function ($scope, $uibModal, $log) {

  $scope.animationsEnabled = true;

  $scope.open = function (product) {

    var modalInstance = $uibModal.open({
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