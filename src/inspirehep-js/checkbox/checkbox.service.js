(function(angular) {

  function exportRecords() {

    var recids = [];
    var service = {
      addIdToExport: addIdToExport,
      removeIdFromExport: removeIdFromExport,
      toggleIdToExport: toggleIdToExport,
      getIdsToExport: getIdsToExport
    };

    return service;

    function getIdxForRecid(recid) {
      return recids.indexOf(recid);
    }

    function addRecid(idx, recid) {
      if (idx === -1) {
        recids.push(recid);
      }
    }

    function removeRecid(idx, recid) {
      if (idx > -1) {
        recids.splice(idx, 1);
      }
    }
    
    function addIdToExport(recid) {
      var idx = getIdxForRecid(recid);
      addRecid(idx, recid);
    }

    function removeIdFromExport(recid) {
      var idx = getIdxForRecid(recid);
      removeRecid(idx, recid);
    }    

    function toggleIdToExport(recid) {            
      var idx = getIdxForRecid(recid);
      if (idx > -1) {
        removeRecid(idx, recid);
      } else {
        addRecid(idx, recid);
      }
    }

    function getIdsToExport(){
      return recids;
    }
   
  }

  angular.module('checkbox.services', [])
    .service('exportRecords', exportRecords);

})(angular);
