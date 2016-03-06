import faqDialogPartial from 'partials/dialog-faq.html';

export default function ($scope, ngDialog) {
  // Show footer when ngView is loaded
  $scope.$on('$viewContentLoaded', () => {
    $scope.showFooter = true;
  });

  $scope.faqDialog = function () {
    ngDialog.open({
      template: faqDialogPartial,
      plain: true,
    });
  };
}
