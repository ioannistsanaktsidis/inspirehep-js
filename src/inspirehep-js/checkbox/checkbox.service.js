(function(angular) {

  function exportRecords() {

    var recids = [];
    var service = {
      addIdsToExport: addIdsToExport,
      getIdsToExport: getIdsToExport
    };

    return service;

    // Record ids to export
    function addIdsToExport(recid) {            
      var idx = recids.indexOf(recid);
      if (idx > -1) {
        recids.splice(idx, 1);
      } else {
        recids.push(recid);
      }
    }

    function getIdsToExport(){
      return recids;
    }
   
  }

  angular.module('checkbox.services', [])
    .service('exportRecords', exportRecords);

})(angular);
