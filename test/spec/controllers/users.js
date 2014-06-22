describe('UsersCtrl', function () {

    beforeEach(module('app'));

    var UsersCtrl,
        scope;

    beforeEach(inject(function ($controller, $rootScope) {
        scope = $rootScope.$new();
        UsersCtrl = $controller('UsersCtrl', {
            $scope: scope
        });
    }));

    it('should have a list of users', function () {
        expect(scope.users.length).toBe(3);
    });

});