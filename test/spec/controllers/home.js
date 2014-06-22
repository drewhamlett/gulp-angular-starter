describe('Controller: HomeCtrl', function () {

    beforeEach(module('app'));

    var HomeCtrl,
        scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        HomeCtrl = $controller('HomeCtrl', {
            $scope: scope
        });
    }));
});