(function(angular) {

  function checkboxCtrl($scope, exportRecords) {
    
    $scope.loadIdsToExport = loadIdsToExport;
    $scope.getAllIdsToExport = getAllIdsToExport;
    $scope.$parent.vm.enable_cite_button = false;
    $scope.isChecked = isChecked;
    $scope.allChecked = allChecked;
    
    function loadIdsToExport(recid) {
      exportRecords.toggleIdToExport(recid);
      $scope.$parent.vm.enable_cite_button = exportRecords.getIdsToExport().length > 0;
    }

    function isChecked(recid) {
      return exportRecords.getIdsToExport().indexOf(recid) !== -1;
    }

    function allChecked() {
      return _check_if_all_ids_added();
    }

    function getAllIdsToExport() {
      
      var remove_all = _check_if_all_ids_added();
      angular.forEach($scope.$parent.vm.invenioSearchResults.hits.hits, function(record, key) {  
        if (remove_all) {
          exportRecords.removeIdFromExport(record.id);  
        } else {
          exportRecords.addIdToExport(record.id);  
        }
      }); 
      $scope.$parent.vm.enable_cite_button = exportRecords.getIdsToExport().length > 0;
    }

    function _check_if_all_ids_added() {
      try {      
        return $scope.$parent.vm.invenioSearchResults.hits.hits.length === exportRecords.getIdsToExport().length;
      } catch(err) {
        return false;
      }
    }
   
  }

  checkboxCtrl.$inject = ['$scope', 'exportRecords'];

  angular.module('checkbox.controllers', [])
    .controller('checkboxCtrl', checkboxCtrl);

})(angular);
