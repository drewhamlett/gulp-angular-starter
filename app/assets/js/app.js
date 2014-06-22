var app = angular.module('app', [
    'ngRoute',
    'ui.bootstrap',
    'restangular',
    'pasvaz.bindonce'
]);

app.run(function ($rootScope, $http, $location, $route) {
    $rootScope.$route = $route;
});

app.config(function ($routeProvider) {
    $routeProvider.
    when('/', {
        templateUrl: 'assets/partials/index.html',
        controller: 'HomeCtrl',
        active: 'home'
    }).
    when('/users', {
        templateUrl: 'assets/partials/users/index.html',
        controller: 'UsersCtrl',
        active: 'users'
    }).
    otherwise({
        redirectTo: '/'
    });
});

app.controller('HomeCtrl', function ($scope, $http) {
    $scope.users = [];
});