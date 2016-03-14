(function(angular) {

  angular.module('inspirehep', [
    'citemodal'
  ]);

})(angular);

(function(angular) {

  angular.module('citemodal', [
    'ui.bootstrap',
    'citemodal.directives',
    'citemodal.services',
    'citemodal.controllers'
  ]);

})(angular);

(function(angular) {

  function modalInstanceCtrl($scope, $uibModalInstance, exportAPI) {
    var vm = this;

    vm.formats = ['BibTex', 'LaTex(EU)', 'LaTex(US)'];

    // This will contain the export text
    vm.exportContent = null;

    // Keeps loading state
    vm.loading = false;
    
    // Format to export
    vm.exportFormat = 'BibTex';

    vm.changeFormat = changeFormat;

    vm.closeModal = closeModal;

    // Run initial import
    activate();

    function activate() {
      loadFormat(vm.exportFormat, vm.recid);
    }

    function closeModal() {
      vm.$close(); // Available from inspireCiteModal scope
    }

    function changeFormat(format) {
       vm.exportFormat = format;
    }

    function loadFormat(format) {

      vm.loading = true;

      exportAPI
        .getFormat(format, vm.recid)
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

    $scope.$watch('vm.exportFormat', loadFormat);
   
  }

  modalInstanceCtrl.$inject = ['$scope', '$uibModalInstance', 'exportAPI'];

  angular.module('citemodal.controllers', [])
    .controller('modalInstanceCtrl', modalInstanceCtrl);

})(angular);

(function(angular) {

  function inspireCiteModal($uibModal) {

    function link(scope, element, attrs) {
      scope.recid = attrs.recid;

      scope.openModal = function (size) {
        var modalInstance = $uibModal.open({
          animation: true,
          templateUrl: attrs.bodyTemplate,
          size: size,
          bindToController: true, // Allows controller to access, e.g close function
          controller: 'modalInstanceCtrl',
          controllerAs: 'vm',
          scope: scope // Needed for recid to be accessible by controller
        });
      };
    }

    function templateUrl(element, attrs) {
      return attrs.buttonTemplate;
    }

    return {
        templateUrl: templateUrl, // Button that will trigger the modal
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
