(function(angular) {

  function exportModalInstanceCtrl($scope, $uibModalInstance, exportAPI, exportRecords) {
    var vm = this;

    vm.formats = {
      'BibTex': 'bib',
      'LaTex(EU)': 'tex',
      'LaTex(US)': 'tex',
      'CV format (LaTex)': 'tex',
      'CV format (html)': 'html',
      'CV format (text)': 'txt'
    };

    // This will contain the recids to export
    vm.recidsToExport = [];

    // This will contain the export text
    vm.exportAllContent = null;

    // Keeps loading state
    vm.loading = false;
    
    // Format to export
    vm.exportFormat = 'BibTex';

    vm.changeFormat = changeFormat;

    vm.closeModal = closeModal;

    vm.loadFormat = loadFormat;

    vm.downloadFormat = downloadFormat;

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

    function downloadFormat(){
      var blob = new Blob([ vm.exportAllContent ], { type : 'text/plain' });
      var response_data = 'text/plain;charset=utf-8,' + encodeURIComponent(vm.exportAllContent);
      var trigger_element =angular.element('<a id="data-download" href="data:' +
          response_data + '" download="' + vm.exportFormat +
          '.' + vm.formats[vm.exportFormat] + '">download</a>');
      trigger_element[0].click();
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
      
      exportAPI
          .getFormat(vm.exportFormat, vm.recidsToExport)
          .then(successfulRequest, erroredRequest)
          .finally(clearRequest);      

      function successfulRequest(response) {
        vm.exportAllContent = response.data;
        
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
