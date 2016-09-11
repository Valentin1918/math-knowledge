var app = angular.module('app', ['dependencies']);
app.run(['$rootScope', '$state', '$stateParams',
    function ($rootScope, $state, $stateParams) {
        // Set some reference to access them from any scope
        $rootScope.$state = $state;
        $rootScope.$stateParams = $stateParams;
        // GLOBAL APP SCOPE
        $rootScope.app = {
            name: 'Math knowledge',
            author: 'Grekulov Valentyn',
            description: 'App for pupils to check their math knowledge',
            version: '1.0',
            year: ((new Date()).getFullYear()), // (for copyright information)
            defaultLayout: {
                logo: 'assets/images/logo.png' // relative path of the project logo
            }
        };
        $rootScope.app.layout = angular.copy($rootScope.app.defaultLayout);
        $rootScope.user = {
            name: 'Valentyn',
            job: 'JS dev'
        };
    }]);