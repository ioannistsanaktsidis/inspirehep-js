(function(angular) {

  function modalInstanceCtrl($scope, $uibModalInstance, exportAPI) {
    var vm = this;

    vm.formats = ['BibTex', 'LaTex(EU)', 'LaTex(US)'];

    // This will contain the export text
    vm.exportContent = null;

    // Keeps loading state
    vm.loading = false;
    
    // Format to export
    vm.exportFormat = 'BibTex';

    vm.changeFormat = changeFormat;

    vm.closeModal = closeModal;

    // Run initial import
    activate();

    function activate() {
      loadFormat(vm.exportFormat, vm.recid);
    }

    function closeModal() {
      vm.$close(); // Available from inspireCiteModal scope
    }

    function changeFormat(format) {
       vm.exportFormat = format;
    }

    function loadFormat(format) {

      vm.loading = true;

      exportAPI
        .getFormat(format, vm.recid)
        .then(successfulRequest, erroredRequest)
        .finally(clearRequest);

      function successfulRequest(response) {
        vm.exportContent = response.data;
      }

      function erroredRequest(data) {
        console.log('Error request');
      }

      function clearRequest() {
        vm.loading = false;
      }
    }

    $scope.$watch('vm.exportFormat', loadFormat);
   
  }

  modalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'exportAPI'];

  angular.module('citemodal.controllers', [])
    .controller('modalInstanceCtrl', modalInstanceCtrl);

})(angular);
