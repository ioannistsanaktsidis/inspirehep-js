(function(angular) {

  function exportAPI($http) {

    var service = {
      getFormat: getFormat
    };

    return service;

    function getFormat(format, id) {

      var params = {};
      var record_api = '';
      if (id instanceof Array) {
        var control_numbers = [];
        record_api = '/api/literature/?size=25&q=';

        angular.forEach(id, function(value, key) {
          control_numbers.push('control_number:' + value); 
        });

        record_api += control_numbers.join('+OR+');  
      } else {
        record_api = '/api/literature/' + id;        
      }
      
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
        case 'CV format (LaTex)':
          params['headers'] = {
            'Accept': 'application/x-cvformatlatex'
          };
          break;
        case 'CV format (html)':
          params['headers'] = {
            'Accept': 'application/x-cvformathtml'
          };
          break;
        case 'CV format (text)':
          params['headers'] = {
            'Accept': 'application/x-cvformattext'
          };
          break;
      }
      
      return $http.get(record_api, params);
    }
  
  }

  // Inject the necessary angular services
  exportAPI.$inject = ['$http'];

  angular.module('citemodal.services', [])
    .service('exportAPI', exportAPI);

})(angular);
