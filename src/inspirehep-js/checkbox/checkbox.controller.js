(function(angular) {

  function checkboxCtrl($scope, exportRecords) {
    
    $scope.loadIdsToExport = loadIdsToExport;
    $scope.getAllIdsToExport = getAllIdsToExport;
    $scope.$parent.vm.enable_cite_button = false;
    $scope.isChecked = isChecked;
    
    function loadIdsToExport(recid) {
      exportRecords.addIdsToExport(recid);
      $scope.$parent.vm.enable_cite_button = exportRecords.getIdsToExport().length > 0;
    }

    function isChecked(recid) {
      return exportRecords.getIdsToExport().indexOf(recid) !== -1;
    }

    function getAllIdsToExport() {
      angular.forEach($scope.$parent.vm.invenioSearchResults.hits.hits, function(record, key) {
        exportRecords.addIdsToExport(record.id);
      }); 
      $scope.$parent.vm.enable_cite_button = exportRecords.getIdsToExport().length > 0;
    }
   
  }

  checkboxCtrl.$inject = ['$scope', 'exportRecords'];

  angular.module('checkbox.controllers', [])
    .controller('checkboxCtrl', checkboxCtrl);

})(angular);
