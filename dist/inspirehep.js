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

(function(angular) {

  function modalInstanceCtrl($scope, $uibModalInstance, exportAPI, recid) {
    var vm = this;

    vm.formats = ['BibTex', 'LaTex(EU)', 'LaTex(US)'];

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
