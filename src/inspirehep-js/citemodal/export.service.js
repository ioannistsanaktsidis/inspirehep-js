(function(angular) {

  function exportAPI($http) {

    var service = {
      getFormat: getFormat
    };

    return service;

    function getFormat(format, id) {

      var params = {};

      var record_api = '/api/literature/' + id;

      switch (format) {
        case 'BibTex':
          params['headers'] = {
            'Accept': 'application/x-bibtex'
          };
          break;
        case 'LaTex(EU)':
          params['headers'] = {
            'Accept': 'application/x-latexeu'
          };
          break;
        case 'LaTex(US)':
          params['headers'] = {
            'Accept': 'application/x-latexus'
          };
          break;
        // Add default ?
      }
      return $http.get(record_api, params);
    }
  
  }

  // Inject the necessary angular services
  exportAPI.$inject = ['$http'];

  angular.module('citemodal.services', [])
    .service('exportAPI', exportAPI);

})(angular);
