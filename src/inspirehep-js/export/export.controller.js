(function(angular) {

  function exportModalInstanceCtrl($scope, $uibModalInstance, exportAPI, exportRecords) {
    var vm = this;

    vm.formats = ['BibTex', 'LaTex(EU)', 'LaTex(US)', 'CV format (LaTex)', 'CV format (html)', 'CV format (text)'];

    // This will contain the recids to export
    vm.recidsToExport = [];

    // This will contain the export text
    vm.exportAllContent = '';

    // Keeps loading state
    vm.loading = false;
    
    // Format to export
    vm.exportFormat = 'BibTex';

    vm.changeFormat = changeFormat;

    vm.closeModal = closeModal;

    vm.loadFormat = loadFormat;

    // Run initial import
    activate();

    function activate() {
      vm.loadFormat();
    }

    function closeModal() {
      $uibModalInstance.close();
    }

    function changeFormat(format) {
      vm.exportAllContent = '';
      vm.exportFormat = format;
    }

    function exportFormatChanged(newValue, oldValue) {
      if (newValue === oldValue) {
        return;
      }

      vm.loadFormat();
    }

    function loadFormat() {

      vm.loading = true;

      vm.recidsToExport = exportRecords.getIdsToExport();
      
      angular.forEach(vm.recidsToExport, function(id, key) {
        exportAPI
          .getFormat(vm.exportFormat, id)
          .then(successfulRequest, erroredRequest)
          .finally(clearRequest);
        });
      

      function successfulRequest(response) {
        vm.exportAllContent += response.data + '\n';
      }

      function erroredRequest(data) {
        console.log('Error request');
      }

      function clearRequest() {
        vm.loading = false;
      }
    }

    $scope.$watch('vm.exportFormat', exportFormatChanged);
   
  }

  exportModalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'exportAPI', 'exportRecords'];

  angular.module('export.controllers', [])
    .controller('exportModalInstanceCtrl', exportModalInstanceCtrl);

})(angular);
