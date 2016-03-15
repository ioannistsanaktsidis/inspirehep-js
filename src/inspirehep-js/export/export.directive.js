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
