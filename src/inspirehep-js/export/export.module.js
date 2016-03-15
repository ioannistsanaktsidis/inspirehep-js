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
