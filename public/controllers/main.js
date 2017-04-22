angular.module('nhs')

    .controller('main', ['$scope', '$rootScope', '$state', 'Auth', function($scope, $rootScope, $state, Auth) {
        $rootScope.user = $rootScope.user || {};

        $scope.getState = function() {
            return $state.current.name;
        };

        $rootScope.$on('$stateChangeStart', function(event, toState, toParams, fromState, fromParams, options) {
            if (toState.name === "signup") return;

            Auth.getUser()
                .then(function(data) {
                    $rootScope.user = data.data;
					var admin = data.data.admin;
                    $rootScope.user.loggedIn = true;
                    Object.defineProperty($rootScope.user, 'admin', {
                        set: function() {
                            throw new Error('Sike you thought');
                        },
                        get: function() {
                            return admin;
                        }
                    });
                })
                .catch(function(err) {
                    if (toState.name !== "login") $state.go('login');
                });

        });

        $scope.logout = function() {
            Auth.logout();
            $rootScope.user = {};
            $rootScope.user.loggedIn = false;
            $state.go("login");
            location.reload(true);
        };

    }]);
