(function(angular) {

  angular.module('inspirehep', [
    'citemodal',
    'export',
    'checkbox'
  ]);

})(angular);

(function(angular) {

  angular.module('checkbox', [
    'checkbox.controllers',
    'checkbox.services'
  ]);

})(angular);

(function(angular) {

  angular.module('citemodal', [
    'ngclipboard',
    'ui.bootstrap',
    'citemodal.directives',
    'citemodal.services',
    'citemodal.controllers'
  ]);

  angular.module('citemodal').config(['$uibTooltipProvider', function($uibTooltipProvider){
    $uibTooltipProvider.setTriggers({
      'click': 'mouseleave',     
    });
  }]);
             

})(angular);

(function(angular) {

  angular.module('export', [
    'ngclipboard',
    'ngSanitize',
    'ui.bootstrap',
    'export.directives',
    'export.controllers'
  ]);

  angular.module('export').config(['$uibTooltipProvider', function($uibTooltipProvider){
    $uibTooltipProvider.setTriggers({
      'click': 'mouseleave',     
    });
  }]);
             

})(angular);

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

(function(angular) {

  function modalInstanceCtrl($scope, $uibModalInstance, exportAPI, recid) {
    var vm = this;

    vm.formats = {
      'BibTex': 'bib',
      'LaTex(EU)': 'tex',
      'LaTex(US)': 'tex',
      'CV format (LaTex)': 'tex',
      'CV format (html)': 'html',
      'CV format (text)': 'txt'
    };

    // Record id to export
    vm.recid = recid;

    // This will contain the export text
    vm.exportContent = null;

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
       vm.exportFormat = format;
    }

    function downloadFormat(){
      var blob = new Blob([ vm.exportContent ], { type : 'text/plain' });
      var response_data = 'text/plain;charset=utf-8,' + encodeURIComponent(vm.exportContent);
      var trigger_element = angular.element('<a id="data-download" href="data:' +
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

      exportAPI
        .getFormat(vm.exportFormat, vm.recid)
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

    $scope.$watch('vm.exportFormat', exportFormatChanged);
   
  }

  modalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'exportAPI', 'recid'];

  angular.module('citemodal.controllers', [])
    .controller('modalInstanceCtrl', modalInstanceCtrl);

})(angular);

(function(angular) {

  function inspireCiteModal($uibModal) {

    function link(scope, element, attrs) {

      scope.openModal = function (size) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: attrs.bodyTemplate,
          size: size,
          controller: 'modalInstanceCtrl',
          controllerAs: 'vm',
          resolve: {
            recid: function() {
              return attrs.recid;
            }
          }
        });
      };
    }

    function templateUrl(element, attrs) {
      return attrs.buttonTemplate;
    }

    return {
        templateUrl: templateUrl,
        restrict: 'E',
        scope: false,
        link:link
      };
  }

  inspireCiteModal.$inject = ['$uibModal'];

  angular.module('citemodal.directives', [])
    .directive('inspireCiteModal', inspireCiteModal);

})(angular);

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

(function(angular) {

  function inspireExportModal($uibModal) {

    function link(scope, element, attrs) {

      scope.openModal = function (size) {
        
        if(scope.vm.enable_cite_button) {
          var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: attrs.bodyTemplate,
            size: size,
            controller: 'exportModalInstanceCtrl',
            controllerAs: 'vm',
            resolve: {
              recid: function() {
                return attrs.recid;
              }
            }
          });
        }
      };
    }

    function templateUrl(element, attrs) {
      return attrs.buttonTemplate;
    }

    return {
        templateUrl: templateUrl,
        restrict: 'E',
        scope: false,
        link:link
      };
  }

  inspireExportModal.$inject = ['$uibModal'];

  angular.module('export.directives', [])
    .directive('inspireExportModal', inspireExportModal);

})(angular);
